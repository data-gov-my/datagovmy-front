import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { get } from "datagovmy-ui/api";
import { TableConfig } from "datagovmy-ui/charts/table";
import { Button, Container, Panel, Section, Tabs, Tooltip, toast } from "datagovmy-ui/components";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useCache, useData, useTranslation } from "datagovmy-ui/hooks";
import chunk from "lodash/chunk";
import dynamic from "next/dynamic";
import { FunctionComponent, useContext, useMemo, useRef } from "react";

/**
 * Upcoming Publications
 * @overview Status: In-development
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), {
  ssr: false,
});

type UpcomingPublication = {
  publication_id: string;
  publication_title: string;
  product_type: string;
  release_date: string;
  release_series: string;
};

interface UpcomingPublicationsProps {
  publications: UpcomingPublication[];
}

type ScheduledPub = {
  day: number;
  month: number;
  year: number;
  pubs: string[];
};

const UpcomingPublicationsDashboard: FunctionComponent<UpcomingPublicationsProps> = ({
  publications,
}) => {
  const { t, i18n } = useTranslation(["publications", "common"]);
  const { cache } = useCache();
  const desktopRef = useRef<Record<string, HTMLElement | null>>({});
  const mobileRef = useRef<Record<string, HTMLElement | null>>({});
  const { size } = useContext(WindowContext);

  const today = new Date();
  const thisDate = today.getDate();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const daysInWeek: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const { data, setData } = useData({
    pubs: publications,
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
      const date = `${data.year}-${data.month}-${i.toString().padStart(2, "0")}`;
      console.log(date);
      const pub: ScheduledPub = {
        day: i,
        month: data.month,
        year: data.year,
        pubs: [dummy],
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

  const fetchUpcoming = async (l: string): Promise<UpcomingPublication[]> => {
    const identifier = `${l}_${i18n.language}`;
    return new Promise(resolve => {
      if (cache.has(identifier)) return resolve(cache.get(identifier));
      get(`/pub-upcoming/${l}`, {
        language: i18n.language,
      })
        .then(({ data }: { data: UpcomingPublication[] }) => {
          cache.set(identifier, data);
          resolve(data);
        })
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    });
  };

  const config: TableConfig[] = [
    {
      accessorKey: "publication_title",
      id: "title",
      header: t("table.title"),
      enableSorting: false,
      className: "max-sm:max-w-[300px]",
    },
    {
      accessorKey: "product_type",
      id: "product_type",
      header: t("table.product_type"),
      enableSorting: false,
    },
    {
      accessorKey: "release_series",
      id: "release_series",
      header: t("table.release_series"),
      enableSorting: false,
    },
    {
      accessorKey: "release_date",
      id: "release_date",
      header: t("table.release_date"),
      cell: ({ getValue }) => {
        return <>{toDate(getValue(), "dd MMM yyyy", i18n.language)}</>;
      },
    },
  ];

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
                      const today = `${thisYear}-${thisMonth}-${thisDate}`;
                      if (size.width >= BREAKPOINTS.LG)
                        desktopRef.current[today]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                          inline: "end",
                        });
                      else
                        mobileRef.current[today]?.scrollIntoView({
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
                      {week.map(date => {
                        const today = `${date.year}-${date.month}-${date.day}`;
                        const isToday = `${thisYear}-${thisMonth}-${thisDate}` === today;
                        const notThisMonth = date.month !== data.month;
                        return (
                          <td
                            key={today}
                            ref={ref => {
                              if (isToday) {
                                desktopRef.current[today] = ref;
                              }
                            }}
                            className={clx(
                              "min-w-[150px] px-3 py-2 lg:h-32",
                              notThisMonth && "bg-background dark:bg-black",
                              isToday && "bg-primary/5"
                            )}
                          >
                            <div className="flex h-full flex-col justify-start gap-1.5">
                              <div className="relative flex items-center justify-between">
                                <div className="text-primary dark:text-primary-dark">
                                  {isToday && t("today")}
                                </div>
                                <span
                                  className={clx(
                                    notThisMonth ? "text-dim" : "text-black dark:text-white",
                                    isToday &&
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
                                  <Tooltip tip={pub}>
                                    {() => (
                                      <div
                                        key={i}
                                        className="h-6 w-full cursor-help truncate rounded bg-primary/20 px-1.5 py-1 text-xs text-black dark:text-white"
                                      >
                                        {pub}
                                      </div>
                                    )}
                                  </Tooltip>
                                ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-3 md:max-lg:grid-cols-2 lg:hidden">
              {calendar.mobile.map(date => {
                const today = `${date.year}-${date.month}-${date.day}`;
                const isToday = `${thisYear}-${thisMonth}-${thisDate}` === today;
                return (
                  <div
                    key={today}
                    ref={ref => {
                      if (isToday) {
                        mobileRef.current[today] = ref;
                      }
                    }}
                    className={clx(
                      "h-32 min-w-[150px] rounded-xl border border-outline px-3 py-2 dark:border-washed-dark",
                      isToday && "bg-primary/5"
                    )}
                  >
                    <div className="flex h-full flex-col justify-start gap-1.5">
                      <div className="relative flex items-center justify-between">
                        <div className="text-primary dark:text-primary-dark">
                          {isToday && t("today")}
                        </div>
                        <span
                          className={clx(
                            "text-black dark:text-white",
                            isToday &&
                              "absolute right-0 top-0 h-6 rounded-full bg-primary px-2 text-white dark:bg-primary-dark"
                          )}
                        >
                          {date.day}
                        </span>
                      </div>
                      {date.pubs &&
                        date.pubs.map((pub, i) => (
                          <Tooltip tip={pub}>
                            {() => (
                              <div
                                key={i}
                                className="h-6 w-full cursor-help truncate rounded bg-primary/20 px-1.5 py-1 text-xs text-black dark:text-white"
                              >
                                {pub}
                              </div>
                            )}
                          </Tooltip>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
          <Panel name={t("list_view")} key={"list_view"}>
            <Table
              className="md:w-full"
              data={publications}
              enablePagination={publications.length > 15 ? 15 : false}
              config={config}
            />
          </Panel>
        </Tabs>
      </Section>
    </Container>
  );
};

export default UpcomingPublicationsDashboard;
