import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { ArrowUpRightIcon, ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { routes } from "@lib/routes";
import {
  At,
  AgencyBadge,
  Button,
  Card,
  Container,
  Dropdown,
  Hero,
  Search,
  Section,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { isValidURL, numFormat } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { AgencyIcon } from "datagovmy-ui/icons/agency";
import { Agency, OptionType, WithData } from "datagovmy-ui/types";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";

/**
 * Dashboard Index
 * @overview Status: Live
 */

type Dashboard = {
  last_updated: string;
  agency: Agency;
  name: string;
  route: string;
};

type View = {
  id: string;
  type: "dashboard";
  total_views: number;
};

interface DashboardIndexProps {
  dropdown: string[];
  dashboards: WithData<Dashboard[]>;
}

const DashboardIndex: FunctionComponent<DashboardIndexProps> = ({ dropdown, dashboards }) => {
  const { t, i18n } = useTranslation(["dashboards", "agencies"]);
  const [views, setViews] = useState<View[]>([]);

  const { data, setData } = useData({
    agency: "",
    search: "",
    tabs: 0,
  });

  // for ALL dashboards
  const _collection = useMemo<Dashboard[]>(() => {
    const filterByName = (dashboard: Dashboard, searchTerm: string) => {
      return (
        !searchTerm ||
        t(`dashboards.${dashboard.name}.name`).toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    // Datagovmy dashboard index with agency filter
    if (data.agency) {
      return dashboards.data.filter(d => d.agency === data.agency && filterByName(d, data.search));
    }

    return dashboards.data.filter(d => filterByName(d, data.search));
  }, [data.search, data.agency]);

  const tabs_data = useMemo<
    Record<"thematic" | "most_popular" | "recent_updated", Dashboard[]>
  >(() => {
    const thematic = _collection;

    const recent_updated = [..._collection].sort(
      (a, b) =>
        DateTime.fromSQL(b.last_updated).toMillis() - DateTime.fromSQL(a.last_updated).toMillis()
    );

    const most_popular = [..._collection].sort(
      (a, b) =>
        (views.find(view => view.id === `dashboard-${b.name}`)?.total_views ?? 0) -
        (views.find(view => view.id === `dashboard-${a.name}`)?.total_views ?? 0)
    );

    return {
      thematic,
      most_popular,
      recent_updated,
    };
  }, [_collection, views]);

  const PANELS = [
    {
      name: t("tabs.thematic"),
      data: tabs_data.thematic,
    },
    {
      name: t("tabs.most_popular"),
      data: tabs_data.most_popular,
    },
    {
      name: t("tabs.recent_updated"),
      data: tabs_data.recent_updated,
    },
  ];

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/pipes/dgmy_total_views_by_id.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`,
            },
          }
        );
        const { data } = await response.json();
        setViews(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchViews();
  }, []);

  console.log(data.tabs);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:home.category"), "text-primary dark:text-primary-dark"]}
        header={[
          `${data.agency ? t(`agencies:${data.agency}.abbr`).concat(":") : ""} ${t("header")}`,
        ]}
        description={[
          t("description", {
            agency: t(`agencies:${data.agency}.abbr`),
            context: data.agency ? "agency" : "",
          }),
        ]}
        // action={
        //   <At
        //     href={routes.DATA_GPT}
        //     className="text-primary group flex items-center gap-2 text-sm font-medium"
        //   >
        //     <SparklesIcon className="h-5 w-5" />
        //     <span className="group-hover:underline">{t("common:components.try_datagpt")}</span>
        //   </At>
        // }
        agencyBadge={<AgencyBadge agency={data.agency || "govt"} />}
      />
      <DashboardFilter
        data={{ search: data.search, agency: data.agency }}
        dropdown={dropdown}
        onSearch={value => setData("search", value)}
        onChangeAgency={value => setData("agency", value)}
      />
      <Container className="min-h-screen">
        <Section
          title={
            <>
              <h4>{t("section2_title")}</h4>
              <Tabs.List
                options={PANELS.map(item => item.name)}
                current={data.tabs}
                onChange={index => setData("tabs", index)}
              />
            </>
          }
        >
          <Tabs hidden current={data.tabs} onChange={index => setData("tabs", index)}>
            {PANELS.map((panel, index) => (
              <Tabs.Panel name={panel.name} key={index}>
                <Ranking ranks={panel.data} views={views} tabs={data.tabs} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Section>
      </Container>
    </>
  );
};

/**
 * Dashboard Filter Component
 */

interface DashboardFilterProps {
  data: {
    search: string;
    agency: string;
  };
  dropdown: string[];
  onSearch: (value: string) => void;
  onChangeAgency: (value: string) => void;
}

const DashboardFilter: FunctionComponent<DashboardFilterProps> = ({
  data,
  onSearch,
  dropdown,
  onChangeAgency,
}) => {
  const { t } = useTranslation(["dashboards", "agencies", "common"]);
  const reset = () => onSearch("");

  const filterSources: OptionType[] = dropdown.map(source => ({
    label: t(`agencies:${source}.abbr`),
    value: source,
  }));

  return (
    <div className="dark:border-washed-dark sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 lg:pl-2 dark:bg-black">
      <Container>
        <div className="flex flex-row items-center gap-x-3">
          <Dropdown
            icon={<BuildingLibraryIcon className="text-dim h-4 w-4" />}
            width="w-fit"
            placeholder={t("source_placeholder")}
            anchor="left"
            options={filterSources}
            selected={filterSources.find(item => data.agency === item.value)}
            onChange={(e?: OptionType) => {
              if (e) onChangeAgency(e.value);
              else onChangeAgency("");
            }}
            enableSearch
            enableClear
          />
          <Search
            className="w-full border-0"
            placeholder={t("search_placeholder")}
            query={data.search}
            onChange={e => typeof e === "string" && onSearch(e)}
          />
          {data.search && (
            <Button
              className="btn-ghost text-dim max-md:rounded-full max-md:p-2"
              icon={<XMarkIcon className="h-4 w-4" />}
              onClick={reset}
            >
              <p className="hidden md:block">{t("common:common.clear")}</p>
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

DashboardFilter.displayName = "DashboardFilter";

interface RankingProps {
  ranks: Dashboard[];
  views: View[];
  tabs: number;
}

const Ranking = ({ ranks, views, tabs }: RankingProps) => {
  const { t, i18n } = useTranslation("dashboards");

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {ranks.map((item, i) => (
          <At
            href={item.route}
            locale={i18n.language}
            prefetch={false}
            external={isValidURL(item.route)}
          >
            <div className="border-outline hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50 group flex h-full w-full flex-col space-y-3 rounded-xl border p-6 transition-colors">
              <div className="relative flex items-center gap-3">
                <AgencyIcon
                  agency={item.agency}
                  className="h-6 w-6"
                  fillColor={
                    item.name === "covid-vaccination"
                      ? AKSARA_COLOR.GREEN
                      : item.name === "drug-addiction"
                        ? AKSARA_COLOR.DANGER
                        : undefined
                  }
                />
                <p className="text-dim text-sm font-medium">{t(`agencies:${item.agency}.abbr`)}</p>
                <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-100 transition-transform group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transform-none lg:opacity-0" />
              </div>
              <div className="flex grow flex-col items-start gap-3 overflow-hidden">
                <div className="grow space-y-3">
                  <p
                    className="flex items-center gap-1 truncate text-lg font-bold dark:text-white"
                    title={item.name}
                  >
                    {t(`dashboards.${item.name}.name`)}
                    {isValidURL(item.route) && (
                      <ArrowTopRightOnSquareIcon className="inline-block h-4 w-4" />
                    )}
                  </p>
                  <p className="text-sm dark:text-white" title={item.name}>
                    {t(`dashboards.${item.name}.description`)}
                  </p>
                </div>
                <div className="relative flex w-full items-center gap-1">
                  <p className="text-dim h-6 transition-transform group-hover:translate-y-6">
                    {`${numFormat(
                      views.find(e => e.id === `dashboard-${item.name}`)?.total_views ?? 0,
                      "compact"
                    )} ${t("common:common.views", {
                      count: views.find(e => e.id === `dashboard-${item.name}`)?.total_views ?? 0,
                    })}`}
                  </p>
                  {tabs === 2 && (
                    <>
                      <div className="bg-dim h-1 w-1 rounded-full px-0.5 transition-transform group-hover:translate-y-6" />
                      <p className="text-dim h-6 transition-transform group-hover:translate-y-6">
                        {t("common:common.last_updated", {
                          date: DateTime.fromSQL(item.last_updated).toFormat("dd MMM yyyy"),
                        })}
                      </p>
                    </>
                  )}
                  <p className="text-primary dark:text-primary-dark absolute -bottom-6 transition-transform group-hover:-translate-y-6 motion-reduce:transform-none">
                    {t("common:components.click_to_explore")}
                  </p>
                </div>
              </div>
            </div>
          </At>
        ))}
      </div>
    </>
  );
};

export default DashboardIndex;
