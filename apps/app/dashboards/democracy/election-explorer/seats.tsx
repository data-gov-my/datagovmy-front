import ElectionCard, { Result } from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { toast } from "@components/Toast";
import { Container, Section } from "@components/index";
import { OptionType } from "@components/types";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import { generateSchema } from "@lib/schema/election-explorer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import ElectionLayout from "./layout";
import type { BaseResult, ElectionResource, ElectionType, Seat, SeatResult } from "./types";

/**
 * Election Explorer Dashboard - Seats Tab
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});

interface ElectionSeatsProps extends ElectionResource<Seat> {
  selection: Array<{
    seat_name: string;
    type: ElectionType;
  }>;
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

  const SEAT_OPTIONS: Array<OptionType> = selection.map(key => ({
    label: key.seat_name.concat(` (${t(key.type)})`),
    value: key.seat_name,
  }));

  const navigateToSeat = (name?: string) => {
    if (!name) {
      setData("seat", null);
      return;
    }
    setData("loading", true);
    setData("seat", name);

    push(`${routes.ELECTION_EXPLORER}/seats/${name}`, undefined, {
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
        .then(({ data }: { data: SeatResult }) => {
          const result: Result<BaseResult[]> = {
            data: data.data.sort((a, b) => b.votes.abs - a.votes.abs),
            votes: [
              {
                x: "voter_turnout",
                abs: data.votes.voter_turnout,
                perc: data.votes.voter_turnout_perc,
              },
              {
                x: "rejected_votes",
                abs: data.votes.votes_rejected,
                perc: data.votes.votes_rejected_perc,
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
            title={
              <div className="uppercase md:flex md:flex-row md:items-center md:gap-2">
                <h5 className="text">{area}</h5>
                <h5 className="text-dim font-normal">{state}</h5>
              </div>
            }
            subtitle
            options={elections}
            page={row.index}
          />
        );
      },
    },
  ]);

  return (
    <ElectionLayout>
      <Container className="min-h-fit">
        <Section>
          <div className="grid grid-cols-12">
            <div className="col-span-full col-start-1 lg:col-span-10 lg:col-start-2">
              <h4 className="text-center">{t("seat.header")}</h4>
              <div className="grid grid-cols-12 pb-12 pt-6 lg:grid-cols-10">
                <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-4">
                  <ComboBox
                    placeholder={t("seat.search_seat")}
                    options={SEAT_OPTIONS}
                    selected={data.seat ? SEAT_OPTIONS.find(e => e.value === data.seat) : null}
                    onChange={selected => navigateToSeat(selected?.value)}
                    enableType={true}
                  />
                </div>
              </div>
              <ElectionTable
                title={
                  <div className="pb-6 font-bold">
                    {t("seat.title")}
                    <span className="text-primary">{params.seat_name}</span>
                  </div>
                }
                data={elections}
                columns={seat_schema}
                isLoading={data.loading}
              />
            </div>
          </div>
        </Section>
      </Container>
    </ElectionLayout>
  );
};

export default ElectionSeatsDashboard;
