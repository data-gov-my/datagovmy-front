import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { TableConfig } from "datagovmy-ui/charts/table";
import {
  Button,
  ComboBox,
  Container,
  Panel,
  Section,
  Spinner,
  Tabs,
  Tooltip,
} from "datagovmy-ui/components";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useData, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import chunk from "lodash/chunk";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useContext, useEffect, useMemo, useRef } from "react";

/**
 * Upcoming Publications
 * @overview Status: In-development
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), {
  ssr: false,
});

export type UpcomingPublication = {
  publication_id: string;
  publication_title: string;
  product_type: string;
  publication_type: string;
  publication_type_title: string;
  release_date: string;
  release_series: string;
};

interface UpcomingPublicationsProps {
  cal_pubs: Record<string, string[]>;
  dropdown: Array<{ publication_type: string; publication_type_title: string }>;
  list_pubs: UpcomingPublication[];
  params: any;
  query: any;
  total_pubs: number;
}

type ScheduledPub = {
  day: number;
  month: number;
  date: string;
};

const UpcomingPublicationsDashboard: FunctionComponent<UpcomingPublicationsProps> = ({
  cal_pubs,
  dropdown,
  list_pubs,
  params,
  query,
  total_pubs,
}) => {
  const { t, i18n } = useTranslation(["publications", "common"]);
  const desktopRef = useRef<Record<string, HTMLElement | null>>({});
  const mobileRef = useRef<Record<string, HTMLElement | null>>({});
  const { events } = useRouter();
  const { size } = useContext(WindowContext);

  const ITEMS_PER_PAGE = 15;
  const PUBLICATION_OPTIONS: OptionType[] = dropdown.map(e => ({
    label: e.publication_type_title,
    value: e.publication_type,
  }));

  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const thisMonth = today.getMonth(); // 0 - 11
  const thisYear = today.getFullYear();
  const daysInWeek: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const getMonthAndYear = (isoDate: string): [month: number, year: number] => {
    const dates = isoDate.split("-");
    let month: number = +dates[1];
    let year: number = +dates[0];

    if (+dates[1] === 12 && +dates[2] > 20) year += 1;
    if (+dates[2] > 20) month += 1;

    return [year, month - 1];
  };

  const { data, setData } = useData({
    loading: false,
    scrollToToday: false,
    publication_option: "",
    tab_index: params.tab_index,
    month: query.start ? getMonthAndYear(query.start)[1] : thisMonth,
    year: query.start ? getMonthAndYear(query.start)[0] : thisYear,
  });

  const { filter, setFilter } = useFilter({
    start: query.start ?? "",
    end: query.end ?? "",
    page: query.page ?? "",
    pub_type: query.pub_type
      ? PUBLICATION_OPTIONS.find(item => item.value === query.pub_type)?.value
      : undefined,
  });

  const pubs = new Map<string, string[]>(Object.entries(cal_pubs));

  const calendar = useMemo(() => {
    let desktop: ScheduledPub[] = [];
    let mobile: ScheduledPub[] = [];

    const daysInLastMonth = new Date(data.year, data.month, 0).getDate();
    const firstDay = new Date(data.year, data.month).getDay();
    const daysInCurrMonth = new Date(data.year, data.month + 1, 0).getDate();
    const totalModuloSeven = (firstDay + daysInCurrMonth) % 7;
    const remaining = totalModuloSeven === 0 ? 0 : 7 - totalModuloSeven;

    const toDate = (date: Date): string => {
      return date.toISOString().split("T")[0];
    };

    setFilter("start", toDate(new Date(data.year, data.month, -firstDay + 1, 8, 0, 0)));
    setFilter("end", toDate(new Date(data.year, data.month + 1, remaining, 8, 0, 0)));

    for (let i = firstDay - 1; i >= 0; i--) {
      const date = toDate(new Date(data.year, data.month - 1, daysInLastMonth - i, 8, 0, 0));
      desktop.push({
        date: date,
        day: daysInLastMonth - i,
        month: data.month - 1,
      });
    }
    for (let i = 1; i <= daysInCurrMonth; i++) {
      const date = toDate(new Date(data.year, data.month, i, 8, 0, 0));
      const pub: ScheduledPub = {
        date: date,
        day: i,
        month: data.month,
      };
      desktop.push(pub);
      mobile.push(pub);
    }
    for (let i = 1; i < 7; i++) {
      if (desktop.length % 7 === 0) break;
      const date = toDate(new Date(data.year, data.month + 1, i, 8, 0, 0));
      desktop.push({
        date: date,
        day: i,
        month: data.month + 1,
      });
    }

    return { desktop: chunk(desktop, 7), mobile };
  }, [data.month, i18n.language]);

  const config: TableConfig[] = [
    {
      accessorKey: "publication_title",
      id: "title",
      header: t("table.title"),
      enableSorting: false,
      className: "max-sm:max-w-[300px]",
    },
    {
      accessorKey: "publication_type_title",
      id: "publication_type",
      header: t("table.publication_type"),
      enableSorting: false,
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
      enableSorting: false,
      cell: ({ getValue }) => {
        return <>{toDate(getValue(), "dd MMM yyyy", i18n.language)}</>;
      },
    },
  ];

  const scrollToToday = () => {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: "smooth",
      block: "center",
      inline: "end",
    };
    if (size.width >= BREAKPOINTS.LG) desktopRef.current[todayISO]?.scrollIntoView(scrollOptions);
    else mobileRef.current[todayISO]?.scrollIntoView(scrollOptions);
  };

  useEffect(() => {
    if (data.scrollToToday)
      setTimeout(() => {
        if (data.month === thisMonth && data.year === thisYear) {
          scrollToToday();
          setData("scrollToToday", false);
        }
      }, 1000);
  }, [data.scrollToToday]);

  useEffect(() => {
    events.on("routeChangeComplete", () => setData("loading", false));
    return () => {
      events.off("routeChangeComplete", () => setData("loading", false));
    };
  }, []);

  return (
    <Container className="min-h-screen">
      <Section>
        <Tabs
          className="pb-8"
          title={<h4>{t("upcoming_publications")}</h4>}
          onChange={(index: number) => {
            setData("tab_index", index);
            if (index === 1) {
              setFilter("start", undefined);
              setFilter("end", undefined);
              setFilter("page", query.page ?? "1");
            } else {
              setFilter("page", undefined);
              setFilter("pub_type", undefined);
              setData("publication_option", undefined);
            }
          }}
          current={data.tab_index}
        >
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
                  variant="default"
                  className="btn-disabled"
                  onClick={() => {
                    setData("loading", true);
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
                  variant="primary"
                  className="shadow-button"
                  onClick={() => {
                    if (data.month !== thisMonth) {
                      setData("loading", true);
                      setData("scrollToToday", true);
                    } else {
                      scrollToToday();
                    }
                    setData("month", thisMonth);
                    setData("year", thisYear);
                  }}
                >
                  {t("today")}
                </Button>
                <Button
                  variant="default"
                  className="btn-disabled"
                  onClick={() => {
                    setData("loading", true);
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
            {data.loading ? (
              <div className="flex h-[600px] w-full items-center justify-center">
                <Spinner loading={data.loading} />
              </div>
            ) : (
              <>
                <div className="hidden w-full rounded-lg border dark:border-washed-dark lg:flex">
                  <table className="w-full table-fixed divide-y dark:divide-washed-dark">
                    <thead>
                      <tr className="divide-x divide-outline dark:divide-washed-dark">
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
                        <tr key={i} className="divide-x divide-outline dark:divide-washed-dark">
                          {week.map(d => {
                            const isToday = todayISO === d.date;
                            const notThisMonth = d.month !== data.month;
                            const id = `${d.date}_${i18n.language}`;

                            return (
                              <td
                                key={d.date}
                                ref={ref => {
                                  if (isToday) {
                                    desktopRef.current[d.date] = ref;
                                  }
                                }}
                                className={clx(
                                  "relative h-max min-h-[128px] min-w-[150px] px-3 pb-2 pt-[38px] align-top",
                                  notThisMonth && "bg-background dark:bg-black",
                                  isToday && "bg-primary/5"
                                )}
                              >
                                <div className="flex h-full flex-col justify-start">
                                  <div className="absolute left-3 top-2 text-primary dark:text-primary-dark">
                                    {isToday && t("today")}
                                  </div>
                                  <span
                                    className={clx(
                                      "absolute right-3 top-2",
                                      notThisMonth ? "text-dim" : "text-black dark:text-white",
                                      isToday &&
                                        "h-6 rounded-full bg-primary px-2 text-white dark:bg-primary-dark"
                                    )}
                                  >
                                    {d.day}{" "}
                                    {d.day === 1 &&
                                      new Date(data.year, d.month).toLocaleString(i18n.language, {
                                        month: "short",
                                      })}
                                  </span>

                                  <div className="flex h-full flex-col justify-start gap-1.5">
                                    {pubs.has(id) &&
                                      pubs.get(id).map((pub, i) => (
                                        <Tooltip key={`desktop_${pub}_${d.date}_${i}`} tip={pub}>
                                          {() => (
                                            <p className="h-6 w-full truncate rounded bg-primary/20 px-1.5 py-1 text-xs text-black dark:text-white">
                                              {pub}
                                            </p>
                                          )}
                                        </Tooltip>
                                      ))}
                                  </div>
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
                  {calendar.mobile.map(d => {
                    const isToday = todayISO === d.date;
                    const id = `${d.date}_${i18n.language}`;
                    if (!pubs.has(id)) return;
                    return (
                      <div
                        key={d.date}
                        ref={ref => {
                          if (isToday) {
                            mobileRef.current[d.date] = ref;
                          }
                        }}
                        className={clx(
                          "flex min-h-[32px] min-w-[150px] flex-col rounded-xl border border-outline px-3 py-2 dark:border-washed-dark",
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
                              {d.day}
                            </span>
                          </div>
                          {pubs.has(id) &&
                            pubs.get(id).map((pub, i) => (
                              <Tooltip tip={pub} key={`mobile_${pub}_${d.date}_${i}`}>
                                {open => (
                                  <div
                                    className="h-6 w-full cursor-help truncate rounded bg-primary/20 px-1.5 py-1 text-xs text-black dark:text-white"
                                    onClick={open}
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
              </>
            )}
          </Panel>
          <Panel name={t("list_view")} key={"list_view"}>
            <div className="mx-auto w-full pb-8 sm:w-[500px]">
              <ComboBox
                placeholder={t("select_publication")}
                options={PUBLICATION_OPTIONS}
                selected={
                  data.publication_option
                    ? PUBLICATION_OPTIONS.find(e => e.value === data.publication_option)
                    : null
                }
                onChange={selected => {
                  if (selected) {
                    setData("loading", true);
                    setFilter("pub_type", selected.value);
                    setFilter("page", "1");
                    setData("publication_option", selected.value);
                  } else {
                    setFilter("pub_type", null);
                    setData("publication_option", null);
                  }
                }}
              />
            </div>
            {data.loading ? (
              <div className="flex h-[657px] w-full items-center justify-center">
                <Spinner loading={data.loading} />
              </div>
            ) : list_pubs.length === 0 ? (
              <p className="flex h-[300px] w-full items-center justify-center text-dim">
                {t("common:common.no_entries")}.
              </p>
            ) : (
              <Table className="md:w-full" data={list_pubs} config={config} />
            )}

            {total_pubs > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-center gap-4 pt-8 text-sm font-medium">
                <Button
                  variant="default"
                  className="btn-disabled"
                  onClick={() => {
                    setData("loading", true);
                    setFilter("page", `${+filter.page - 1}`);
                  }}
                  disabled={filter.page === "1"}
                >
                  <ChevronLeftIcon className="h-4.5 w-4.5" />
                  {t("common:common.previous")}
                </Button>

                <span className="flex items-center gap-1 text-center">
                  {t("common:common.page_of", {
                    current: filter.page,
                    total: Math.ceil(total_pubs / ITEMS_PER_PAGE),
                  })}
                </span>
                <Button
                  variant="default"
                  className="btn-disabled"
                  onClick={() => {
                    setData("loading", true);
                    setFilter("page", `${+filter.page + 1}`);
                  }}
                  disabled={filter.page === `${Math.ceil(total_pubs / ITEMS_PER_PAGE)}`}
                >
                  {t("common:common.next")}
                  <ChevronRightIcon className="h-4.5 w-4.5" />
                </Button>
              </div>
            )}
          </Panel>
        </Tabs>
      </Section>
    </Container>
  );
};

export default UpcomingPublicationsDashboard;
