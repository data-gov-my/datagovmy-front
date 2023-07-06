import ElectionLayout from "./layout";
import type { BaseResult, ElectionResource, Seat, SeatOptions, SeatResult } from "./types";
import ElectionCard, { Result } from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { Container, Section } from "@components/index";
import { toast } from "@components/Toast";
import { OptionType } from "@components/types";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { slugify } from "@lib/helpers";
import { routes } from "@lib/routes";
import { generateSchema } from "@lib/schema/election-explorer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

/**
 * Election Explorer Dashboard - Seats Tab
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});

interface ElectionSeatsProps extends ElectionResource<Seat> {
  selection: Array<SeatOptions>;
}

const ElectionSeatsDashboard: FunctionComponent<ElectionSeatsProps> = ({
  params,
  selection,
  elections,
}) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);
  const { push } = useRouter();
  const { cache } = useCache();

  const { data, setData } = useData({
    seat: params.seat_name,
    loading: false,
  });

  const SEAT_OPTIONS: Array<OptionType & SeatOptions & { seat_area: string }> = selection.map(
    key => ({
      label: key.seat_name.concat(` (${t(key.type)})`),
      value: key.type + "_" + slugify(key.seat_name),
      seat_area: key.seat_name.split(", ")[1],
      seat_name: key.seat_name.split(", ")[0],
      type: key.type,
    })
  );

  const navigateToSeat = (seat?: string) => {
    if (!seat) {
      setData("seat", null);
      return;
    }
    setData("loading", true);

    const match = seat.split("_");
    const name = match[1];
    const type = match[0];
    setData("seat", name);

    push(`${routes.ELECTION_EXPLORER}/seats/${name}/${type}`, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => {
      setData("loading", false);
      cache.clear();
    });
  };

  const fetchResult = async (election: string, seat: string): Promise<Result<BaseResult[]>> => {
    const identifier = `${election}_${seat}`;
    return new Promise(resolve => {
      if (cache.has(identifier)) return resolve(cache.get(identifier));
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "full_result",
        type: "candidates",
        election,
        seat,
      })
        .then(({ data }: { data: { data: SeatResult } }) => {
          const data2 = data.data;
          const result: Result<BaseResult[]> = {
            data: data2.data.sort((a, b) => b.votes.abs - a.votes.abs),
            votes: [
              {
                x: "majority",
                abs: data2.votes.majority,
                perc: data2.votes.majority_perc,
              },
              {
                x: "voter_turnout",
                abs: data2.votes.voter_turnout,
                perc: data2.votes.voter_turnout_perc,
              },
              {
                x: "rejected_votes",
                abs: data2.votes.votes_rejected,
                perc: data2.votes.votes_rejected_perc,
              },
            ],
          };
          cache.set(identifier, result);
          resolve(result);
        })
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    });
  };

  const seat_schema = generateSchema<Seat>([
    {
      key: "election_name",
      id: "election_name",
      header: t("election_name"),
    },
    { key: "seat", id: "seat", header: t("constituency") },
    {
      key: "party",
      id: "party",
      header: t("winning_party"),
    },
    { key: "name", id: "name", header: t("candidate_name") },
    { key: "majority", id: "majority", header: t("majority") },
    {
      key: item => item,
      id: "full_result",
      header: "",
      cell: ({ row, getValue }) => {
        const item = getValue() as Seat;
        const [area, state] = item.seat.split(",");

        return (
          <ElectionCard
            defaultParams={item}
            onChange={(option: Seat) => fetchResult(option.election_name, option.seat)}
            columns={generateSchema<BaseResult>([
              { key: "name", id: "name", header: t("candidate_name") },
              {
                key: "party",
                id: "party",
                header: t("party_name"),
              },
              {
                key: "votes",
                id: "votes",
                header: t("votes_won"),
              },
            ])}
            options={elections}
            page={row.index}
          />
        );
      },
    },
  ]);

  return (
    <Container>
      <Section>
        <div className="xl:grid xl:grid-cols-12">
          <div className="xl:col-span-10 xl:col-start-2">
            <h4 className="text-center">{t("seat.header")}</h4>
            <div className="py-6">
              <div className="mx-auto w-full px-6 sm:w-[400px]">
                <ComboBox
                  placeholder={t("seat.search_seat")}
                  options={SEAT_OPTIONS}
                  config={{
                    baseSort: (a, b) => {
                      if (a.item.seat_name === b.item.seat_name) {
                        return a.item.type === "parlimen" ? -1 : 1;
                      } else {
                        return String(a.item.seat_name).localeCompare(String(b.item.seat_name));
                      }
                    },
                    keys: ["seat_name", "seat_area", "type"],
                  }}
                  selected={
                    data.seat
                      ? SEAT_OPTIONS.find(e => e.value === `${params.type}_${data.seat}`)
                      : null
                  }
                  onChange={selected => navigateToSeat(selected?.value)}
                  styleElectionType={true}
                />
              </div>
            </div>
            <ElectionTable
              title={
                <h5 className="py-6">
                  {t("seat.title")}
                  <span className="text-primary">{`${
                    SEAT_OPTIONS.find(e => e.value === `${params.type}_${params.seat_name}`)?.label
                  }`}</span>
                </h5>
              }
              data={elections}
              columns={seat_schema}
              isLoading={data.loading}
            />
          </div>
        </div>
      </Section>
    </Container>
  );
};

export default ElectionSeatsDashboard;
