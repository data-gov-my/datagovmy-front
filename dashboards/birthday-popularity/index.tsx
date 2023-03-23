import { FunctionComponent, useCallback, useMemo, useRef, useState } from "react";
import { Container, Hero, Section, StateDropdown, Button } from "@components/index";
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
} from "@heroicons/react/24/solid";
import Card from "@components/Card";
import { useFilter } from "@hooks/useFilter";
import { DateTimeFormatOptions } from "luxon";
import { numFormat } from "@lib/helpers";

/**
 * Birthday Popularity Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface BirthdayPopularityDashboardProps {
  query: any;
  rank: any;
  timeseries: any;
}

const BirthdayPopularityDashboard: FunctionComponent<BirthdayPopularityDashboardProps> = ({
  query,
  rank,
  timeseries,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-birthday-popularity"]);
  const chartRef = useRef(null);
  const windowWidth = useWindowWidth();
  const daysOfYearInMillis: number[] = Array.from(
    { length: 366 },
    (_, i) => i * 1000 * 60 * 60 * 24 + 63072000000
  );

  const oldest_year = new Date(timeseries.data.x[0]).getFullYear();
  const diff =
    (timeseries.data.x[timeseries.data.x.length - 1] - timeseries.data.x[0]) /
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

  // const today = new Date().toISOString().split("T")[0];
  const getAge = (dateString: string) => {
    let years = 0;
    let months = 0;
    let days = 0;
    const birthDate = new Date(dateString);
    const currentDate = new Date();
    // const currentDate = new Date(2020, 1, 29);

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
  const { years, months, days } = getAge(query.bday);
  const options: DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

  const handleMinMax = (string: String) => {
    return string &&
      Number(string.substring(0, string.indexOf("-"))) < 2017 &&
      Number(string.substring(0, string.indexOf("-"))) > oldest_year
      ? [
          Number(string.substring(0, string.indexOf("-"))) - oldest_year - 1,
          Number(string.substring(0, string.indexOf("-"))) - oldest_year + 1,
        ]
      : [0, yearRange.length - 1];
  };

  const { data, setData } = useData({
    state: query.state ? query.state : "mys",
    minmax: handleMinMax(query.bday),
    bday: query.bday ? query.bday : undefined,
    string: query.bday ? query.bday : undefined,
  });

  const handleClick = () => {
    setFilter("state", data.state);
    setFilter("bday", data.string);
    setData("minmax", handleMinMax(data.string));
  };

  const filterTimeline = () => {
    return {
      births: groupValuesByDayOfYear(timeseries.data.x, timeseries.data.births, [
        data.minmax[0] + oldest_year,
        data.minmax[1] + oldest_year,
      ]),
    };
  };
  const filtered_timeline = useCallback(filterTimeline, [data.minmax, timeseries]);

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

  const birthDate = new Date(query.bday);
  const birthYear = birthDate.getFullYear();
  // const totalBirths = useMemo(() => groupValuesByDayOfYear(timeseries.data.x, timeseries.data.births), []);
  const mysTimeseries = useMemo(() => timeseries.data, []);
  const totalBirthsNationwide = groupValuesByDayOfYear(mysTimeseries.x, mysTimeseries.births);
  console.log(totalBirthsNationwide[0]);
  console.log(totalBirthsNationwide[1]);
  const birthsNationwideOnBirthYear = groupValuesByDayOfYear(
    mysTimeseries.x,
    mysTimeseries.births,
    [birthYear, birthYear]
  );
  console.log(birthsNationwideOnBirthYear[0]);
  console.log(birthsNationwideOnBirthYear[1]);
  const birthsOnBirthYear = groupValuesByDayOfYear(timeseries.data.x, timeseries.data.births, [
    birthYear,
    birthYear,
  ]);
  console.log(birthsOnBirthYear[0]);
  console.log(birthsOnBirthYear[1]);
  const birthsOnBirthDay = birthsOnBirthYear[getDayOfYear(birthDate) - 1];
  const minBirths = Math.min(...birthsOnBirthYear);
  const maxBirths = Math.max(...birthsOnBirthYear);

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

  // const sliderRef = useRef<SliderRef>(null);
  // useWatch(() => {
  //   sliderRef.current && sliderRef.current.reset();
  // }, [timeseries.data]);
  const [isLoading, setLoading] = useState(false);
  const { filter, setFilter } = useFilter({
    state: query.state,
    bday: query.bday,
  });
  return (
    <>
      <Hero
        background="bg-gradient-radial border-b dark:border-zinc-800 from-[#A1BFFF] to-background dark:from-outlineHover-dark dark:to-black"
        category={[t("nav.megamenu.categories.demography"), "text-primary"]}
        header={[t("dashboard-birthday-popularity:header")]}
        description={[t("dashboard-birthday-popularity:description"), "dark:text-outline"]}
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
                  value={data.string}
                  // placeholder="28 September 1993"
                  // required pattern="dd Month yyyy"
                  min={new Date(1923, 0, 1).toISOString().split("T")[0]}
                  max={new Date(2018, 0, 0).toISOString().split("T")[0]}
                  required
                  onChange={selected => {
                    setData("string", selected.target.value);
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
                  // disabled={!}
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
              {query.bday ? (
                <Card className="flex h-full flex-col gap-6 rounded-xl border border-outline dark:border-washed-dark lg:flex-row lg:pl-8">
                  <Card className="my-0 flex h-fit w-full basis-1/3 flex-col self-center rounded-t-xl border border-outline bg-background px-4 py-8 dark:border-washed-dark dark:bg-washed-dark lg:my-8 lg:rounded-xl lg:py-16">
                    <CakeIcon className="mx-auto h-10 w-10 text-primary" />
                    <div className="mx-auto mt-4 text-center text-lg font-bold text-black dark:text-white">
                      {new Date(query.bday).toLocaleDateString("en-GB", options)}
                    </div>
                    <div className="mx-auto mt-3 text-center text-sm text-dim">
                      {t("dashboard-birthday-popularity:section_1.age", {
                        years: years,
                        months: months,
                        days: days,
                      })}
                    </div>
                  </Card>
                  <div className="flex basis-2/3 flex-col gap-3 self-center px-4 lg:py-8 lg:pl-0 lg:pr-8">
                    <div className="mx-auto text-lg font-bold text-black dark:text-white">
                      {t("dashboard-birthday-popularity:section_1.info1", {
                        count: birthsOnBirthDay,
                      })}
                      <span className="mx-auto text-lg font-bold text-primary">
                        {t("dashboard-birthday-popularity:section_1.count1", {
                          count: birthsOnBirthDay,
                        })}
                      </span>
                      {t("dashboard-birthday-popularity:section_1.info2", {
                        count: birthsOnBirthDay,
                      })}
                      <span className="mx-auto text-lg font-bold text-primary">
                        {CountryAndStates[query.state]}
                      </span>
                      {query.state !== "mys" ? section1 : <></>}
                      {t("dashboard-birthday-popularity:section_1.info5", {
                        count: birthsNationwideOnBirthYear[getDayOfYear(birthDate) - 1],
                      })}
                      <p className="mx-auto font-bold text-black dark:text-white">
                        {t("dashboard-birthday-popularity:section_1.info6")}
                        <span className="mx-auto text-lg font-bold text-primary">
                          {t("dashboard-birthday-popularity:section_1.info7", {
                            rank: rank.data.rank,
                            suffix: daySuffix(rank.data.rank),
                          })}
                        </span>
                        {t("dashboard-birthday-popularity:section_1.info8", {
                          popular: formatDayOfYear(birthsOnBirthYear.indexOf(maxBirths)),
                          rare: formatDayOfYear(birthsOnBirthYear.indexOf(minBirths)),
                        })}
                      </p>
                    </div>
                    <p className="mx-auto font-medium text-black dark:text-white">
                      {t("dashboard-birthday-popularity:section_1.info9")}
                    </p>
                  </div>
                </Card>
              ) : windowWidth >= BREAKPOINTS.LG ? (
                <Card className="flex h-full flex-col gap-6 rounded-xl border border-outline dark:border-washed-dark lg:flex-row lg:pl-8">
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
            data.minmax[0] === data.minmax[1]
              ? t("dashboard-birthday-popularity:section_2.sameyear", {
                  year: yearRange[data.minmax[0]],
                  state: CountryAndStates[query.state ? query.state : "mys"],
                })
              : t("dashboard-birthday-popularity:section_2.title", {
                  start_year: yearRange[data.minmax[0]],
                  end_year: yearRange[data.minmax[1]],
                  state: CountryAndStates[query.state ? query.state : "mys"],
                })
          }
          description={
            hasLeapYear([yearRange[data.minmax[0]], yearRange[data.minmax[1]]])
              ? ""
              : data.minmax[0] === data.minmax[1]
              ? t("dashboard-birthday-popularity:section_2.desc_sameyear", {
                  year: yearRange[data.minmax[0]],
                })
              : t("dashboard-birthday-popularity:section_2.description", {
                  start_year: yearRange[data.minmax[0]],
                  end_year: yearRange[data.minmax[1]],
                })
          }
          date={timeseries.data_as_of}
        >
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
              value={data.minmax}
              data={yearRange}
              parseAsDate={false}
              onChange={e => setData("minmax", e)}
            />
          </div>
        </Section>
      </Container>
    </>
  );
};

export default BirthdayPopularityDashboard;
