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
import { clx, isValidURL, numFormat } from "datagovmy-ui/helpers";
import { useData, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { AgencyIcon } from "datagovmy-ui/icons/agency";
import { Agency, OptionType } from "datagovmy-ui/types";
import { FunctionComponent, ReactNode, useMemo } from "react";

/**
 * Dashboard Index
 * @overview Status: Live
 */

type Dashboard = {
  name: string;
  agency: Agency;
  views: number;
  fillColor: string;
};

interface DashboardIndexProps {
  analytics: any;
  sources: string[];
  queries: Record<string, any>;
  dashboards: Record<string, Dashboard[]>;
  dashboards_route: Record<string, { route: string }>;
}

const DashboardIndex: FunctionComponent<DashboardIndexProps> = ({
  analytics,
  queries,
  sources,
  dashboards,
  dashboards_route,
}) => {
  const { t, i18n } = useTranslation(["dashboards", "agencies", "common"]);

  const { data, setData } = useData({ tabs_section_1: 0 });

  const PANELS = [
    {
      name: t("common:home.section_2.past_24h"),
      data: analytics.today,
    },
    {
      name: t("common:home.section_2.all_time"),
      data: analytics.all_time,
    },
  ];

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:home.category"), "text-primary dark:text-primary-dark"]}
        header={[
          `${queries.source ? t(`agencies:${queries.source}.abbr`).concat(":") : ""} ${t(
            "header"
          )}`,
        ]}
        description={[
          t("description", {
            agency: t(`agencies:${queries.agencies}.abbr`),
            context: queries.source ? "agency" : "",
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
        agencyBadge={<AgencyBadge agency={queries.source || "govt"} />}
      />
      <DashboardFilter dashboards={dashboards} sources={sources} queries={queries}>
        {collection => (
          <Container className="min-h-screen">
            {Object.values(queries).length <= 0 && (
              <Section
                title={
                  <>
                    <h4>{t("section1_title")}</h4>
                    <Tabs.List
                      options={PANELS.map(item => item.name)}
                      current={data.tabs_section_1}
                      onChange={index => setData("tabs_section_1", index)}
                    />
                  </>
                }
              >
                <Tabs
                  hidden
                  current={data.tabs_section_1}
                  onChange={index => setData("tabs_section_1", index)}
                >
                  {PANELS.map((panel, index) => (
                    <Tabs.Panel name={panel.name} key={index}>
                      <Ranking ranks={panel.data} dashboards_route={dashboards_route} />
                    </Tabs.Panel>
                  ))}
                </Tabs>
              </Section>
            )}

            {/* Remaining sections for dashboard */}
            <Section title={t("section2_title")}>
              <div className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4">
                {collection.sort().map(([category, dashboards]) => {
                  return (
                    dashboards.length > 0 && (
                      <Card
                        className="border-outline bg-background dark:border-washed-dark dark:bg-background-dark mb-6 inline-block h-min w-full rounded-xl border p-[18px]"
                        key={category}
                      >
                        <h5>{t(`categories.${category}`)}</h5>
                        {dashboards.map(item => (
                          <div className="pt-3" key={item.name}>
                            <At
                              href={dashboards_route[item.name].route}
                              locale={i18n.language}
                              prefetch={false}
                              external={isValidURL(dashboards_route[item.name].route)}
                            >
                              <Card
                                className={clx(
                                  "border-outline hover:border-outlineHover hover:bg-background dark:hover:bg-washed-dark/50 dark:border-washed-dark dark:hover:border-outlineHover-dark group w-full space-y-2 rounded-xl border bg-white p-3 transition-colors dark:bg-black",
                                  isValidURL(dashboards_route[item.name].route) ? "h-[110px]" : ""
                                )}
                              >
                                <div className="relative flex items-center gap-x-3">
                                  <AgencyIcon
                                    agency={item.agency}
                                    className="h-6 w-6"
                                    fillColor={item.fillColor}
                                  />
                                  <p className="text-dim text-sm">
                                    {t(`agencies:${item.agency}.abbr`)}
                                  </p>
                                  <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-0 transition-transform group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transform-none" />
                                </div>
                                <div className="relative overflow-hidden">
                                  <p className="flex items-center gap-1 truncate font-medium dark:text-white">
                                    {t(`dashboards.${item.name}.name`)}
                                    {isValidURL(dashboards_route[item.name].route) && (
                                      <ArrowTopRightOnSquareIcon className="inline-block h-4 w-4" />
                                    )}
                                  </p>
                                  {!isValidURL(dashboards_route[item.name].route) ? (
                                    <p className="text-dim transition-transform group-hover:translate-y-6 motion-reduce:transform-none">
                                      {`${numFormat(item.views, "compact")} ${t(
                                        "common:common.views",
                                        { count: item.views }
                                      )}`}
                                    </p>
                                  ) : (
                                    <div className="h-6"></div>
                                  )}

                                  <p className="text-primary dark:text-primary-dark absolute -bottom-6 whitespace-nowrap transition-transform group-hover:-translate-y-6 motion-reduce:transform-none">
                                    {t("common:components.click_to_explore")}
                                  </p>
                                </div>
                              </Card>
                            </At>
                          </div>
                        ))}
                      </Card>
                    )
                  );
                })}
              </div>
            </Section>
          </Container>
        )}
      </DashboardFilter>
    </>
  );
};

/**
 * Dashboard Filter Component
 */
interface DashboardFilterProps {
  sources: string[];
  dashboards: Record<string, Dashboard[]>;
  queries: Record<string, any>;
  children: (collection: Array<[string, Dashboard[]]>) => ReactNode;
}

const DashboardFilter: FunctionComponent<DashboardFilterProps> = ({
  sources,
  dashboards,
  queries,
  children,
}) => {
  const { t } = useTranslation(["dashboards", "agencies", "common"]);
  const { filter, setFilter } = useFilter({
    source: queries.source || undefined,
    search: queries.search || "",
  });

  const filterSources: OptionType[] = sources.map(source => ({
    label: t(`agencies:${source}.abbr`),
    value: source,
  }));

  // for ALL dashboards
  const _collection = useMemo<Array<[string, Dashboard[]]>>(() => {
    let resultCollection: Array<[string, Dashboard[]]> = [];
    for (const [category, dbs] of Object.entries(dashboards)) {
      const dashboards = dbs
        .filter(d => {
          if (d.name === "covid-vaccination") Object.assign(d, { fillColor: AKSARA_COLOR.GREEN });
          else if (d.agency === "aadk") Object.assign(d, { fillColor: AKSARA_COLOR.DANGER });
          return (
            (!filter.source || d.agency === filter.source) &&
            (!filter.search ||
              t(`dashboards.${d.name}.name`).toLowerCase().includes(filter.search.toLowerCase()))
          );
        })
        .sort((a, b) => b.views - a.views);
      resultCollection.push([category, dashboards as Dashboard[]]);
    }
    return resultCollection;
  }, [filter.source, filter.search]);

  return (
    <>
      <div className="dark:border-washed-dark sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:bg-black lg:pl-2">
        <Container>
          <div className="flex flex-row items-center gap-x-3">
            <Dropdown
              icon={<BuildingLibraryIcon className="text-dim h-4 w-4" />}
              width="w-fit"
              placeholder={t("source_placeholder")}
              anchor="left"
              options={filterSources}
              selected={filterSources.find(item => filter.source === item.value)}
              onChange={(e?: OptionType) => {
                if (e) setFilter("source", e.value);
                else setFilter("source", "");
              }}
              enableSearch
              enableClear
            />
            <Search
              className="w-full border-0"
              placeholder={t("search_placeholder")}
              query={filter.search}
              onChange={e => typeof e === "string" && setFilter("search", e)}
            />
            {filter.search && (
              <Button
                className="btn-ghost text-dim max-md:rounded-full max-md:p-2"
                icon={<XMarkIcon className="h-5 w-5" />}
                onClick={() => setFilter("search", "")}
              >
                <p className="hidden md:block">{t("common:common.clear")}</p>
              </Button>
            )}
          </div>
        </Container>
      </div>
      {children(_collection)}
    </>
  );
};

DashboardFilter.displayName = "DashboardFilter";

interface RankingProps {
  ranks: Dashboard[];
  dashboards_route: Record<string, { route: string }>;
}

const Ranking = ({ ranks, dashboards_route }: RankingProps) => {
  const { t, i18n } = useTranslation(["dashboards", "agencies", "common"]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {ranks.map((item, i) => (
          <At
            href={dashboards_route[item.name].route}
            locale={i18n.language}
            key={i}
            prefetch={false}
          >
            <div className="border-outline hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50 group flex h-full w-full flex-col space-y-3 rounded-xl border p-6 transition-colors">
              <div className="relative flex items-center gap-3">
                <span className="text-primary text-sm font-bold">#{i + 1}</span>
                <p className="text-dim text-sm">{t(`agencies:${item.agency}.abbr`)}</p>
                <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-0 transition-transform group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transform-none" />
              </div>
              <div className="flex grow flex-col items-start gap-3 overflow-hidden">
                <div className="grow space-y-3">
                  <p className="truncate text-lg font-bold dark:text-white" title={item.name}>
                    {t(`dashboards.${item.name}.name`)}
                  </p>
                  <p className="text-sm dark:text-white" title={item.name}>
                    {t(`dashboards.${item.name}.description`)}
                  </p>
                </div>
                <div className="relative w-full">
                  <p className="text-dim transition-transform group-hover:translate-y-6 motion-reduce:transform-none">
                    {`${numFormat(item.views, "compact")} ${t("common:common.views", {
                      count: item.views,
                    })}`}
                  </p>
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
