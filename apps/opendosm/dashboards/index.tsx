import { ArrowTopRightOnSquareIcon, ArrowUpRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import DivisionIcon, { Division } from "@icons/division";
import {
  AgencyBadge,
  At,
  Button,
  Container,
  Hero,
  Section,
  Search,
  Tabs,
} from "datagovmy-ui/components";
import { isValidURL, numFormat } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { WithData } from "datagovmy-ui/types";
import { DateTime } from "luxon";
import { FunctionComponent, useEffect, useMemo, useState } from "react";

/**
 * Dashboard Index
 * @overview Status: Live
 */

type Dashboard = {
  last_updated: string;
  agency: Division;
  name: string;
  route: string;
};

type View = {
  id: string;
  type: "dashboard";
  total_views: number;
};

interface DashboardIndexProps {
  dashboards: WithData<Dashboard[]>;
}

const DashboardIndex: FunctionComponent<DashboardIndexProps> = ({ dashboards }) => {
  const { t } = useTranslation(["dashboards", "opendosm-home", "agencies", "common"]);
  const [views, setViews] = useState<View[]>([]);

  const { data, setData } = useData({ search: "", tabs: 0 });

  // for ALL dashboards
  const _collection = useMemo<Dashboard[]>(() => {
    const filterByName = (dashboard: Dashboard, searchTerm: string) => {
      return (
        !searchTerm ||
        t(`dashboards.${dashboard.name}.name`).toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    return dashboards.data.filter(d => filterByName(d, data.search));
  }, [data.search, data.agency]);

  const tabs_data = useMemo<
    Record<"thematic" | "most_popular" | "recent_updated", Dashboard[]>
  >(() => {
    const thematic = _collection;

    const recent_updated = [..._collection].sort(
      (a, b) =>
        DateTime.fromISO(b.last_updated).toMillis() - DateTime.fromISO(a.last_updated).toMillis()
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

  return (
    <>
      <Hero
        background="gray"
        category={[t("opendosm-home:category"), "text-primary dark:text-primary-dark"]}
        header={[`DOSM: ${t("header")}`]}
        description={[t("description", { agency: t("agencies:dosm.abbr"), context: "agency" })]}
        agencyBadge={<AgencyBadge agency="dosm" />}
      />
      <DashboardFilter
        data={{ search: data.search }}
        onSearch={value => setData("search", value)}
      />
      <Container className="min-h-screen">
        <Section
          title={
            <>
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
  };
  onSearch: (value: string) => void;
}

const DashboardFilter: FunctionComponent<DashboardFilterProps> = ({ data, onSearch }) => {
  const { t } = useTranslation(["dashboards", "agencies", "common"]);
  const reset = () => onSearch("");

  return (
    <div className="sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:border-washed-dark dark:bg-black lg:pl-2">
      <Container>
        <div className="flex flex-row items-center gap-x-3">
          <Search
            className="w-full border-0"
            placeholder={t("search_placeholder")}
            query={data.search}
            onChange={e => typeof e === "string" && onSearch(e)}
          />
          {data.search && (
            <Button
              variant="ghost"
              className="max-md:rounded-full"
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
  const { t, i18n } = useTranslation(["dashboards", "agencies", "common", "division"]);

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
            <div className="group flex h-full w-full flex-col space-y-3 rounded-xl border border-outline p-6 transition-colors hover:border-outlineHover hover:bg-background motion-reduce:transition-none dark:border-washed-dark dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50">
              <div className="relative flex items-center gap-3">
                <DivisionIcon
                  division={item.agency}
                  className="h-6 w-6"
                  // fillColor={item.colour}
                />
                <p className="text-sm text-dim">{t(`division:${item.agency}.abbr`)}</p>
                <ArrowUpRightIcon className="absolute right-1 h-5 w-5 text-dim opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transition-none" />
              </div>
              <div className="flex grow flex-col items-start gap-3 overflow-hidden">
                <div className="grow space-y-3">
                  <p className="truncate text-lg font-bold dark:text-white" title={item.name}>
                    {t(`dashboards.${item.name}.name`)}
                    {isValidURL(item.route) && (
                      <ArrowTopRightOnSquareIcon className="inline-block h-4 w-4" />
                    )}
                  </p>
                  <p className="text-sm dark:text-white" title={item.name}>
                    {t(`dashboards.${item.name}.description`)}
                  </p>
                </div>
                <div className="relative w-full flex items-center gap-2">
                  <p className="h-6 text-dim transition-transform group-hover:translate-y-6">
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
                          date: DateTime.fromISO(item.last_updated).toFormat("dd MMM yyyy"),
                        })}
                      </p>
                    </>
                  )}
                  <p className="absolute -bottom-6 whitespace-nowrap text-primary transition-transform group-hover:-translate-y-6 dark:text-primary-dark">
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
