import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { Container, Section } from "@components/index";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

import { generateSchema } from "@lib/schema/election-explorer";
import { useRouter } from "next/router";
import type { BaseResult, ElectionResource, ElectionType, Seat, SeatResult } from "./types";
import ElectionLayout from "./layout";
import { toast } from "@components/Toast";

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

  const { data, setData } = useData({
    seat: params?.seat_name,
    loading: false,
  });

  const SEAT_OPTIONS: Array<OptionType> = selection.map(key => ({
    label: key.seat_name.concat(` (${t(key.type)})`),
    value: key.seat_name,
  }));

  const navigateToSeat = (name?: string) => {
    if (!name) return;
    setData("loading", true);
    setData("seat", name);

    push(`${routes.ELECTION_EXPLORER}/seats/${name}`, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  const [area, state] = data.seat.split(",");

  const fetchResult = async (election: string, seat: string) => {
    return get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "seats",
      election,
      seat,
    })
      .then(({ data }: { data: SeatResult }) => {
        return {
          data: data.data.sort((a, b) => b.votes.abs - a.votes.abs),
          votes: [
            {
              x: "voter_turnout",
              y: data.votes.voter_turnout_perc,
            },
            {
              x: "rejected_votes",
              y: data.votes.votes_rejected_perc,
            },
          ],
        };
      })
      .catch(e => {
        toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
        console.error(e);
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
              <div className="block align-baseline uppercase md:flex md:flex-row md:items-center md:gap-2">
                <h5 className="text">{area}</h5>
                <p className="text-dim font-normal">{state}</p>
              </div>
            }
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
                    selected={
                      data.seat ? SEAT_OPTIONS.find(e => e.value === data.seat.value) : null
                    }
                    onChange={e => navigateToSeat(e?.value)}
                    enableType={true}
                  />
                </div>
              </div>
              <ElectionTable
                title={
                  <div className="flex flex-col uppercase md:flex-row md:gap-2">
                    <h5>{area}</h5>
                    <span className="text-dim font-normal">{state}</span>
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
