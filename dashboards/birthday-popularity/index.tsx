import { FunctionComponent, useCallback, useRef, useState } from "react";
import {
  Container,
  Hero,
  Section,
  StateDropdown,
  Button,
  Modal,
  Dropdown,
  Radio,
  Checkbox,
} from "@components/index";
import dynamic from "next/dynamic";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useWindowWidth } from "@hooks/useWindowWidth";
import AgencyBadge from "@components/AgencyBadge";
import Slider from "@components/Chart/Slider";
import {
  CakeIcon,
  IdentificationIcon,
  MagnifyingGlassIcon as SearchIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Card from "@components/Card";
import { DateTimeFormatOptions } from "luxon";
import { numFormat } from "@lib/helpers";
import { get } from "@lib/api";
import useSWRImmutable from "swr";
import { SpinnerIcon } from "@components/Icon";
import Label from "@components/Label";
import { OptionType } from "@components/types";
import Daterange from "@components/Dropdown/Daterange";

/**
 * Birthday Popularity Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface BirthdayPopularityDashboardProps {
  timeseries: any;
}

const BirthdayPopularityDashboard: FunctionComponent<BirthdayPopularityDashboardProps> = ({
  timeseries,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-birthday-popularity"]);
  const chartRef = useRef(null);
  const windowWidth = useWindowWidth();

  const { data, setData } = useData({
    timeseries: timeseries,
    period: "YEARLY",
    begin: undefined,
    end: undefined,
  });
  const fetcher = (url: string) =>
    get(url).then(({ data }) => {
      setData("timeseries", data.timeseries);
    });

  const [state, setState] = useState("mys");
  const [datestring, setDatestring] = useState("");
  const [queryState, setQueryState] = useState("mys");
  const [queryBday, setQueryBday] = useState("");
  const [minmax, setMinmax] = useState<[number, number]>([0, 94]);
  const { error, isLoading } = useSWRImmutable(
    `dashboard/?dashboard=birthday_popularity&state=${queryState}&bday=01-01`,
    fetcher
  );
  console.log(minmax);
  const daysOfYearInMillis: number[] = Array.from(
    { length: 366 },
    (_, i) => i * 1000 * 60 * 60 * 24 + 63072000000
  );

  const oldest_year = new Date(data.timeseries.data.x[0]).getFullYear();
  const diff =
    (data.timeseries.data.x[data.timeseries.data.x.length - 1] - data.timeseries.data.x[0]) /
    (365 * 24 * 60 * 60 * 1000);
  const yearRange: number[] = Array.from({ length: diff }, (_, i) => i + oldest_year);

  const isLeapYear = (year: number) => {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  };

  const hasLeapYear = (yearRange: [number, number]) => {
    for (let i = yearRange[0]; i <= yearRange[1]; i++) {
      if (isLeapYear(i)) return true;
    }
    return false;
  };

  const getDayOfYear = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return isLeapYear(date.getFullYear()) ? day : day > 59 ? day + 1 : day;
  };

  const groupValuesByDayOfYear = (
    milliseconds: number[],
    values: number[],
    yearRange?: [number, number]
  ) => {
    const result: number[] = new Array(366).fill(0);
    for (let i = 0; i < milliseconds.length; i++) {
      const date = new Date(milliseconds[i]);
      const year = date.getFullYear();
      if (yearRange && (year < yearRange[0] || year > yearRange[1])) {
        continue; // Skip data point outside range
      }
      const dayOfYear = getDayOfYear(date);
      result[dayOfYear - 1] += values[i];
    }
    return result;
  };

  const getAge = (dateString: string) => {
    let years = 0;
    let months = 0;
    let days = 0;
    const birthDate = new Date(dateString);
    const currentDate = new Date();
    // const currentDate = new Date(2020, 1, 29); // test

    // Calculate years
    years = currentDate.getFullYear() - birthDate.getFullYear();

    // Calculate months and days
    const birthMonth = birthDate.getMonth();
    const currentMonth = currentDate.getMonth();
    if (currentMonth >= birthMonth) {
      months = currentMonth - birthMonth;
    } else {
      years--;
      months = 12 + currentMonth - birthMonth;
    }
    const birthDay = birthDate.getDate();
    const currentDay = currentDate.getDate();
    if (currentDay >= birthDay) {
      days = currentDay - birthDay;
    } else {
      months--;
      const daysInLastMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
      days = daysInLastMonth + currentDay - birthDay;
      if (
        isLeapYear(birthDate.getFullYear()) &&
        birthMonth === 1 &&
        birthDay === 29 &&
        !isLeapYear(currentDate.getFullYear()) &&
        currentMonth === 2
      )
        days++;
      if (months < 0) {
        years--;
        months = 11;
      }
    }
    return { years, months, days };
  };
  const { years, months, days } = getAge(queryBday);
  const options: DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

  const handleMinMax = (string: String): [number, number] => {
    return string &&
      Number(string.substring(0, string.indexOf("-"))) < 2017 &&
      Number(string.substring(0, string.indexOf("-"))) > oldest_year
      ? [
          Number(string.substring(0, string.indexOf("-"))) - oldest_year - 1,
          Number(string.substring(0, string.indexOf("-"))) - oldest_year + 1,
        ]
      : [0, yearRange.length - 1];
  };
  const birthDate = new Date(queryBday);
  const birthYear = birthDate.getFullYear();
  const birthsNationwideOnBirthYear = groupValuesByDayOfYear(
    timeseries.data.x,
    timeseries.data.births,
    [birthYear, birthYear]
  );
  const birthsOnBirthYear = groupValuesByDayOfYear(
    data.timeseries.data.x,
    data.timeseries.data.births,
    [birthYear, birthYear]
  ); //.map((births, index) => ({ day: index, value: births })).sort((a, b) => b.value - a.value);
  const birthsMap = birthsOnBirthYear.map((births, index) => ({ day: index, value: births }));
  const sortedBirthsOnBirthYear = birthsMap.sort((a, b) => b.value - a.value);
  const birthsOnBirthDay = birthsOnBirthYear[getDayOfYear(new Date(queryBday)) - 1];
  const minBirths = Math.min(...birthsOnBirthYear);
  const maxBirths = Math.max(...birthsOnBirthYear);

  const filterTimeline = () => {
    return {
      births: groupValuesByDayOfYear(data.timeseries.data.x, data.timeseries.data.births, [
        minmax[0] + oldest_year,
        minmax[1] + oldest_year,
      ]),
    };
  };
  const filtered_timeline = useCallback(filterTimeline, [minmax, data.timeseries]);

  const description = (
    <>
      {t("dashboard-birthday-popularity:description")}
      <span className="italic">{t("dashboard-birthday-popularity:quote")}</span>
      {t("dashboard-birthday-popularity:description2")}
    </>
  );

  const section1 = (
    <>
      {t("dashboard-birthday-popularity:section_1.info3")}
      <span className="mx-auto text-lg font-bold text-primary">
        {t("dashboard-birthday-popularity:section_1.count2", {
          count: birthsNationwideOnBirthYear[getDayOfYear(birthDate) - 1],
        })}
      </span>
      {t("dashboard-birthday-popularity:section_1.info4", {
        count: birthsNationwideOnBirthYear[getDayOfYear(birthDate) - 1],
      })}
    </>
  );

  function handleClick(): void {
    setQueryBday(datestring);
    setQueryState(state);
    setMinmax(handleMinMax(datestring));
  }

  function formatDayOfYear(dayOfYear: number): string {
    const date = new Date(2000, 0, dayOfYear + 1);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-GB", { month: "long" }).format(date);
    return `${day}${daySuffix(day)} ${month}`;
  }

  function daySuffix(day: number): string {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
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

  const tickOptionsX: any = () => {
    return {
      callback(val: string, index: number, values: any): string | null {
        const daysToShow: number[] = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 365];
        const x = daysToShow.includes(index) ? val : null;
        return x;
      },
      minRotation: 0,
      maxRotation: 0,
      font: {
        family: "Inter",
      },
    };
  };

  const filterPeriods: Array<OptionType> = [
    // { label: t("catalogue.index_filters.daily"), value: "DAILY" },
    // { label: t("catalogue.index_filters.weekly"), value: "WEEKLY" },
    // { label: t("catalogue.index_filters.monthly"), value: "MONTHLY" },
    { label: t("catalogue.index_filters.yearly"), value: "YEARLY" },
  ];

  const startYear: number = 1923;
  const endYear: number = 2017;

  const filterYears = (start: number, end: number): Array<OptionType> =>
    Array(end - start + 1)
      .fill(start)
      .map((year, index) => ({ label: `${year + index}`, value: `${year + index}` }));

  const reset = () => {
    setData("period", "YEARLY");
    setData("begin", 1923);
    setData("end", 2017);
  };
  // const sliderRef = useRef<SliderRef>(null);
  // useWatch(() => {
  //   sliderRef.current && sliderRef.current.reset();
  // }, [data.timeseries.data]);
  return (
    <>
      <Hero
        background="bg-gradient-radial border-b dark:border-zinc-800 from-[#A1BFFF] to-background dark:from-outlineHover-dark dark:to-black"
        category={[t("nav.megamenu.categories.demography"), "text-primary"]}
        header={[t("dashboard-birthday-popularity:header")]}
        description={[description, "dark:text-outline"]}
        agencyBadge={
          <AgencyBadge
            agency="Jabatan Pendaftaran Negara"
            link="https://www.jpn.gov.my/en/"
            icon={
              <div className="h-8 w-8 rounded-full bg-primary">
                <IdentificationIcon className="mx-auto mt-1 h-6 w-6 text-white" />
              </div>
            }
          />
        }
      />
      <Container className="min-h-screen">
        <Section>
          <div className="flex flex-col gap-8 rounded-xl lg:flex-row">
            <Card
              className="flex basis-1/3 flex-col justify-between rounded-xl border border-outline p-6 dark:border-washed-dark"
              type="gray"
            >
              <div>
                <p className="mb-3 text-sm font-medium text-black dark:text-white">
                  {t("dashboard-birthday-popularity:enter_birthday")}
                </p>
                <input
                  type="date"
                  name="date"
                  id="date"
                  data-placeholder="Date of birth"
                  value={datestring}
                  min={new Date(1923, 0, 1).toISOString().split("T")[0]}
                  max={new Date(2018, 0, 1).toISOString().split("T")[0]}
                  required
                  onChange={selected => {
                    setDatestring(selected.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleClick();
                  }}
                  className={[
                    `relative flex w-full gap-[6px] rounded-md border border-outline bg-white py-[6px] pl-3 text-left text-sm hover:border-outlineHover
                  focus:outline-none focus-visible:ring-0 active:bg-washed dark:border-washed-dark dark:border-outline/10 dark:bg-black dark:text-white dark:active:bg-washed/10 lg:items-center 
                   `,
                  ].join(" ")}
                ></input>
                <p className="mt-6 mb-3 text-sm font-medium text-black dark:text-white">
                  {t("dashboard-birthday-popularity:choose_state")}
                </p>
                <StateDropdown
                  currentState={state}
                  onChange={selected => {
                    setState(selected.value);
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
                  {t("dashboard-birthday-popularity:search")}
                </Button>
              </div>
              <p className="text-sm text-dim dark:text-white">
                {t("dashboard-birthday-popularity:privacy")}
              </p>
            </Card>
            <div className="basis-2/3">
              {queryBday ? (
                !isLoading ? (
                  <Card className="flex h-full flex-col gap-6 rounded-xl border border-outline dark:border-washed-dark lg:flex-row lg:pl-8">
                    <Card className="my-0 flex h-fit w-full basis-1/3 flex-col self-center rounded-t-xl border border-outline bg-background px-4 py-8 dark:border-washed-dark dark:bg-washed-dark lg:my-8 lg:rounded-xl lg:py-16">
                      <CakeIcon className="mx-auto h-10 w-10 text-primary" />
                      <div className="mx-auto mt-4 text-center text-lg font-bold text-black dark:text-white">
                        {new Date(queryBday).toLocaleDateString("en-GB", options)}
                      </div>
                      <div className="mx-auto mt-3 text-center text-sm text-dim">
                        {t("dashboard-birthday-popularity:section_1.age", {
                          years: years,
                          months: months,
                          days: days,
                        })}
                      </div>
                    </Card>
                    <div className="flex basis-2/3 flex-col gap-3 self-center px-4 pb-8 lg:pt-8 lg:pl-0 lg:pr-8">
                      <div className="mx-auto text-lg font-bold text-black dark:text-white">
                        {t("dashboard-birthday-popularity:section_1.info1", {
                          count: birthsOnBirthDay,
                        })}
                        <span className="mx-auto text-lg font-bold text-primary">
                          {t("dashboard-birthday-popularity:section_1.count1", {
                            count: birthsOnBirthDay,
                          })}
                        </span>
                        {queryState === "Overseas"
                          ? t("dashboard-birthday-popularity:section_1.info2_overseas", {
                              count: birthsOnBirthDay,
                            })
                          : t("dashboard-birthday-popularity:section_1.info2", {
                              count: birthsOnBirthDay,
                            })}
                        <span className="mx-auto text-lg font-bold text-primary">
                          {queryState === "Overseas"
                            ? t("dashboard-birthday-popularity:section_1.overseas")
                            : CountryAndStates[queryState]}
                        </span>
                        {queryState !== "mys" ? section1 : <></>}
                        {t("dashboard-birthday-popularity:section_1.info5", {
                          count: birthsNationwideOnBirthYear[getDayOfYear(birthDate) - 1],
                        })}
                        <p className="mx-auto font-bold text-black dark:text-white">
                          {t("dashboard-birthday-popularity:section_1.info6", { year: birthYear })}
                          <span className="mx-auto text-lg font-bold text-primary">
                            {t("dashboard-birthday-popularity:section_1.info7", {
                              rank:
                                sortedBirthsOnBirthYear
                                  .map(e => e.day)
                                  .indexOf(getDayOfYear(birthDate) - 1) + 1,
                              suffix: daySuffix(
                                sortedBirthsOnBirthYear
                                  .map(e => e.day)
                                  .indexOf(getDayOfYear(birthDate) - 1) + 1
                              ),
                            })}
                          </span>
                          {t("dashboard-birthday-popularity:section_1.info8", {
                            popular: formatDayOfYear(birthsOnBirthYear.indexOf(maxBirths)),
                            rare: formatDayOfYear(birthsOnBirthYear.indexOf(minBirths)),
                          })}
                        </p>
                      </div>
                      <p className="font-medium text-black dark:text-white">
                        {t("dashboard-birthday-popularity:section_1.info9")}
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card className="flex h-full flex-col gap-6 rounded-xl border border-outline py-8 dark:border-washed-dark lg:flex-row lg:pl-8">
                    <Card className="mx-auto flex h-min w-fit flex-row gap-2 self-center py-1.5 px-3">
                      <SpinnerIcon className="mx-auto mt-1 h-4 w-4 text-black dark:text-white" />
                    </Card>
                  </Card>
                )
              ) : windowWidth >= BREAKPOINTS.LG ? (
                <Card className="flex h-full flex-col gap-6 rounded-xl border border-outline py-8 dark:border-washed-dark lg:flex-row lg:pl-8">
                  <Card className="mx-auto flex h-min w-fit flex-row gap-2 self-center rounded-md border border-outline bg-outline py-1.5 px-3 dark:border-washed-dark dark:bg-washed-dark">
                    <SearchIcon className="mx-auto mt-1 h-4 w-4 text-black dark:text-white" />
                    <p>{t("dashboard-birthday-popularity:start_search")}</p>
                  </Card>
                </Card>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Section>

        {/* Number of people born on each day of the year */}
        <Section
          title={
            minmax[0] === minmax[1]
              ? t("dashboard-birthday-popularity:section_2.sameyear", {
                  year: yearRange[minmax[0]],
                  state:
                    queryState === "Overseas"
                      ? t("dashboard-birthday-popularity:section_1.overseas")
                      : CountryAndStates[queryState ? queryState : "mys"],
                })
              : t("dashboard-birthday-popularity:section_2.title", {
                  start_year: yearRange[minmax[0]],
                  end_year: yearRange[minmax[1]],
                  state:
                    queryState === "Overseas"
                      ? t("dashboard-birthday-popularity:section_1.overseas")
                      : CountryAndStates[queryState ? queryState : "mys"],
                })
          }
          description={
            hasLeapYear([yearRange[minmax[0]], yearRange[minmax[1]]])
              ? ""
              : minmax[0] === minmax[1]
              ? t("dashboard-birthday-popularity:section_2.desc_sameyear", {
                  year: yearRange[minmax[0]],
                })
              : t("dashboard-birthday-popularity:section_2.description", {
                  start_year: yearRange[minmax[0]],
                  end_year: yearRange[minmax[1]],
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
                    onChange={e => setData("period", e)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Dropdown
                      width="w-full"
                      label={t("catalogue.begin")}
                      sublabel={t("catalogue.begin") + ":"}
                      options={filterYears(startYear, endYear)}
                      selected={data.begin}
                      placeholder={t("common.select")}
                      onChange={e => {
                        setData("begin", e);
                        setMinmax([Number(e.value) - oldest_year, minmax[1]]);
                      }}
                    />
                    <Dropdown
                      label={t("catalogue.end")}
                      sublabel={t("catalogue.end") + ":"}
                      width="w-full"
                      disabled={!data.begin}
                      options={data.begin ? filterYears(+data.begin.value, endYear) : []}
                      selected={data.end}
                      placeholder={t("common.select")}
                      onChange={e => {
                        setData("end", e);
                        setMinmax([minmax[0], Number(e.value) - oldest_year]);
                      }}
                    />
                  </div>

                  <div className="fixed bottom-0 left-0 w-full space-y-2 bg-white py-3 px-2 dark:bg-black">
                    <Button
                      className="btn btn-primary w-full justify-center"
                      // disabled={
                      //   actives.length === 0 ||
                      //   actives.findIndex(active => active[0] === "source") === -1
                      // }
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
          <div className="hidden gap-2 pr-6 xl:flex">
            <Dropdown
              options={filterPeriods}
              placeholder={t("catalogue.period")}
              selected={data.period}
              onChange={e => setData("period", e)}
            />
            <Daterange
              options={filterYears(startYear, endYear)}
              selected={[data.begin, data.end]}
              onChange={([begin, end]) => {
                if (begin) {
                  setData("begin", begin);
                  setMinmax([Number(begin.value) - oldest_year, minmax[1]]);
                }
                if (end) {
                  setData("end", end);
                  setMinmax([minmax[0], Number(end.value) - oldest_year]);
                }
              }}
              onReset={() => {
                setData("begin", undefined);
                setData("end", undefined);
              }}
            />
          </div>
          <Timeseries
            className="h-[350px] w-full"
            _ref={chartRef}
            interval="day"
            round="day"
            mode="grouped"
            enableGridX={true}
            enableGridY={false}
            gridOffsetX={false}
            tickOptionsX={tickOptionsX}
            tooltipCallback={tooltipCallback}
            data={{
              labels: daysOfYearInMillis,
              datasets: [
                {
                  type: "line",
                  data: filtered_timeline().births,
                  label: t("dashboard-birthday-popularity:section_2.births"),
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
          <div className="pt-6">
            <Slider
              // ref={sliderRef}
              type="range"
              value={minmax}
              data={yearRange}
              parseAsDate={false}
              onChange={e => setMinmax(e)}
            />
          </div>
        </Section>
      </Container>
    </>
  );
};

export default BirthdayPopularityDashboard;
