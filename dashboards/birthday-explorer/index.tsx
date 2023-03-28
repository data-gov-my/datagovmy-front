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
} from "@components/index";
import dynamic from "next/dynamic";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useWindowWidth } from "@hooks/useWindowWidth";
import AgencyBadge from "@components/AgencyBadge";
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
import { Trans } from "next-i18next";
import Toggle from "@components/Toggle";

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

  const { data, setData } = useData({
    timeseries: timeseries,
    period: "YEARLY",
    begin: "1923",
    end: "2017",
    validation: false,
    state: "mys",
    queryState: "mys",
    datestring: "",
    queryBday: "",
    toggle: false,
  });
  const fetcher = (url: string) =>
    get(url).then(({ data }) => {
      setData("timeseries", data.timeseries);
    });

  const { error, isLoading } = useSWRImmutable(
    `dashboard/?dashboard=birthday_popularity&state=${data.queryState}`,
    fetcher
  );

  const daysInAYear = data.toggle ? 365 : 366;

  const daysOfYearInMillis: number[] = Array.from(
    { length: daysInAYear },
    (_, i) => i * 1000 * 60 * 60 * 24 + (data.toggle ? 0 : 63072000000) // true -> 1970, false -> 2000 (leap year)
  );

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
    const toggleLeapYear = data.toggle ? 0 : 1;
    return isLeapYear(date.getFullYear()) ? day : day > 59 ? day + toggleLeapYear : day;
  };

  const groupValuesByDayOfYear = (
    milliseconds: number[],
    values: number[],
    yearRange?: [number, number]
  ) => {
    const result: number[] = new Array(daysInAYear).fill(0);
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
  const { years, months, days } = getAge(data.queryBday);
  const options: DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

  const birthDate = new Date(data.queryBday);
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
  );
  const birthsMap = birthsOnBirthYear.map((births, index) => ({ day: index, value: births }));
  const sortedBirthsOnBirthYear = birthsMap.sort((a, b) => b.value - a.value);
  const birthsOnBirthDay = birthsOnBirthYear[getDayOfYear(new Date(data.queryBday)) - 1];
  const minBirths = Math.min(...birthsOnBirthYear);
  const maxBirths = Math.max(...birthsOnBirthYear);

  const filterTimeline = () => {
    return {
      births: groupValuesByDayOfYear(data.timeseries.data.x, data.timeseries.data.births, [
        Number(data.begin),
        Number(data.end),
      ]),
    };
  };
  const filtered_timeline = useCallback(filterTimeline, [data.begin, data.end, data.timeseries]);

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
        {t("dashboard-birthday-explorer:section_1.count2", {
          count: birthsNationwideOnBirthYear[getDayOfYear(birthDate) - 1],
        })}
      </span>
      {t("dashboard-birthday-explorer:section_1.info4", {
        count: birthsNationwideOnBirthYear[getDayOfYear(birthDate) - 1],
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

  const filterYears = (start: number, end: number): Array<OptionType> => {
    return Array(end - start + 1)
      .fill(end)
      .map((year, index) => ({ label: `${year - index}`, value: `${year - index}` }));
  };

  const reset = () => {
    setData("period", undefined);
    setData("begin", "1923");
    setData("end", "2017");
  };
  return (
    <>
      <Hero
        background="bg-gradient-radial border-b dark:border-washed-dark from-[#A1BFFF] to-background dark:from-outlineHover-dark dark:to-black"
        category={[t("nav.megamenu.categories.demography"), "text-primary"]}
        header={[t("dashboard-birthday-explorer:header")]}
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
                  max={new Date(2018, 0, 1).toISOString().split("T")[0]}
                  required
                  onChange={selected => {
                    setData("datestring", selected.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleClick();
                  }}
                  className={`relative flex w-full gap-[6px] rounded-md border-2 bg-white py-[6px] pl-3 text-left text-sm active:bg-washed
                   dark:bg-black dark:text-white dark:active:bg-washed/10 lg:items-center 
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
                !isLoading ? (
                  <Card className="flex h-full flex-col gap-6 rounded-xl border border-outline dark:border-washed-dark lg:flex-row lg:pl-8">
                    <Card className="my-0 flex h-fit w-full basis-1/3 flex-col self-center rounded-t-xl border border-outline bg-background px-4 py-8 dark:border-washed-dark dark:bg-washed-dark lg:my-8 lg:rounded-xl lg:py-16">
                      <CakeIcon className="mx-auto h-10 w-10 text-primary" />
                      <div className="mx-auto mt-4 text-center text-lg font-bold text-black dark:text-white">
                        {new Date(data.queryBday).toLocaleDateString("en-GB", options)}
                      </div>
                      <div className="mx-auto mt-3 text-center text-sm text-dim">
                        {t("dashboard-birthday-explorer:section_1.age", {
                          years: years,
                          months: months,
                          days: days,
                        })}
                      </div>
                    </Card>
                    <div className="flex basis-2/3 flex-col gap-3 self-center px-4 pb-8 lg:pt-8 lg:pl-0 lg:pr-8">
                      <div className="mx-auto text-lg font-bold text-black dark:text-white">
                        {t("dashboard-birthday-explorer:section_1.info1", {
                          count: birthsOnBirthDay,
                        })}
                        <span className="mx-auto text-lg font-bold text-primary">
                          {t("dashboard-birthday-explorer:section_1.count1", {
                            count: birthsOnBirthDay,
                          })}
                        </span>
                        {data.queryState === "Overseas"
                          ? t("dashboard-birthday-explorer:section_1.info2_overseas", {
                              count: birthsOnBirthDay,
                            })
                          : t("dashboard-birthday-explorer:section_1.info2", {
                              count: birthsOnBirthDay,
                            })}
                        <span className="mx-auto text-lg font-bold text-primary">
                          {data.queryState === "Overseas"
                            ? t("dashboard-birthday-explorer:section_1.overseas")
                            : CountryAndStates[data.queryState]}
                        </span>
                        {data.queryState !== "mys" ? section1 : <></>}
                        {t("dashboard-birthday-explorer:section_1.info5", {
                          count: birthsNationwideOnBirthYear[getDayOfYear(birthDate) - 1],
                        })}
                        <p className="mx-auto font-bold text-black dark:text-white">
                          {t("dashboard-birthday-explorer:section_1.info6", { year: birthYear })}
                          <span className="mx-auto text-lg font-bold text-primary">
                            {t("dashboard-birthday-explorer:section_1.info7", {
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
                          {t("dashboard-birthday-explorer:section_1.info8", {
                            popular: formatDayOfYear(birthsOnBirthYear.indexOf(maxBirths)),
                            rare: formatDayOfYear(birthsOnBirthYear.indexOf(minBirths)),
                          })}
                        </p>
                      </div>
                      <p className="font-medium text-black dark:text-white">
                        {t("dashboard-birthday-explorer:section_1.explore")}
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
                    <p>{t("dashboard-birthday-explorer:start_search")}</p>
                  </Card>
                </Card>
              ) : (
                <></>
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
                      ? t("dashboard-birthday-explorer:section_1.overseas")
                      : CountryAndStates[data.queryState ? data.queryState : "mys"],
                })
              : t("dashboard-birthday-explorer:section_2.title", {
                  start_year: data.begin,
                  end_year: data.end,
                  state:
                    data.queryState === "Overseas"
                      ? t("dashboard-birthday-explorer:section_1.overseas")
                      : CountryAndStates[data.queryState ? data.queryState : "mys"],
                })
          }
          description={
            hasLeapYear([data.begin, data.end])
              ? ""
              : data.begin === data.end
              ? t("dashboard-birthday-explorer:section_2.desc_sameyear", {
                  year: data.begin,
                })
              : t("dashboard-birthday-explorer:section_2.description", {
                  start_year: data.begin,
                  end_year: data.end,
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
                      options={data.end ? filterYears(Number(data.begin), Number(data.end)) : []}
                      selected={data.begin}
                      placeholder={data.begin}
                      onChange={begin => {
                        setData("begin", begin.value);
                      }}
                    />
                    <Dropdown
                      label={t("catalogue.end")}
                      sublabel={t("catalogue.end") + ":"}
                      width="w-full"
                      disabled={!data.begin}
                      options={data.begin ? filterYears(Number(data.begin), Number(data.end)) : []}
                      selected={data.end}
                      placeholder={data.end}
                      onChange={e => {
                        setData("end", e.value);
                      }}
                    />
                  </div>
                  {/* // TODO: perhaps a toggle to remove Feb 29  */}
                  {/* <Toggle
                    enabled={false}
                    onStateChanged={checked => setData("toggle", checked)}
                    label={t("dashboard-birthday-explorer:toggle")}
                  /> */}
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
          <div className="hidden gap-2 pr-6 xl:flex">
            <Dropdown
              className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
              options={filterPeriods}
              placeholder={t("catalogue.period")}
              selected={data.period}
              onChange={e => setData("period", e)}
            />
            <Daterange
              className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
              beginOptions={data.begin ? filterYears(Number(data.begin), Number(data.end)) : []}
              endOptions={data.end ? filterYears(Number(data.begin), Number(data.end)) : []}
              beginScrollBottom={true}
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
            {/* // TODO: perhaps a toggle to remove Feb 29  */}
            {/* <Toggle
              enabled={false}
              onStateChanged={checked => setData("toggle", checked)}
              label={t("dashboard-birthday-explorer:toggle")}
            /> */}
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
        </Section>
      </Container>
    </>
  );
};

export default BirthdayExplorerDashboard;
