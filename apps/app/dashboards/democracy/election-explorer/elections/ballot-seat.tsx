import type { BaseResult, Seat, SeatResult } from "../types";
import { Won } from "@components/Badge/election";
import Card from "@components/Card";
import BarPerc from "@components/Chart/BarMeter/BarPerc";
import ElectionTable from "@components/Chart/Table/ElectionTable";
import ComboBox from "@components/Combobox";
import { SPRIconSolid } from "@components/Icon/agency";
import ImageWithFallback from "@components/ImageWithFallback";
import LeftRightCard from "@components/LeftRightCard";
import Section from "@components/Section";
import { toast } from "@components/Toast";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { numFormat, toDate } from "@lib/helpers";
import { generateSchema } from "@lib/schema/election-explorer";
import { FunctionComponent, useEffect, useMemo } from "react";

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
  const { cache } = useCache();

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
    const identifier = seat;
    if (cache.has(identifier)) return setData("seat_result", cache.get(identifier));
    else {
      setData("seat_loading", true);
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "full_result",
        type: "candidates",
        election,
        seat,
      })
        .then(({ data }: { data: SeatResult }) => {
          const result = {
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
          setData("seat_result", result);
          setData("seat_loading", false);
        })
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    }
  };

  useEffect(() => {
    if (seats.length > 0) fetchSeatResult(seats[0].seat);
  }, [seats]);

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
  }, [data.seat_result, seats]);

  const SEAT_OPTIONS = seats.map(seat => ({ label: seat.seat, value: seat.seat }));
  const _seats = useMemo<Seat[]>(() => {
    if (!data.seat) return seats;
    return seats.filter(seat => seat.seat.includes(data.seat.value));
  }, [data.seat, seats]);

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-10 lg:col-start-2">
          <div className="space-y-6">
            <h4 className="text-center">{t("election.section_2")}</h4>

            <LeftRightCard
              left={
                <div
                  className="bg-background dark:bg-washed-dark relative flex h-fit w-full flex-col gap-3 overflow-hidden 
                rounded-t-xl px-3 pb-3 md:overflow-y-auto lg:h-[600px] lg:rounded-l-xl lg:px-6 lg:pb-6"
                >
                  <div className="bg-background dark:bg-washed-dark dark:border-outlineHover-dark sticky top-0 z-10 border-b pb-3 pt-6">
                    <ComboBox
                      placeholder={t("seat.search_seat")}
                      options={SEAT_OPTIONS}
                      selected={data.seat ?? null}
                      onChange={selected => {
                        setData("seat", selected);
                        if (selected) fetchSeatResult(selected.value);
                      }}
                    />
                  </div>
                  <div className="grid w-full grid-flow-col-dense grid-rows-2 flex-row gap-3 overflow-x-scroll md:flex-col md:overflow-x-clip md:pb-0 lg:flex">
                    {election &&
                      _seats.map((seat: Seat) => (
                        <Card
                          key={seat.seat}
                          className="focus:border-primary dark:focus:border-primary-dark hover:border-primary dark:hover:border-primary-dark
                         hover:bg-primary/5 dark:hover:bg-primary-dark/5 flex h-fit w-72 flex-col gap-2 rounded-xl border bg-white p-3 text-sm
                          dark:bg-black xl:w-full"
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
                              className="border-outline dark:border-outlineHover-dark items-center self-center rounded border"
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
                <div className="h-full w-full space-y-8 overflow-y-auto rounded-b-xl bg-white p-6 dark:bg-black md:h-[600px] lg:rounded-r-xl lg:p-8">
                  {data.seat_result.data.length > 0 && election ? (
                    <>
                      <div className="flex items-center gap-4">
                        <SPRIconSolid className="text-dim h-10 w-10" />
                        <div>
                          <div className="flex items-center gap-3 ">
                            <h5>{seat_info.area}</h5>
                            <p className="text-dim uppercase">{seat_info.state}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p>{t(`${seat_info.name}`)}</p>
                            <p className="text-dim">{seat_info.date}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="font-bold">{t("election.election_result")}</div>
                        <ElectionTable
                          className="max-h-[400px] w-full overflow-y-auto"
                          data={data.seat_result.data}
                          columns={generateSchema<BaseResult>([
                            {
                              key: "name",
                              id: "name",
                              header: t("candidate_name"),
                            },
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
                          isLoading={data.seat_loading}
                          highlightedRow={0}
                          result="won"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="font-bold">{t("election.voting_statistics")}</div>
                        <div className="flex flex-col gap-3 text-sm md:flex-row md:gap-x-6 lg:flex-col xl:flex-row">
                          {data.seat_result.votes.map(
                            (item: { x: string; abs: number; perc: number }) => (
                              <div className="flex space-x-3 whitespace-nowrap" key={item.x}>
                                <p className="w-28 md:w-fit lg:w-28 xl:w-fit">
                                  {t(`election.${item.x}`)}:
                                </p>
                                <div className="flex items-center space-x-3">
                                  <BarPerc hidden value={item.perc} size={"h-[5px] w-[50px]"} />
                                  <p>{`${
                                    item.abs !== null ? numFormat(item.abs, "standard") : "—"
                                  } ${
                                    item.perc !== null
                                      ? `(${numFormat(item.perc, "compact", [1, 1])}%)`
                                      : "(—)"
                                  }`}</p>
                                </div>
                              </div>
                            )
                          )}
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
