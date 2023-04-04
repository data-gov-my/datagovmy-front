import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import {
  Container,
  Hero,
  Section,
  StateDropdown,
  Button,
  Modal,
  Dropdown,
  Radio,
} from "@components/index";
import dynamic from "next/dynamic";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useWindowWidth } from "@hooks/useWindowWidth";
import AgencyBadge from "@components/AgencyBadge";
import { CakeIcon, MagnifyingGlassIcon as SearchIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { JPNIcon } from "@components/Icon/agency";
import Card from "@components/Card";
import { DateTime, DateTimeFormatOptions } from "luxon";
import { numFormat } from "@lib/helpers";
import { get } from "@lib/api";
import Label from "@components/Label";
import { OptionType } from "@components/types";
import Daterange from "@components/Dropdown/Daterange";
import { Trans } from "next-i18next";
import { useWatch } from "@hooks/useWatch";
import Spinner from "@components/Spinner";

/**
 * Birthday Explorer Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface BirthdayExplorerDashboardProps {
  timeseries: any;
}

const BirthdayExplorerDashboard: FunctionComponent<BirthdayExplorerDashboardProps> = ({
  timeseries,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-birthday-explorer"]);
  const chartRef = useRef(null);
  const windowWidth = useWindowWidth();

  const filterPeriods: Array<OptionType> = [
    { label: t("dashboard-birthday-explorer:section_2.by_date"), value: "DATE" },
    { label: t("dashboard-birthday-explorer:section_2.by_month"), value: "MONTH" },
  ];

  const { data, setData } = useData({
    timeseries: timeseries,
    x: [],
    y_day: [],
    y_month: [],
    rank: 0,
    year_popular: 0,
    year_rare: 0,
    groupByDay: true,
    period: filterPeriods[0],
    begin: "1923",
    end: "2017",
    state: "mys",
    datestring: "",
    validation: false,
    queryState: "mys",
    queryBday: "",
    loading: false,
    timeseriesLoading: false,
  });

  const getDayOfYear = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
  };

  useWatch(() => {
    setData("loading", true);
    get("/dashboard", {
      dashboard: "birthday_popularity",
      state: data.queryState,
      start: Number(data.begin),
      end: Number(data.end),
      groupByDay: true,
      birthday: data.queryBday,
    })
      .then(({ data }) => {
        setData("groupByDay", true);
        setData("period", filterPeriods[0]);
        setData("x", data.x);
        setData("y_day", data.y);
        setData("rank", data.rank);
        setData("year_popular", data.popularity.year_popular);
        setData("year_rare", data.popularity.year_rare);
      })
      .then(() => setData("loading", false));
  }, [data.queryState, data.queryBday]);

  useEffect(() => {
    setData("timeseriesLoading", true);
    get("/dashboard", {
      dashboard: "birthday_popularity",
      state: data.queryState,
      start: Number(data.begin),
      end: Number(data.end),
      groupByDay: data.groupByDay,
    })
      .then(({ data }) => {
        setData("x", data.x);
        data.y.length === 12 ? setData("y_month", data.y) : setData("y_day", data.y);
      })
      .then(() => setData("timeseriesLoading", false));
  }, [data.begin, data.end, data.groupByDay]);
  const today = useMemo(() => {
    return DateTime.now();
  }, []);

  const getAge = (dateString: string, today: DateTime) => {
    const start = DateTime.fromISO(dateString);
    return today.diff(start, ["years", "months", "days", "hours"]).toObject();
  };
  const { years, months, days } = getAge(data.queryBday, today);
  const options: DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

  const getBirthsNationwideOnBirthYear =
    timeseries.data.births[timeseries.data.x.indexOf(new Date(data.queryBday).getTime())];
  const birthDate = new Date(data.queryBday);
  const birthYear = birthDate.getFullYear();
  const birthsOnBirthDay = data.y_day[getDayOfYear(new Date(data.queryBday)) - 1];

  const description = (
    <Trans>
      {t("dashboard-birthday-explorer:description", {
        quote: t("dashboard-birthday-explorer:quote"),
      })}
    </Trans>
  );

  const section1 = (
    <>
      {t("dashboard-birthday-explorer:section_1.info3")}
      <span className="mx-auto text-lg font-bold text-primary">
        {t("dashboard-birthday-explorer:section_1.nation_births", {
          count: getBirthsNationwideOnBirthYear,
        })}
      </span>
      {t("dashboard-birthday-explorer:section_1.info4", {
        count: getBirthsNationwideOnBirthYear,
      })}
    </>
  );

  function handleClick(): void {
    const year = Number(data.datestring.substring(0, 4));
    if (!data.datestring && data.datestring.length < 10) {
      setData("validation", t("dashboard-birthday-explorer:section_1.validation_incomplete"));
    } else if (year > 2017) {
      setData("validation", t("dashboard-birthday-explorer:section_1.validation_max"));
    } else if (year < 1923) {
      setData("validation", t("dashboard-birthday-explorer:section_1.validation_min"));
    } else {
      setData("validation", false);
      setData("queryBday", data.datestring);
      setData("queryState", data.state);
      setData("begin", year.toString());
      setData("end", year.toString());
    }
  }

  const tooltipCallback: any = () => {
    return {
      label: function (item: any) {
        item.parsed.y === 1 ? (item.dataset.label = "Birth") : (item.dataset.label = "Births");
        return `${item.dataset.label}: ${
          item.parsed.y !== undefined || item.parsed.y !== null
            ? numFormat(item.parsed.y, "standard", 1)
            : "-"
        }`;
      },
    };
  };

  const tickOptionsXDay: any = () => {
    return {
      callback(val: string, index: number, values: any): string | null {
        const leapTicks: number[] = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 365];
        const nonLeapTicks: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 364];
        const x = data.y_day.length === 366 ? leapTicks : nonLeapTicks;
        return x.includes(index) ? val : null;
      },
      minRotation: 0,
      maxRotation: 0,
      font: {
        family: "Inter",
      },
    };
  };

  const tickOptionsXMonth: any = () => {
    return {
      major: {
        enabled: false,
      },
      minRotation: 0,
      maxRotation: 0,
      font: {
        family: "Inter",
      },
    };
  };

  const startYear: number = 1923;
  const endYear: number = 2017;

  const filterYears = (start: number, end: number): Array<OptionType> => {
    return Array(end - start + 1)
      .fill(end)
      .map((year, index) => ({ label: `${year - index}`, value: `${year - index}` }));
  };

  const reset = () => {
    setData("period", filterPeriods[0]);
    setData("begin", "1923");
    setData("end", "2017");
  };
  return (
    <>
      <Hero
        className="px-3 xl:px-20"
        background="blue"
        category={[t("nav.megamenu.categories.demography"), "text-primary"]}
        header={[t("dashboard-birthday-explorer:header")]}
        description={[description, "dark:text-outline"]}
        agencyBadge={
          <AgencyBadge
            agency="Jabatan Pendaftaran Negara"
            link="https://www.jpn.gov.my/en/"
            icon={<JPNIcon />}
          />
        }
      />
      <Container className="min-h-screen px-3 xl:px-20">
        <Section title={t("dashboard-birthday-explorer:section_1.title")}>
          <div className="flex flex-col gap-8 rounded-xl lg:flex-row">
            <Card
              className="flex basis-1/3 flex-col justify-between rounded-xl border border-outline p-6 dark:border-washed-dark"
              type="gray"
            >
              <div>
                <p className="mb-3 text-sm font-medium text-black dark:text-white">
                  {t("dashboard-birthday-explorer:enter_birthday")}
                </p>
                <input
                  type="date"
                  name="date"
                  id="date"
                  data-placeholder="Date of birth"
                  value={data.datestring}
                  min={new Date(1923, 0, 1).toISOString().split("T")[0]}
                  max={new Date(2017, 11, 31).toISOString().split("T")[0]}
                  required
                  onChange={selected => {
                    setData("datestring", selected.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleClick();
                  }}
                  className={`relative flex w-full gap-[6px] rounded-md border-2 bg-white py-[6px] pl-3 text-left text-sm active:bg-washed
                   dark:bg-black dark:text-white dark:active:bg-washed/10
                   `.concat(
                    data.validation
                      ? " border-danger dark:border-danger"
                      : " border-outline hover:border-outlineHover dark:border-washed-dark dark:border-outline/10"
                  )}
                ></input>
                {data.validation ? (
                  <p className="mt-1 text-xs text-danger">{data.validation}</p>
                ) : (
                  <></>
                )}
                <p className="mt-6 mb-3 text-sm font-medium text-black dark:text-white">
                  {t("dashboard-birthday-explorer:choose_state")}
                </p>
                <StateDropdown
                  currentState={data.state}
                  onChange={selected => {
                    setData("state", selected.value);
                  }}
                  include={{ label: "Malaysian born Overseas", value: "Overseas" }}
                  exclude={["kvy"]}
                  width="w-full"
                />
                <Button
                  className="my-6 bg-gradient-to-b from-primary-dark to-primary text-white"
                  onClick={handleClick}
                  icon={<SearchIcon className="h-4 w-4 text-white" />}
                >
                  {t("dashboard-birthday-explorer:search")}
                </Button>
              </div>
              <p className="text-sm text-dim dark:text-white">
                {t("dashboard-birthday-explorer:disclaimer")}
              </p>
            </Card>
            <div className="basis-2/3">
              {data.queryBday ? (
                !data.loading ? (
                  <Card className="flex h-full flex-col gap-6 rounded-xl border border-outline dark:border-washed-dark lg:flex-row lg:pl-8">
                    <Card className="my-0 flex h-fit w-full basis-1/3 flex-col self-center rounded-t-xl border border-outline bg-background px-4 py-8 dark:border-washed-dark dark:bg-washed-dark lg:my-8 lg:rounded-xl lg:py-16">
                      <CakeIcon className="mx-auto h-10 w-10 text-primary" />
                      <div className="mx-auto mt-4 text-center text-lg font-bold text-black dark:text-white">
                        {new Date(data.queryBday).toLocaleDateString(i18n.language, options)}
                      </div>
                      <div className="mx-auto mt-3 text-center text-sm text-dim">
                        {t("dashboard-birthday-explorer:section_1.age", {
                          years: years,
                          months: months,
                          days: days,
                        })}
                      </div>
                    </Card>
                    <div className="flex basis-2/3 flex-col gap-3 self-center px-4 pb-4 text-lg font-bold lg:pt-4 lg:pl-0 lg:pr-8">
                      <div className=" text-black dark:text-white">
                        {t("dashboard-birthday-explorer:section_1.info1", {
                          count: birthsOnBirthDay,
                        })}
                        <span className="text-primary">
                          {t("dashboard-birthday-explorer:section_1.state_births", {
                            count: birthsOnBirthDay,
                          })}
                        </span>
                        {t("dashboard-birthday-explorer:section_1.info2", {
                          count: birthsOnBirthDay,
                          context: data.queryState === "Overseas" && "overseas",
                        })}
                        <span className="text-primary">
                          {data.queryState === "Overseas"
                            ? t("dashboard-birthday-explorer:section_1.overseas")
                            : CountryAndStates[data.queryState]}
                        </span>
                        {data.queryState !== "mys" ? section1 : <></>}
                        {birthsOnBirthDay === 0
                          ? "."
                          : t("dashboard-birthday-explorer:section_1.info5", {
                              count: birthsOnBirthDay,
                            })}
                        <p>
                          {t("dashboard-birthday-explorer:section_1.info6", { year: birthYear })}
                          <span className="text-primary">
                            {t("dashboard-birthday-explorer:section_1.rank", {
                              count: data.rank === data.y_day.length ? 0 : data.rank,
                              ordinal: true,
                              context: data.rank === data.y_day.length && "least",
                            })}
                          </span>
                          {t("dashboard-birthday-explorer:section_1.popularity", {
                            count: data.y_day.length === 366 ? 366 : 365,
                            context:
                              data.rank === data.y_day.length
                                ? "least"
                                : data.rank === 1
                                ? "first"
                                : "most",
                          })}
                          {t("dashboard-birthday-explorer:section_1.year_popular", {
                            count: new Date(data.year_popular).getDate(),
                            ordinal: true,
                            month: new Intl.DateTimeFormat(i18n.language, { month: "long" }).format(
                              new Date(data.year_popular)
                            ),
                          })}
                          {t("dashboard-birthday-explorer:section_1.rare")}
                          {t("dashboard-birthday-explorer:section_1.year_rare", {
                            count: new Date(data.year_rare).getDate(),
                            ordinal: true,
                            month: new Intl.DateTimeFormat(i18n.language, { month: "long" }).format(
                              new Date(data.year_rare)
                            ),
                          })}
                        </p>
                      </div>
                      <p className="font-medium">
                        {t("dashboard-birthday-explorer:section_1.explore")}
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card className="flex h-full flex-col gap-6 rounded-xl border border-outline py-8 dark:border-washed-dark lg:flex-row lg:pl-8">
                    <Card className="mx-auto flex h-min w-fit flex-row gap-2 self-center py-1.5 px-3">
                      <Spinner loading={data.loading} />
                    </Card>
                  </Card>
                )
              ) : (
                <Card className="hidden h-full items-center gap-6 rounded-xl border border-outline py-8 dark:border-washed-dark lg:flex">
                  <Card className="mx-auto flex h-min w-fit flex-row gap-2 self-center rounded-md border border-outline bg-outline py-1.5 px-3 dark:border-washed-dark dark:bg-washed-dark">
                    <SearchIcon className="mx-auto mt-1 h-4 w-4 text-black dark:text-white" />
                    <p>{t("dashboard-birthday-explorer:start_search")}</p>
                  </Card>
                </Card>
              )}
            </div>
          </div>
        </Section>

        {/* Number of babies born on each date */}
        <Section
          title={
            data.begin === data.end
              ? t("dashboard-birthday-explorer:section_2.sameyear", {
                  year: data.begin,
                  state:
                    data.queryState === "Overseas"
                      ? t("dashboard-birthday-explorer:section_2.overseas")
                      : CountryAndStates[data.queryState ? data.queryState : "mys"],
                })
              : t("dashboard-birthday-explorer:section_2.title", {
                  start_year: data.begin,
                  end_year: data.end,
                  state:
                    data.queryState === "Overseas"
                      ? t("dashboard-birthday-explorer:section_2.overseas")
                      : CountryAndStates[data.queryState ? data.queryState : "mys"],
                })
          }
          date={timeseries.data_as_of}
        >
          {/* Mobile */}
          <div className="block xl:hidden">
            <Modal
              trigger={open => (
                <Button
                  onClick={open}
                  className="mr-3 block self-center border border-outline px-3 py-1.5 shadow-sm dark:border-washed-dark"
                >
                  <span>{t("catalogue.filter")}</span>
                  <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white dark:bg-white dark:text-black"></span>
                </Button>
              )}
              title={
                <Label
                  label={t("catalogue.filter") + ":"}
                  className="block text-sm font-medium text-black dark:text-white"
                />
              }
              fullScreen
            >
              {close => (
                <div className="flex-grow space-y-4 divide-y overflow-y-auto pb-28 dark:divide-outlineHover-dark">
                  <Radio
                    label={t("catalogue.period")}
                    name="period"
                    className="flex flex-wrap gap-4 px-1 pt-2"
                    options={filterPeriods}
                    value={data.period}
                    onChange={e => {
                      setData("period", e);
                      e.value === "MONTH"
                        ? setData("groupByDay", false)
                        : setData("groupByDay", true);
                    }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Dropdown
                      width="w-full"
                      label={t("catalogue.begin")}
                      sublabel={t("catalogue.begin") + ":"}
                      options={filterYears(startYear, endYear)}
                      selected={data.begin}
                      placeholder={data.begin}
                      onChange={b => setData("begin", b.value)}
                    />
                    <Dropdown
                      label={t("catalogue.end")}
                      sublabel={t("catalogue.end") + ":"}
                      width="w-full"
                      disabled={!data.begin}
                      options={filterYears(startYear, endYear)}
                      selected={data.end}
                      placeholder={data.end}
                      onChange={e => setData("end", e.value)}
                    />
                  </div>
                  <div className="fixed bottom-0 left-0 w-full space-y-2 bg-white py-3 px-2 dark:bg-black">
                    <Button
                      className="btn btn-primary w-full justify-center"
                      disabled={data.begin === "1923" && data.end === "2017"}
                      onClick={reset}
                    >
                      {t("common.reset")}
                    </Button>
                    <Button
                      className="btn w-full justify-center"
                      icon={<XMarkIcon className="h-4 w-4" />}
                      onClick={close}
                    >
                      {t("common.close")}
                    </Button>
                  </div>
                </div>
              )}
            </Modal>
          </div>

          {/* Desktop */}
          <div className="hidden gap-2 pb-2 xl:flex">
            <Dropdown
              className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
              anchor={"left"}
              options={filterPeriods}
              placeholder={t("catalogue.period")}
              selected={data.period}
              onChange={e => {
                setData("period", e);
                e.value === "MONTH" ? setData("groupByDay", false) : setData("groupByDay", true);
              }}
            />
            <Daterange
              className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
              beginOptions={filterYears(startYear, endYear)}
              endOptions={filterYears(startYear, endYear)}
              anchor={"left"}
              selected={[
                filterYears(startYear, endYear).find(item => item.value === data.begin),
                filterYears(startYear, endYear).find(item => item.value === data.end),
              ]}
              onChange={([begin, end]) => {
                if (begin) {
                  setData("begin", begin.value);
                }
                if (end) {
                  setData("end", end.value);
                }
              }}
              onReset={() => {
                setData("begin", "1923");
                setData("end", "2017");
              }}
            />
          </div>
          {!data.timeseriesLoading ? (
            <Timeseries
              className="h-[350px] w-full"
              _ref={chartRef}
              interval={data.groupByDay ? "day" : "month"}
              round={data.groupByDay ? "day" : "month"}
              mode="grouped"
              minY={0}
              enableGridX={true}
              enableGridY={false}
              gridOffsetX={data.groupByDay ? false : true}
              tickOptionsX={data.groupByDay ? tickOptionsXDay : tickOptionsXMonth}
              tooltipCallback={tooltipCallback}
              tooltipFormat={data.groupByDay ? undefined : "MMMM"}
              data={{
                labels: data.x,
                datasets: [
                  {
                    type: data.groupByDay ? "line" : "bar",
                    data: data.groupByDay ? data.y_day : data.y_month,
                    label: t("dashboard-birthday-explorer:section_2.births"),
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth:
                      windowWidth <= BREAKPOINTS.MD
                        ? 0.75
                        : windowWidth <= BREAKPOINTS.LG
                        ? 1.0
                        : 1.5,
                    fill: true,
                  },
                ],
              }}
            />
          ) : (
            <div className="flex h-[350px] w-full">
              <div className="mx-auto self-center">
                <Spinner loading={data.timeseriesLoading} />
              </div>
            </div>
          )}
        </Section>
      </Container>
    </>
  );
};

export default BirthdayExplorerDashboard;
