import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button, Container, Panel, Section, Tabs } from "datagovmy-ui/components";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { clx } from "datagovmy-ui/helpers";
import { useCache, useData, useTranslation } from "datagovmy-ui/hooks";
import chunk from "lodash/chunk";
import { FunctionComponent, useContext, useMemo, useRef } from "react";

/**
 * Upcoming Publications
 * @overview Status: In-development
 */

interface UpcomingPublicationsProps {}

type ScheduledPub = {
  day: number;
  month: number;
  year: number;
  pubs: string[];
};

const UpcomingPublicationsDashboard: FunctionComponent<UpcomingPublicationsProps> = ({}) => {
  const { t, i18n } = useTranslation(["publications", "common"]);
  const desktopRef = useRef<Record<string, HTMLElement | null>>({});
  const mobileRef = useRef<Record<string, HTMLElement | null>>({});
  const { size } = useContext(WindowContext);

  const today = new Date();
  const thisDate = today.getDate();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const daysInWeek: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const { data, setData } = useData({
    month: thisMonth,
    year: thisYear,
  });

  const calendar = useMemo(() => {
    let desktop: ScheduledPub[] = [];
    let mobile: ScheduledPub[] = [];

    const daysInLastMonth = new Date(data.year, data.month - 1, 0).getDate();
    const firstDay = new Date(data.year, data.month).getDay();
    const daysInCurrMonth = 32 - new Date(data.year, data.month, 32).getDate();
    const dummy = "Employee Wages Statistics (Formal Sector) Report";
    for (let i = firstDay; i >= 0; i--) {
      desktop.push({
        day: daysInLastMonth - i,
        month: data.month - 1,
        year: data.year,
        pubs: [dummy],
      });
    }
    for (let i = 1; i <= daysInCurrMonth; i++) {
      const pub: ScheduledPub = {
        day: i,
        month: data.month,
        year: data.year,
        pubs: [dummy, dummy],
      };
      desktop.push(pub);
      mobile.push(pub);
    }
    for (let i = 1; i < 7; i++) {
      if (desktop.length % 7 === 0) break;
      desktop.push({
        day: i,
        month: data.month + 1,
        year: data.year,
        pubs: [dummy, dummy, dummy],
      });
    }

    return { desktop: chunk(desktop, 7), mobile };
  }, [data.month]);

  return (
    <Container className="min-h-screen">
      <Section>
        <Tabs className="pb-8" title={<h4>{t("upcoming_publications")}</h4>}>
          <Panel name={t("calendar_view")} key={"calendar_view"}>
            <div className="flex items-center justify-between gap-1.5 pb-3 max-lg:flex-col">
              <h5>
                {new Date(data.year, data.month).toLocaleString(i18n.language, {
                  month: "long",
                  year: "numeric",
                })}
              </h5>
              <div className="flex items-center gap-1.5">
                <Button
                  className="btn-default btn-disabled"
                  onClick={() => {
                    setData("month", data.month - 1);
                    if (data.month === 0) {
                      setData("month", 11);
                      setData("year", data.year - 1);
                    }
                  }}
                  disabled={data.year === thisYear && data.month === thisMonth}
                >
                  <ChevronLeftIcon className="h-4.5 w-4.5" />
                </Button>
                <Button
                  className="btn-primary w-[100px] justify-center whitespace-nowrap shadow-button"
                  onClick={() => {
                    setData("month", thisMonth);
                    setData("year", thisYear);
                    setTimeout(() => {
                      if (size.width >= BREAKPOINTS.LG)
                        desktopRef.current[`${thisDate}_${thisMonth}_${thisYear}`]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                          inline: "end",
                        });
                      else
                        mobileRef.current[`${thisDate}_${thisMonth}_${thisYear}`]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                          inline: "end",
                        });
                    }, 1);
                  }}
                >
                  {t("today")}
                </Button>
                <Button
                  className="btn-default btn-disabled"
                  onClick={() => {
                    setData("month", data.month + 1);
                    if (data.month === 11) {
                      setData("month", 0);
                      setData("year", data.year + 1);
                    }
                  }}
                  disabled={data.year === thisYear + 1 && data.month === 11}
                >
                  <ChevronRightIcon className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
            <div className="hidden w-full rounded-lg border dark:border-washed-dark lg:flex">
              <table className="w-full table-fixed divide-y dark:divide-washed-dark">
                <thead>
                  <tr className="divide-x dark:divide-washed-dark">
                    {daysInWeek.map(day => {
                      return (
                        <th
                          key={day}
                          className="select-none px-3 py-2 font-normal text-black dark:text-white"
                        >
                          {t(`${day}`)}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-washed-dark">
                  {calendar.desktop.map((week, i) => (
                    <tr key={i} className="divide-x dark:divide-washed-dark">
                      {week.map(date => (
                        <td
                          key={`${date.day}_${date.month}`}
                          ref={ref => {
                            if (date.month === thisMonth && date.day === thisDate) {
                              desktopRef.current[`${date.day}_${date.month}_${date.year}`] = ref;
                            }
                          }}
                          className={clx(
                            "min-w-[150px] px-3 py-2 lg:h-32",
                            date.month !== data.month && "bg-background dark:bg-black",
                            date.month === thisMonth && date.day === thisDate && "bg-primary/5"
                          )}
                        >
                          <div className="flex h-full flex-col justify-start gap-1.5">
                            <div className="relative flex items-center justify-between">
                              <div className="text-primary dark:text-primary-dark">
                                {date.year === thisYear &&
                                  date.month === thisMonth &&
                                  date.day === thisDate &&
                                  t("today")}
                              </div>
                              <span
                                className={clx(
                                  date.month !== data.month
                                    ? "text-dim"
                                    : "text-black dark:text-white",
                                  date.year === thisYear &&
                                    date.month === thisMonth &&
                                    date.day === thisDate &&
                                    "absolute right-0 top-0 h-6 rounded-full bg-primary px-2 text-white dark:bg-primary-dark"
                                )}
                              >
                                {date.day}{" "}
                                {date.day === 1 &&
                                  new Date(data.year, date.month).toLocaleString(i18n.language, {
                                    month: "short",
                                  })}
                              </span>
                            </div>
                            {date.pubs &&
                              date.pubs.map(pub => (
                                <div className="h-6 w-full truncate rounded bg-primary/20 px-1.5 py-1 text-xs text-black dark:text-white">
                                  {pub}
                                </div>
                              ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-3 md:max-lg:grid-cols-2 lg:hidden">
              {calendar.mobile.map(date => (
                <div
                  key={`${date.day}_${date.month}`}
                  ref={ref => {
                    if (date.month === thisMonth && date.day === thisDate) {
                      mobileRef.current[`${date.day}_${date.month}_${date.year}`] = ref;
                    }
                  }}
                  className={clx(
                    "h-32 min-w-[150px] rounded-xl border border-outline px-3 py-2 dark:border-washed-dark",
                    date.year === thisYear &&
                      date.month === thisMonth &&
                      date.day === thisDate &&
                      "bg-primary/5"
                  )}
                >
                  <div className="flex h-full flex-col justify-start gap-1.5">
                    <div className="relative flex items-center justify-between">
                      <div className="text-primary dark:text-primary-dark">
                        {date.year === thisYear &&
                          date.month === thisMonth &&
                          date.day === thisDate &&
                          t("today")}
                      </div>
                      <span
                        className={clx(
                          "text-black dark:text-white",
                          date.year === thisYear &&
                            date.month === thisMonth &&
                            date.day === thisDate &&
                            "absolute right-0 top-0 h-6 rounded-full bg-primary px-2 text-white dark:bg-primary-dark"
                        )}
                      >
                        {date.day}
                      </span>
                    </div>
                    {date.pubs &&
                      date.pubs.map((pub, i) => (
                        <div
                          key={i}
                          className="h-6 w-full truncate rounded bg-primary/20 px-1.5 py-1 text-xs text-black dark:text-white"
                        >
                          {pub}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel name={t("list_view")} key={"list_view"}></Panel>
        </Tabs>
      </Section>
    </Container>
  );
};

export default UpcomingPublicationsDashboard;
