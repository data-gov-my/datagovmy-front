import AgencyBadge from "@components/Badge/agency";
import Card from "@components/Card";
import Daterange from "@components/Dropdown/Daterange";
import Spinner from "@components/Spinner";
import { toast } from "@components/Toast";

import { Button, Container, Dropdown, Hero, Section, StateDropdown } from "@components/index";
import { OptionType } from "@components/types";
import { CakeIcon, MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { WindowContext } from "@hooks/useWindow";
import { get } from "@lib/api";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { clx, toDate } from "@lib/helpers";
import { DateTime } from "luxon";
import dynamic from "next/dynamic";
import { FunctionComponent, useContext, useEffect, useMemo } from "react";

/**
 * Birthday Explorer Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface BirthdayExplorerDashboardProps {
  last_updated: string;
  timeseries: { x: number[]; y: number[]; data_as_of: string };
}

const BirthdayExplorerDashboard: FunctionComponent<BirthdayExplorerDashboardProps> = ({
  last_updated,
  timeseries,
}) => {
  const { t, i18n } = useTranslation(["dashboard-birthday-explorer", "common", "catalogue"]);
  const { size } = useContext(WindowContext);

  const filterPeriods: Array<OptionType> = [
    { label: t("by_date"), value: "day" },
    { label: t("by_month"), value: "month" },
  ];

  const leapTicks: readonly number[] = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 365];
  const nonLeapTicks: readonly number[] = [
    0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 364,
  ];
  const startYear: number = 1923;
  const endYear: number = 2017;

  const filterYears = (start: number, end: number): Array<OptionType> => {
    return Array(end - start + 1)
      .fill(end)
      .map((year, index) => ({ label: `${year - index}`, value: `${year - index}` }));
  };

  const { data, setData } = useData({
    x: timeseries.x,
    y: timeseries.y,
    rank: 0,
    state_total: 0,
    nationwide_total: 0,
    popularity: {
      year_popular: 0,
      year_rare: 0,
    },

    // query data
    groupBy: "day", // options: "day" | "month"
    birthday: "",
    start: "1923",
    end: "2017",
    state: "mys",

    loading: false,
    timeseries_loading: false,

    // placeholder
    p_birthday: "1996-01-01",
    p_state: "mys",
    validation: "",
  });

  const yieldParams = (birthday: string, state: string = data.state) => {
    let items: Array<[string, any]> = [
      ["explorer", "BIRTHDAY_POPULARITY"],
      ["state", state],
    ];
    if (birthday) items.push(["birthday", birthday]);
    for (const key of ["start", "end", "groupByDay"]) {
      if (key === "groupByDay" && data.groupBy) items.push([key, data.groupBy === "day"]);
      if (data[key]) items.push([key, data[key]]);
    }
    return Object.fromEntries(items);
  };

  const fetchData = (query: ReturnType<typeof yieldParams>) => {
    setData("timeseries_loading", true);
    get("/explorer", query)
      .then(({ data }) => {
        for (const key of ["x", "y"]) {
          setData(key, data.timeseries[key]);
        }
        if (data.rank_table) {
          for (const key of ["rank", "nationwide_total", "state_total", "popularity"]) {
            setData(key, data.rank_table[key]);
          }
        }
        setData("loading", false);
        setData("timeseries_loading", false);
      })
      .catch(e => {
        toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
        console.error(e);
      });
  };

  useEffect(() => {
    fetchData(yieldParams(data.birthday, data.state));
  }, [data.groupBy, data.start, data.end]);

  const { years, months, days } = useMemo<{ years?: number; months?: number; days?: number }>(
    () =>
      DateTime.now().diff(DateTime.fromISO(data.birthday), ["years", "months", "days"]).toObject(),
    [data.birthday]
  );

  const isLeap = (year: number) => {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  };

  const validateDate = async (): Promise<{ birthday: string; state: string }> =>
    new Promise((resolve, reject) => {
      const year = Number(data.p_birthday.substring(0, 4));
      if (!data.p_birthday && data.p_birthday.length < 10) {
        setData("validation", t("incomplete"));
        reject("Invalid date");
      } else if (year > 2017) {
        setData("validation", t("invalid_max"));
        reject("Date more than maximum");
      } else if (year < 1923) {
        setData("validation", t("invalid_min"));
        reject("Date less than maximum");
      } else {
        setData("validation", false);
        setData("birthday", data.p_birthday);
        setData("state", data.p_state);
        setData("start", data.p_birthday.substring(0, 4));
        setData("end", data.p_birthday.substring(0, 4));
        resolve({ birthday: data.p_birthday, state: data.p_state });
      }
    });

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.demography"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description", { quote: t("quote") })]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="JPN" />}
      />
      <Container className="min-h-screen">
        <Section title={t("section_1.title")} description={t("section_1.description")}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card className="bg-background dark:bg-background-dark shadow-button flex flex-col justify-between p-6 lg:col-span-1">
              <div>
                <p className="mb-3 text-sm font-medium">{t("enter_birthday")}</p>
                <input
                  type="date"
                  className={clx(
                    "border-outline dark:border-washed-dark active:bg-washed relative w-full cursor-pointer gap-1.5 rounded-md bg-white py-1.5 pl-3 text-left text-sm outline-none focus:ring-1 dark:bg-black dark:text-white",
                    data.validation && "ring-danger dark:ring-danger ring-1"
                  )}
                  value={data.p_birthday}
                  onChange={selected => setData("p_birthday", selected.target.value)}
                  required
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      validateDate()
                        .then(({ birthday, state }) => {
                          setData("loading", true);
                          fetchData(yieldParams(birthday, state));
                        })
                        .catch(e => console.error(e));
                    }
                  }}
                  min={"1923-01-01"}
                  max={"2017-12-31"}
                ></input>
                {data.validation && <p className="text-danger mt-1 text-xs">{data.validation}</p>}
                <p className="mb-3 mt-6 text-sm font-medium">{t("choose_state")}</p>
                <StateDropdown
                  currentState={data.p_state}
                  onChange={selected => setData("p_state", selected.value)}
                  include={[{ label: t("common:components.ovs"), value: "Overseas" }]}
                  exclude={["kvy"]}
                  width="w-full"
                />
                <Button
                  className="btn-primary my-6"
                  onClick={() => {
                    validateDate()
                      .then(({ birthday, state }) => {
                        setData("loading", true);
                        fetchData(yieldParams(birthday, state));
                      })
                      .catch(e => console.error(e));
                  }}
                  icon={<SearchIcon className="h-4 w-4" />}
                >
                  {t("search")}
                </Button>
              </div>
              <p className="text-dim text-sm">{t("disclaimer")}</p>
            </Card>
            <div className="lg:col-span-2">
              {data.birthday ? (
                !data.loading ? (
                  <Card
                    key={data.birthday}
                    className="grid h-full grid-cols-1 items-center gap-6 lg:grid-cols-3 lg:p-6"
                  >
                    <div className="shadow-button lg:border-outline bg-background lg:dark:border-washed-dark dark:bg-background-dark flex h-full w-full flex-col justify-center rounded-t-xl px-4 py-6 text-center lg:rounded-xl lg:border">
                      <CakeIcon className="text-primary dark:text-primary-dark mx-auto h-10 w-10" />
                      <p className="mt-4 text-lg font-bold">
                        {toDate(data.birthday, "dd MMMM yyyy", i18n.language)}
                      </p>
                      <p className="text-dim mt-3 text-sm">
                        {t("year", { count: years }) +
                          t("month", { count: months }) +
                          t("day", { count: Math.floor(days!) })}
                      </p>
                    </div>
                    <div className="flex h-auto flex-col gap-3 self-center text-lg font-bold max-lg:px-4 max-lg:pb-6 lg:col-span-2">
                      <p>
                        {t("today", { count: data.state_total })}
                        <span className="text-primary dark:text-primary-dark">
                          {t("count", { count: data.state_total })}
                        </span>
                        {t("born", {
                          count: data.state_total,
                          context: data.state === "Overseas" && "overseas",
                        })}
                        <span className="text-primary dark:text-primary-dark">
                          {data.state === "Overseas" ? t("overseas") : CountryAndStates[data.state]}
                        </span>
                        {data.state !== "mys" ? (
                          <span>
                            {t("and")}
                            <span className="text-primary dark:text-primary-dark">
                              {t("count", { count: data.nationwide_total })}
                            </span>
                            {t("nationwide", { count: data.nationwide_total })}
                          </span>
                        ) : (
                          "."
                        )}
                      </p>
                      <p>
                        {t("this_year", {
                          year: data.birthday.slice(0, 4),
                        })}
                        <span className="text-primary dark:text-primary-dark">
                          {t("rank", {
                            count: data.rank,
                            ordinal: true, // ordinal: st, nd, th
                            context:
                              data.rank === 1
                                ? "most_popular"
                                : data.rank === data.y.length && "most_rare",
                          })}
                        </span>
                        {t("popularity", {
                          count: isLeap(+data.birthday.slice(0, 4)) ? 366 : 365,
                          year: +data.birthday.slice(0, 4),
                          context: (data.rank === 1 || data.rank === data.y.length) && "without",
                        })}
                        {data.rank !== 1 &&
                          t("popular", {
                            context: data.rank === data.y.length && "while",
                          }) +
                            t("date", {
                              count: new Date(data.popularity.year_popular).getDate(),
                              ordinal: true,
                              month: new Intl.DateTimeFormat(i18n.language, {
                                month: "long",
                              }).format(new Date(data.popularity.year_popular)),
                            })}
                        {data.rank !== data.y.length &&
                          t("rare") +
                            t("date", {
                              count: new Date(data.popularity.year_rare).getDate(),
                              ordinal: true,
                              month: new Intl.DateTimeFormat(i18n.language, {
                                month: "long",
                              }).format(new Date(data.popularity.year_rare)),
                            })}
                        .
                      </p>
                      <p className="text-base font-normal">{t("explore")}</p>
                    </div>
                  </Card>
                ) : (
                  <Card className="flex h-full w-full items-center justify-center">
                    <Spinner loading={data.loading} />
                  </Card>
                )
              ) : (
                <Card className="hidden h-full items-center lg:flex">
                  <div className="bg-outline dark:bg-washed-dark mx-auto flex gap-2 rounded-md px-3 py-1.5">
                    <SearchIcon className="mt-1 h-4 w-4" />
                    <p>{t("start_search")}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Section>

        {/* Number of babies born on each date */}
        <Section
          title={t("section_2.title", {
            start_year: data.start,
            end_year: data.end,
            state:
              data.state === "Overseas"
                ? t("section_2.overseas")
                : CountryAndStates[data.state ? data.state : "mys"],
            context: data.start === data.end && "same_year",
          })}
          date={timeseries.data_as_of}
          description={
            <div className="flex justify-start gap-2">
              <Dropdown
                className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
                anchor={"left"}
                width={"w-fit"}
                options={filterPeriods}
                placeholder={t("period")}
                selected={filterPeriods.find(period => period.value === data.groupBy)}
                onChange={({ value }) => setData("groupBy", value)}
              />
              <Daterange
                className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
                beginOptions={filterYears(startYear, endYear).slice().reverse()}
                endOptions={filterYears(startYear, endYear)}
                anchor={"left"}
                selected={[
                  filterYears(startYear, endYear).find(item => item.value === data.start),
                  filterYears(startYear, endYear).find(item => item.value === data.end),
                ]}
                onChange={([begin, end]) => {
                  if (begin) setData("start", begin.value);
                  if (end) setData("end", end.value);
                }}
                onReset={() => {
                  setData("start", "1923");
                  setData("end", "2017");
                }}
              />
            </div>
          }
        >
          {!data.timeseries_loading ? (
            <Timeseries
              className="h-[350px] w-full"
              interval={data.groupBy}
              round={data.groupBy}
              enableGridX={false}
              enableGridY={true}
              enableMajorTick={false}
              gridOffsetX={data.groupBy === "day" ? false : true}
              tickXCallback={(val: number | string, index: number) => {
                if (data.groupBy !== "day") return val;
                const x = data.y.length > 365 ? leapTicks : nonLeapTicks;
                return x.includes(index) ? val : null;
              }}
              tooltipFormat={data.groupBy === "day" ? "dd MMMM" : "MMMM"}
              data={{
                labels: data.x,
                datasets: [
                  {
                    type: data.groupBy === "day" ? "line" : "bar",
                    data: data.y,
                    label: t("births"),
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: size.width <= BREAKPOINTS.LG ? 1.0 : 1.5,
                    fill: true,
                  },
                ],
              }}
            />
          ) : (
            <div className="flex h-[350px] w-full items-center justify-center">
              <Spinner loading={data.timeseries_loading} />
            </div>
          )}
        </Section>
      </Container>
    </>
  );
};

export default BirthdayExplorerDashboard;
