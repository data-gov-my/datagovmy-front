import Card from "@components/Card";
import AgencyIcon from "@components/Icon/agency";
import {
  AgencyBadge,
  At,
  Button,
  Container,
  Dropdown,
  Hero,
  Section,
  Tabs,
} from "@components/index";
import Search from "@components/Search";
import { OptionType } from "@components/types";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { ArrowUpRightIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import Image from "next/image";
import { useRouter } from "next/router";
import { FunctionComponent, useMemo } from "react";

/**
 * Dashboard Index
 * @overview Status: Live
 */

type Dashboard = {
  name: string;
  agency: string;
  views: number;
};

interface DashboardIndexProps {
  agency: string | null;
  analytics: any;
  sources: string[];
  dashboards: Record<string, Dashboard[]>;
}

const DashboardIndex: FunctionComponent<DashboardIndexProps> = ({
  agency,
  analytics,
  sources,
  dashboards,
}) => {
  const { t, i18n } = useTranslation(["dashboards", "agencies", "common"]);

  const { data, setData } = useData({
    tabs_section_1: 0,
    search: "",
  });

  const PANELS = [
    {
      name: t("common:home.section_2.past_24h"),
      data: analytics.today,
    },
    {
      name: t("common:home.section_2.past_month"),
      data: analytics.last_month,
    },
    {
      name: t("common:home.section_2.all_time"),
      data: analytics.all_time,
    },
  ];

  // for ALL dashboards
  const _collection = useMemo<Array<[string, Dashboard[]]>>(() => {
    let resultCollection: Array<[string, Dashboard[]]> = [];
    for (const [category, dbs] of Object.entries(dashboards)) {
      const dashboards = dbs
        .filter(d => {
          return (
            (!agency || d.agency === agency) &&
            (!data.search ||
              t(`dashboards.${d.name}.name`).toLowerCase().includes(data.search.toLowerCase()))
          );
        })
        .sort((a, b) => b.views - a.views);
      resultCollection.push([category, dashboards as Dashboard[]]);
    }
    return resultCollection;
  }, [agency, data.search]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:home.category"), "text-primary dark:text-primary-dark"]}
        header={[
          `${agency !== null ? t(`agencies:${agency}.abbr`).concat(":") : ""} ${t("header")}`,
        ]}
        description={[
          t("description", {
            agency: t(`agencies:${agency}.abbr`),
            context: agency ? "agency" : "",
          }),
        ]}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:govt.full")}
            link="https://www.malaysia.gov.my/portal/index"
            icon={
              <Image src={"/static/images/jata_logo.png"} width={28} height={28} alt="Jata Logo" />
            }
          />
        }
      />
      <DashboardFilter
        data={{
          source: agency,
          search: data.search,
        }}
        sources={sources}
        onSearch={value => setData("search", value)}
      />
      <Container className="min-h-screen">
        {!agency && !data.search && (
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
                  <Ranking ranks={panel.data} />
                </Tabs.Panel>
              ))}
            </Tabs>
          </Section>
        )}

        {/* Remaining sections for dashboard */}
        <Section title={t("section2_title")}>
          <div className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4">
            {_collection.sort().map(([category, dashboards]) => {
              return (
                dashboards.length > 0 && (
                  <Card
                    className="border-outline bg-background dark:border-washed-dark dark:bg-background-dark my-3 inline-block h-min w-full rounded-xl border p-[18px]"
                    key={category}
                  >
                    <h5 className="pb-1">{t(`categories.${category}`)}</h5>
                    {dashboards.map(item => (
                      <div className="pt-2" key={item.name}>
                        <At href={`/dashboard/${item.name}`} locale={i18n.language}>
                          <Card className="border-outline hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark group w-full space-y-3 rounded-xl border bg-white p-3 transition-colors dark:bg-black">
                            <div className="relative flex items-center gap-4">
                              <AgencyIcon agency={item.agency} />
                              <p className="text-dim text-sm">
                                {t(`agencies:${item.agency}.abbr`)}
                              </p>
                              <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                            <div className="relative overflow-hidden">
                              <p className="truncate font-medium dark:text-white">
                                {t(`dashboards.${item.name}.name`)}
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
    </>
  );
};

/**
 * Dashboard Filter Component
 */
interface DashboardFilterProps {
  data: {
    source: string | null;
    search: string;
  };
  sources: string[];
  onSearch: (value: string) => void;
}

const DashboardFilter: FunctionComponent<DashboardFilterProps> = ({ data, sources, onSearch }) => {
  const { t } = useTranslation(["dashboards", "agencies", "common"]);
  const { push } = useRouter();

  const filterSources: OptionType[] = sources.map(source => ({
    label: t(`agencies:${source}.abbr`),
    value: source,
  }));

  const reset = () => onSearch("");

  const renderClear = (className: string) => {
    return (
      data.search && (
        <div className={className}>
          <Button
            className="text-dim hover:bg-washed dark:hover:bg-washed-dark w-max text-sm"
            icon={<XMarkIcon className="h-4 w-4" />}
            onClick={reset}
          >
            {t("common:common.clear_all")}
          </Button>
        </div>
      )
    );
  };

  return (
    <div className="dark:border-washed-dark sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:bg-black lg:pl-2">
      <Container>
        <div className="flex flex-row flex-wrap-reverse items-center gap-3 lg:flex-nowrap">
          {renderClear("block lg:hidden")}
          <Dropdown
            icon={<BuildingLibraryIcon className="text-dim h-4 w-4" />}
            className="w-fit min-w-fit"
            placeholder={t("source_placeholder")}
            anchor="left"
            options={filterSources}
            selected={filterSources.find(item => data.source === item.value)}
            onChange={e => {
              if (e?.value) push(`/dashboard/agency/${e.value}`, undefined, { scroll: false });
              else push("/dashboard", undefined, { scroll: false });
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
          {renderClear("hidden lg:block")}
        </div>
      </Container>
    </div>
  );
};

DashboardFilter.displayName = "DashboardFilter";

interface RankingProps {
  ranks: Dashboard[];
}

const Ranking = ({ ranks }: RankingProps) => {
  const { t, i18n } = useTranslation(["dashboards", "agencies", "common"]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {ranks.map((item, i) => (
          <At href={`/dashboard/${item.name}`} locale={i18n.language} key={i}>
            <div className="border-outline hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark group w-full space-y-3 rounded-xl border p-6 transition-colors">
              <div className="relative flex items-center gap-3">
                <span className="text-primary text-sm font-bold">#{i + 1}</span>
                <p className="text-dim text-sm">{t(`agencies:${item.agency}.abbr`)}</p>
                <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
              <div className="relative flex flex-col items-start gap-3 overflow-hidden">
                <p className="truncate text-lg font-bold dark:text-white" title={item.name}>
                  {t(`dashboards.${item.name}.name`)}
                </p>
                <p className="text-sm dark:text-white" title={item.name}>
                  {t(`dashboards.${item.name}.description`)}
                </p>
                <p className="text-dim transition-transform group-hover:translate-y-6">
                  {`${numFormat(item.views, "compact")} ${t("common:common.views")}`}
                </p>
                <p className="text-primary dark:text-primary-dark absolute -bottom-6 transition-transform group-hover:-translate-y-6">
                  {t("common:components.click_to_explore")}
                </p>
              </div>
            </div>
          </At>
        ))}
      </div>
    </>
  );
};

export default DashboardIndex;
