import type { BaseResult, OverallSeat, SeatResult } from "../types";
import { Won } from "@components/Badge/election";
import BarPerc from "@components/Chart/BarMeter/BarPerc";
import ElectionTable from "@components/Chart/Table/ElectionTable";
import ComboBox from "@components/Combobox";
import ImageWithFallback from "@components/ImageWithFallback";
import LeftRightCard from "@components/LeftRightCard";
import Section from "@components/Section";
import { toast } from "@components/Toast";
import Font from "@config/font";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { clx, numFormat, toDate } from "@lib/helpers";
import { generateSchema } from "@lib/schema/election-explorer";
import {
  CSSProperties,
  Fragment,
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List, FixedSizeGrid as Grid } from "react-window";

/**
 * Election Explorer - Ballot Seat
 * @overview Status: In-development
 */

interface BallotSeatProps {
  seats: OverallSeat[];
  state: string;
  election: string | undefined;
}

const BallotSeat: FunctionComponent<BallotSeatProps> = ({ seats, state, election }) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);
  const { cache } = useCache();
  const listRef = useRef<List>(null);
  const gridRef = useRef<Grid>(null);

  const [show, setShow] = useState<boolean>(false);
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
    const identifier = `${election}-${state}-${seat}`;
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
        .then(({ data }: { data: { data: SeatResult } }) => {
          const data2 = data.data;
          const result = {
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

  const OverallResultCard = ({ seat }: { seat: OverallSeat }) => {
    return (
      <div
        className={clx(
          `border-outline dark:border-washed-dark lg:hover:border-outlineHover lg:dark:hover:border-outlineHover-dark lg:active:bg-washed flex h-full w-full flex-col gap-2
        rounded-xl border bg-white p-3 text-sm focus:outline-none dark:bg-black lg:hover:dark:bg-black/50 lg:active:dark:bg-black`,
          data.seat &&
            seat.seat === data.seat &&
            "lg:ring-primary lg:dark:ring-primary-dark lg:ring-1 lg:hover:border-transparent"
        )}
        onClick={() => {
          setData("seat", seat.seat);
          fetchSeatResult(seat.seat);
        }}
      >
        <div className="flex justify-between">
          <div className="flex w-[224px] gap-2">
            <span className="text-dim text-sm font-medium">{seat.seat.slice(0, 5)}</span>
            <span className="truncate">{seat.seat.slice(5)}</span>
          </div>

          <button
            className="text-dim flex flex-row items-center text-sm font-medium hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:hover:text-white lg:hidden"
            onClick={() => {
              setShow(true);
            }}
          >
            <ArrowsPointingOutIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex h-8 items-center gap-1.5">
          <ImageWithFallback
            className="border-outline dark:border-outlineHover-dark rounded border"
            src={`/static/images/parties/${seat.party}.png`}
            width={32}
            height={18}
            alt={t(`${seat.party}`)}
            style={{ width: "auto", maxWidth: "32px", height: "auto", maxHeight: "32px" }}
          />
          <span className="truncate font-medium">{`${seat.name} `}</span>
          <span>{`(${seat.party})`}</span>
          <Won />
        </div>
        <div className="flex items-center gap-1.5">
          <p className="text-dim text-sm">{t("majority")}</p>
          <BarPerc hidden value={seat.majority.perc} size="h-[5px] w-[30px] xl:w-[50px]" />
          <span>
            {seat.majority.abs === null ? `—` : numFormat(seat.majority.abs, "standard")}
            {seat.majority.perc === null
              ? ` (—)`
              : ` (${numFormat(seat.majority.perc, "compact", [1, 1])}%)`}
          </span>
        </div>
      </div>
    );
  };

  const BallotCard = () => {
    return (
      <div className="space-y-8 overflow-y-auto">
        <div className="flex items-start gap-4 lg:items-center">
          <div className="space-y-3">
            <div className="mr-6 flex flex-wrap gap-x-3 uppercase">
              <h5>{seat_info.area}</h5>
              <p className="text-dim text-lg">{seat_info.state}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-3">
              <p>{t(`${seat_info.name.slice(-5)}`)}</p>
              <p className="text-dim">{seat_info.date}</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="font-bold">{t("election_result")}</div>
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
            highlightedRows={[0]}
            result="won"
          />
        </div>

        <div className="space-y-3">
          <div className="font-bold">{t("voting_statistics")}</div>
          <div className="flex flex-col gap-3 text-sm">
            {data.seat_result.votes.map((item: { x: string; abs: number; perc: number }) => (
              <div className="flex space-x-3 whitespace-nowrap" key={item.x}>
                <p className="w-28">{t(item.x)}:</p>
                <div className="flex items-center space-x-3">
                  <BarPerc hidden value={item.perc} size={"h-[5px] w-[50px]"} />
                  <p>{`${item.abs !== null ? numFormat(item.abs, "standard") : "—"} ${
                    item.perc !== null ? `(${numFormat(item.perc, "compact", [1, 1])}%)` : "(—)"
                  }`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Section>
      <div className="grid grid-cols-12">
        <div className="col-span-full col-start-1 space-y-12 xl:col-span-10 xl:col-start-2">
          <div className="space-y-6">
            <h4 className="text-center">{t("header_2")}</h4>

            <LeftRightCard
              left={
                <div
                  className="bg-background dark:bg-washed-dark relative flex h-fit w-full flex-col overflow-hidden 
                rounded-t-xl px-3 pb-3 md:overflow-y-auto lg:h-[600px] lg:rounded-bl-xl lg:rounded-tr-none lg:pb-6 xl:px-6"
                >
                  <div className="bg-background dark:bg-washed-dark dark:border-outlineHover-dark sticky top-0 z-10 border-b pb-3 pt-6">
                    <ComboBox
                      placeholder={t("seat.search_seat")}
                      options={SEAT_OPTIONS}
                      selected={data.seat ? SEAT_OPTIONS.find(e => e.value === data.seat) : null}
                      onChange={selected => {
                        if (selected) {
                          fetchSeatResult(selected.value);
                          setData("seat", selected.value);
                        } else {
                          setData("seat", null);
                        }

                        const index = SEAT_OPTIONS.findIndex(e => e === selected);
                        if (listRef && listRef.current)
                          listRef.current.scrollToItem(index, "smart");
                        if (gridRef && gridRef.current)
                          gridRef.current.scrollToItem({
                            align: "start",
                            columnIndex: Math.floor(index / 2),
                          });
                      }}
                    />
                  </div>
                  {election && (
                    <>
                      <List
                        ref={listRef}
                        height={489}
                        width={"100%"}
                        itemCount={seats.length}
                        itemSize={126}
                        layout="vertical"
                        className="hidden lg:flex"
                      >
                        {({ index, style }: { index: number; style: CSSProperties }) => {
                          return (
                            <div style={style} key={index} className="px-1.5 pt-3">
                              <OverallResultCard seat={seats[index]} />
                            </div>
                          );
                        }}
                      </List>
                      <div className="flex h-[394px] lg:hidden">
                        <AutoSizer>
                          {({ height, width }: { height: number; width: number }) => (
                            <Grid
                              ref={gridRef}
                              rowCount={3}
                              columnCount={Math.ceil(seats.length / 3)}
                              height={height}
                              rowHeight={126}
                              width={width}
                              columnWidth={288}
                            >
                              {({
                                rowIndex,
                                columnIndex,
                                style,
                              }: {
                                rowIndex: number;
                                columnIndex: number;
                                style: CSSProperties;
                              }) => {
                                const seat = seats[columnIndex * 3 + rowIndex];
                                return (
                                  <div style={style} key={seat.seat} className="px-1.5 pt-3">
                                    <OverallResultCard seat={seat} />
                                  </div>
                                );
                              }}
                            </Grid>
                          )}
                        </AutoSizer>
                      </div>
                    </>
                  )}
                </div>
              }
              right={
                <div className="hidden h-[600px] w-full space-y-8 overflow-y-auto rounded-r-xl bg-white p-8 dark:bg-black lg:block">
                  {data.seat_result.data.length > 0 && election ? <BallotCard /> : <></>}
                </div>
              }
            />
          </div>
        </div>
      </div>

      <Transition show={show} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={() => setShow(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={clx(
                    Font.body.variable,
                    "border-outline dark:border-outlineHover-dark w-full max-w-4xl transform rounded-xl border bg-white p-6 text-left align-middle font-sans shadow-xl transition-all dark:bg-black"
                  )}
                >
                  <BallotCard />

                  <button
                    className="hover:bg-washed dark:hover:bg-washed-dark group absolute right-3 top-5 h-8 w-8 rounded-full md:right-5 md:top-6"
                    onClick={() => setShow(false)}
                  >
                    <XMarkIcon className="text-dim mx-auto h-6 w-6" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Section>
  );
};

export default BallotSeat;
