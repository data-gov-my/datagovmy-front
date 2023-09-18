import { CakeIcon, MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/solid";
import { get } from "datagovmy-ui/api";
import {
  AgencyBadge,
  Button,
  Card,
  Container,
  Dropdown,
  Hero,
  Section,
  Daterange,
  Spinner,
  toast,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { clx, toDate } from "datagovmy-ui/helpers";
import { OptionType } from "datagovmy-ui/types";
import { DateTime } from "luxon";
import dynamic from "next/dynamic";
import { FunctionComponent, useContext, useMemo, useRef } from "react";

/**
 * Birthday Explorer Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface BirthdayExplorerDashboardProps {
  last_updated: string;
  timeseries: { x: number[]; y: number[]; data_as_of: string };
}

const BirthdayExplorerDashboard: FunctionComponent<BirthdayExplorerDashboardProps> = ({
  last_updated,
  timeseries,
}) => {
  const { t, i18n } = useTranslation(["dashboard-birthday-explorer", "common", "catalogue"]);
  const ref = useRef<HTMLParagraphElement>(null);
  const { size } = useContext(WindowContext);

  const filterPeriods: Array<OptionType> = [
    { label: t("by_date"), value: "day" },
    { label: t("by_month"), value: "month" },
  ];

  const leapTicks: readonly number[] = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 365];
  const nonLeapTicks: readonly number[] = [
    0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 364,
  ];
  const startYear: number = 1920;
  const LATEST_YEAR = toDate(timeseries.data_as_of, "yyyy", i18n.language);
  const endYear: number = Number(LATEST_YEAR);

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
    start: startYear.toString(),
    end: LATEST_YEAR,
    state: "mys",

    loading: false,
    timeseries_loading: false,

    // placeholder
    p_birthday: "1996-01-01",
    p_state: "mys",
    validation: "",
  });

  const fetchData = (birthday: string, groupBy: string, start: string, end: string) => {
    setData("timeseries_loading", true);
    get("/explorer", {
      explorer: "BIRTHDAY_POPULARITY",
      state: data.state,
      birthday: birthday,
      groupByDay: groupBy === "day",
      start: start,
      end: end,
    })
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

  const handleSearch = () => {
    validateDate()
      .then(({ birthday, year }) => {
        setData("loading", true);
        fetchData(birthday, data.groupBy, year, year);
        if (size.width <= BREAKPOINTS.SM)
          ref && ref.current && ref.current.scrollIntoView({ behavior: "smooth" });
      })
      .catch(e => console.error(e));
  };

  const { years, months, days } = useMemo<{ years?: number; months?: number; days?: number }>(
    () =>
      DateTime.now().diff(DateTime.fromISO(data.birthday), ["years", "months", "days"]).toObject(),
    [data.birthday]
  );

  const isLeap = (year: number) => {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  };

  const validateDate = async (): Promise<{ birthday: string; year: string }> =>
    new Promise((resolve, reject) => {
      const yearStr = data.p_birthday.substring(0, 4);
      const yearNum = Number(yearStr);
      if (!data.p_birthday && data.p_birthday.length < 10) {
        setData("validation", t("incomplete"));
        reject("Invalid date");
      } else if (yearNum > endYear) {
        setData("validation", t("invalid_max", { year: LATEST_YEAR }));
        reject("Date more than maximum");
      } else if (yearNum < startYear) {
        setData("validation", t("invalid_min"));
        reject("Date less than maximum");
      } else {
        setData("validation", false);
        setData("birthday", data.p_birthday);
        setData("state", data.p_state);
        setData("start", yearStr);
        setData("end", yearStr);
        resolve({ birthday: data.p_birthday, year: yearStr });
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
        agencyBadge={<AgencyBadge agency="jpn" />}
      />
      <Container className="min-h-screen">
        <Section className="mx-auto py-8 lg:py-12 xl:w-4/5">
          <h4 className="pb-3 text-center">{t("section_1.title")}</h4>
          <p className="text-dim pb-6 text-center">
            {t("section_1.description", { year: endYear, next_year: endYear + 1 })}
          </p>
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
                    if (e.key === "Enter") handleSearch();
                  }}
                  min={"1920-01-01"}
                  max={timeseries.data_as_of.split(" ")[0]}
                ></input>
                {data.validation && <p className="text-danger mt-1 text-xs">{data.validation}</p>}

                <Button
                  className="btn-primary my-6 active:shadow-none"
                  onClick={handleSearch}
                  icon={<SearchIcon className="h-4 w-4" />}
                >
                  {t("search")}
                </Button>
              </div>
              <p ref={ref} className="text-dim text-sm">
                {t("disclaimer")}
              </p>
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
                    <div className="flex h-auto flex-col gap-6 self-center text-lg font-bold max-lg:px-4 max-lg:pb-6 lg:col-span-2">
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
                      <p className="font-dim text-sm font-normal">{t("explore")}</p>
                    </div>
                  </Card>
                ) : (
                  <Card className="flex min-h-[300px] w-full items-center justify-center">
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
                onChange={({ value }) => {
                  setData("groupBy", value);
                  fetchData(data.p_birthday, value, data.start, data.end);
                }}
              />
              <Daterange
                startYear={startYear}
                endYear={endYear}
                selectedStart={data.start}
                selectedEnd={data.end}
                anchor="right"
                onChange={([begin, end]) => {
                  if (begin) {
                    setData("start", begin);
                  }
                  if (end) {
                    setData("end", end);
                  }
                  fetchData(data.p_birthday, data.groupBy, begin ?? data.start, end ?? data.end);
                }}
                onReset={() => {
                  setData("start", startYear);
                  setData("end", endYear);
                  fetchData(data.p_birthday, data.groupBy, startYear.toString(), LATEST_YEAR);
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
