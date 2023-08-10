import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button, Container, Panel, Section, Tabs } from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import chunk from "lodash/chunk";
import { FunctionComponent, useMemo } from "react";
/**
 * Upcoming Publications
 * @overview Status: In-development
 */

interface UpcomingPublicationsProps {}

type ScheduledPub = {
  day: number;
  month: number;
  pubs: string[];
};

const UpcomingPublicationsDashboard: FunctionComponent<UpcomingPublicationsProps> = ({}) => {
  const { t, i18n } = useTranslation(["publications", "common"]);

  const TABS: OptionType[] = [
    { label: t("absolute"), value: "abs" },
    { label: t("relative"), value: "relative" },
  ];

  const today = new Date();
  const thisDate = today.getDate();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const { data, setData } = useData({
    tab_index: 0,
    month: thisMonth,
    year: thisYear,
  });

  const getCalendar = useMemo(() => {
    let calendar: ScheduledPub[] = [];
    const currMonth: number = data.month;
    const currYear: number = data.year;
    const daysInLastMonth = new Date(currYear, currMonth - 1, 0).getDate();
    const firstDay = new Date(currYear, currMonth).getDay();
    const daysInCurrMonth = 32 - new Date(currYear, currMonth, 32).getDate();
    const dummy = "Employee Wages Statistics (Formal Sector) Report";
    for (let i = firstDay; i >= 0; i--) {
      calendar.push({
        day: daysInLastMonth - i,
        month: currMonth - 1,
        pubs: [dummy],
      });
    }
    for (let i = 1; i <= daysInCurrMonth; i++) {
      calendar.push({
        day: i,
        month: currMonth,
        pubs: [dummy, dummy],
      });
    }
    if (calendar.length % 7 !== 0) {
      for (let i = 1; i < 7; i++) {
        if (calendar.length % 7 === 0) return calendar;
        calendar.push({
          day: i,
          month: currMonth + 1,
          pubs: [dummy, dummy, dummy],
        });
      }
    }
    return calendar;
  }, [data.month]);

  const calendar = chunk(getCalendar, 7);
  const daysInWeek: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  return (
    <Container className="min-h-screen">
      <Section>
        <Tabs className="pb-8" title={<h4>{t("upcoming_publications")}</h4>}>
          <Panel name={t("calendar_view")} key={"calendar_view"}>
            <div className="flex items-center justify-between pb-3">
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
                <Button className="btn-primary w-[100px] justify-center shadow-button">
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
            <div className="w-full rounded-lg border dark:border-washed-dark">
              <div className="overflow-x-auto">
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
                    {calendar.map(week => (
                      <tr className="divide-x dark:divide-washed-dark">
                        {week.map(i => (
                          <td
                            className={clx(
                              "min-w-[150px] px-3 py-2 lg:h-32",
                              i.month !== data.month && "bg-background dark:bg-black",
                              i.month === thisMonth && i.day === thisDate && "bg-primary/5"
                            )}
                          >
                            <div className="flex h-full flex-col justify-start gap-1.5">
                              <div className="relative flex items-center justify-between">
                                <div className="text-primary dark:text-primary-dark">
                                  {i.month === thisMonth && i.day === thisDate && t("today")}
                                </div>
                                <span
                                  className={clx(
                                    i.month !== data.month
                                      ? "text-dim"
                                      : "text-black dark:text-white",
                                    i.month === thisMonth &&
                                      i.day === thisDate &&
                                      "w- absolute right-0 top-0 h-6 rounded-full bg-primary px-2 text-white dark:bg-primary-dark"
                                  )}
                                >
                                  {i.day}{" "}
                                  {i.day === 1 &&
                                    new Date(data.year, i.month).toLocaleString(i18n.language, {
                                      month: "short",
                                    })}
                                </span>
                              </div>
                              {i.pubs &&
                                i.pubs.map(pub => (
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
            </div>
          </Panel>
          <Panel name={t("list_view")} key={"list_view"}></Panel>
        </Tabs>
      </Section>
    </Container>
  );
};

export default UpcomingPublicationsDashboard;
