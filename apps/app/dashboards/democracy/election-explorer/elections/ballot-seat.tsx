import Card from "@components/Card";
import ElectionTable from "@components/Chart/Table/ElectionTable";
import ImageWithFallback from "@components/ImageWithFallback";
import LeftRightCard from "@components/LeftRightCard";
import Section from "@components/Section";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { numFormat, toDate } from "@lib/helpers";
import { FunctionComponent, useEffect, useMemo } from "react";
import type { BaseResult, Seat, SeatResult } from "../types";

import { Won } from "@components/Badge/election";
import BarPerc from "@components/Chart/BarMeter/BarPerc";
import ComboBox from "@components/Combobox";
import { SPRIconSolid } from "@components/Icon/agency";
import { generateSchema } from "@lib/schema/election-explorer";
import Tooltip from "@components/Tooltip";

/**
 * Election Explorer - Ballot Seat
 * @overview Status: In-development
 */

interface BallotSeatProps {
  seats: Seat[];
  election: string | undefined;
}

const BallotSeat: FunctionComponent<BallotSeatProps> = ({ seats, election }) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

  const { data, setData } = useData({
    seat: undefined,
    seat_loading: false,
    seat_result: {
      data: [],
      votes: [],
    },
  });

  const fetchSeatResult = (seat: string) => {
    if (!election) return;
    setData("seat_loading", true);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "seats",
      election: election,
      seat: seat,
    })
      .then(({ data }: { data: SeatResult }) => {
        setData("seat_result", {
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
        });
        setData("seat_loading", false);
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    fetchSeatResult(seats[0].seat);
  }, []);

  const seat_info = useMemo<{
    name: string;
    area: string;
    state: string;
    date: string;
  }>(() => {
    if (data.seat_result.data.length <= 0)
      return {
        name: "",
        area: "",
        state: "",
        date: "",
      };

    const [area, state] = data.seat_result.data[0].seat.split(",");

    return {
      name: data.seat_result.data[0].election_name,
      area,
      state,
      date: toDate(data.seat_result.data[0].date, "dd MMM yyyy", i18n.language),
    };
  }, [data.seat_result]);

  const SEAT_OPTIONS = seats.map(seat => ({ label: seat.seat, value: seat.seat }));
  const _seats = useMemo<Seat[]>(() => {
    if (!data.seat) return seats;
    return seats.filter(seat => seat.seat.includes(data.seat.value));
  }, [data.seat]);

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-10 lg:col-start-2">
          <div className="space-y-6">
            <h4 className="text-center">{t("election.section_2")}</h4>

            <LeftRightCard
              left={
                <div className="bg-background dark:bg-washed-dark relative flex h-fit w-full flex-col gap-3 overflow-hidden rounded-t-xl px-6 pb-6 md:h-[600px] md:overflow-y-auto lg:rounded-l-xl">
                  <div className="bg-background dark:bg-washed-dark dark:border-outlineHover-dark sticky top-0 z-10 border-b pb-3 pt-6">
                    <ComboBox
                      placeholder={t("seat.search_seat")}
                      options={SEAT_OPTIONS}
                      selected={data.seat}
                      onChange={selected => setData("seat", selected)}
                    />
                  </div>
                  <div className="grid w-full grid-flow-col-dense grid-rows-2 flex-row gap-3 overflow-x-scroll md:flex-col md:overflow-x-clip md:pb-0 lg:flex">
                    {_seats.map((seat: Seat, index: number) => (
                      <Card
                        key={seat.seat}
                        className="dark:border-outlineHover-dark focus:border-primary dark:focus:border-primary-dark hover:border-primary dark:hover:border-primary-dark hover:bg-primary/5 dark:hover:bg-primary-dark/5 flex h-fit flex-col gap-2 rounded-xl border bg-white p-3 text-sm dark:bg-black"
                        onClick={() => fetchSeatResult(seat.seat)}
                      >
                        <div className="flex flex-row justify-between">
                          <div className="flex gap-2 truncate">
                            <span className="text-dim text-sm font-medium">
                              {seat.seat.slice(0, 5)}
                            </span>
                            <span>{seat.seat.slice(5)}</span>
                          </div>
                          <div className="group relative w-max">
                            <span
                              className="invisible absolute inline-block w-max -translate-x-3/4 translate-y-4 transform rounded
                           bg-black p-3 text-sm font-normal text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100"
                            >
                              {t("full_result")}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <ImageWithFallback
                            className="border-outline dark:border-washed-dark items-center self-center rounded border"
                            src={`/static/images/parties/${seat.party}.png`}
                            width={32}
                            height={18}
                            alt={t(`${seat.party}`)}
                          />
                          <span className="truncate font-medium">{`${seat.name} `}</span>
                          <span>{`(${seat.party})`}</span>
                          <Won />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-dim text-sm">{t("majority")}</p>
                          <BarPerc hidden value={seat.majority.perc} />
                          <span>
                            {seat.majority.abs === 0
                              ? `—`
                              : numFormat(seat.majority.abs, "standard")}
                          </span>
                          <span>
                            {seat.majority.perc === null
                              ? `(—)`
                              : `(${numFormat(seat.majority.perc, "compact", [1, 1])}%)`}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              }
              right={
                <div className="h-full w-full space-y-8 rounded-b-xl bg-white p-6 dark:bg-black md:h-[600px] md:p-10 lg:rounded-r-xl">
                  {data.seat_result.data.length > 0 ? (
                    <>
                      <div className="flex items-center gap-4">
                        <SPRIconSolid className="text-dim h-10 w-10" />
                        <div>
                          <div className="flex items-center gap-3 ">
                            <h5>{seat_info.area}</h5>
                            <p className="text-dim uppercase">{seat_info.state}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p>{seat_info.name}</p>
                            <p className="text-dim">{seat_info.date}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5>{t("election.election_result")}</h5>
                        <ElectionTable
                          className="max-h-96 w-full overflow-y-auto"
                          data={data.seat_result.data}
                          columns={generateSchema<BaseResult>([
                            {
                              key: "name",
                              id: "candidate_name",
                              header: t("candidate_name"),
                            },
                            {
                              key: "party",
                              id: "party_name",
                              header: t("party_name"),
                            },
                            {
                              key: "votes",
                              id: "votes",
                              header: t("votes_won"),
                            },
                          ])}
                          isLoading={data.seat_loading}
                          highlightedRow={0}
                          win="win"
                        />
                      </div>

                      <div className="space-y-2">
                        <h5>{t("election.voting_statistics")}</h5>
                        <div className="flex w-full flex-row gap-8">
                          {data.seat_result.votes.map((item: { x: string; y: number }) => (
                            <BarPerc
                              size="h-2.5 w-full"
                              key={item.x}
                              label={
                                <div className="flex items-center gap-1">
                                  {t(`election.${item.x}`)}
                                  <Tooltip tip={t(`tooltip.${item.x}`)} />
                                </div>
                              }
                              value={item.y}
                              className="w-full space-y-1"
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default BallotSeat;