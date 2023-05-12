import Card from "@components/Card";
import AgencyIcon from "@components/Icon/agency";
import {
  AgencyBadge,
  At,
  Button,
  Container,
  Dropdown,
  Hero,
  Input,
  Section,
  Tabs,
} from "@components/index";
import { OptionType } from "@components/types";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { ArrowUpRightIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { SHORT_LANG } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import Image from "next/image";
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

/**
 * Dashboard Index
 * @overview Status: Live
 */

export type Dashboard = {
  id: string;
  name: string;
  views: number;
  agency: string;
  description: string;
};

interface DashboardIndexProps {
  query: Record<string, string>;
  analytics: any;
  sources: Record<string, { agency: string }[]>;
  dashboards: Record<string, Record<string, Dashboard[]>>;
}

const DashboardIndex: FunctionComponent<DashboardIndexProps> = ({
  query,
  analytics,
  sources,
  dashboards,
}) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];
  const filterRef = useRef<DashboardFilterRef>(null);

  const { data, setData } = useData({
    tabs_section_1: 0,
  });

  const PANELS = [
    {
      name: t("common:home.section_2.past_24h"),
      data: analytics[lang].today,
    },
    {
      name: t("common:home.section_2.past_month"),
      data: analytics[lang].last_month,
    },
    {
      name: t("common:home.section_2.all_time"),
      data: analytics[lang].all_time,
    },
  ];

  // for ALL dashboards
  const _collection = useMemo<Array<[string, any]>>(() => {
    let resultCollection: Array<[string, Dashboard[]]> = [];
    Object.entries(dashboards[lang]).forEach(([category, dbs]) => {
      const dashboards = dbs
        .filter((d: Dashboard) => {
          return (
            (!query["source"] || d.agency === query["source"]) &&
            (!query["search"] || d.name.toLowerCase().includes(query["search"].toLowerCase()))
          );
        })
        .sort((a: Dashboard, b: Dashboard) => {
          return b.views - a.views;
        });
      resultCollection.push([category, dashboards as Dashboard[]]);
    });

    return resultCollection;
  }, [query]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:home.category"), "text-primary dark:text-primary-dark"]}
        header={[
          `${filterRef.current?.source ? filterRef.current?.source.concat(":") : ""} ${t(
            "common:dashboard.header"
          )}`,
        ]}
        agencyBadge={
          <AgencyBadge
            agency={t("common:agency.govt")}
            link="https://www.malaysia.gov.my/portal/index"
            icon={
              <Image src={"/static/images/jata_logo.png"} width={28} height={28} alt="Jata Logo" />
            }
            prefixThe
          />
        }
      />
      <DashboardFilter
        ref={filterRef}
        query={query}
        sources={sources[lang].map(({ agency }) => agency)}
      />
      <Container className="min-h-screen">
        {!query["search"] && !query["source"] && (
          <Section
            title={
              <>
                <h4>{t("common:dashboard.section1_title")}</h4>
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
        <Section title={t("common:dashboard.section2_title")}>
          <div className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4">
            {_collection.sort().map(([category, dashboards]) => {
              return (
                dashboards.length > 0 && (
                  <Card
                    className="border-outline bg-background dark:border-washed-dark dark:bg-background-dark my-3 inline-block h-min w-full rounded-xl border p-[18px]"
                    key={category}
                  >
                    <h5 className="pb-1">{category}</h5>
                    {dashboards.map((item: Dashboard, index: number) => (
                      <div className="pt-2" key={item.id}>
                        <At href={item.id}>
                          <Card className="border-outline hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark group w-full space-y-3 rounded-xl border bg-white p-3 transition-colors dark:bg-black">
                            <div className="relative flex items-center gap-4">
                              <AgencyIcon agency={item.agency} />
                              <p className="text-dim text-sm">{item.agency}</p>
                              <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                            <div className="relative overflow-hidden">
                              <p className="truncate font-medium dark:text-white">{item.name}</p>
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
  query: Record<string, any>;
  sources: string[];
  ref?: ForwardedRef<DashboardFilterRef>;
}

interface DashboardFilterRef {
  source?: string;
}

const DashboardFilter: ForwardRefExoticComponent<DashboardFilterProps> = forwardRef(
  ({ query, sources }, ref) => {
    const { t } = useTranslation();

    const filterSources: Array<OptionType> = sources.map(source => ({
      label: source,
      value: source,
    }));

    const { filter, setFilter, actives } = useFilter({
      source: query.source ? filterSources.find(item => query.source === item.value) : [],
      search: query.search ?? "",
    });

    const reset = () => {
      setFilter("search", "");
      setFilter("source", undefined);
    };

    useImperativeHandle(ref, () => {
      return {
        source: filter.source?.value ?? "",
      };
    });

    const renderClear = (className: string) => {
      return (
        actives.length > 0 && (
          <div className={className}>
            <Button
              className="text-dim hover:bg-washed dark:hover:bg-washed-dark w-max text-sm"
              icon={<XMarkIcon className="h-4 w-4" />}
              disabled={!actives.length}
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
              placeholder={t("common:dashboard.source_placeholder")}
              anchor="left"
              options={filterSources}
              selected={filter.source}
              onChange={e => setFilter("source", e)}
              enableSearch
              enableClear
            />
            <Input
              className="border-0 "
              type="search"
              placeholder={t("common:dashboard.search_placeholder")}
              autoFocus
              value={filter.search}
              onChange={e => setFilter("search", e)}
              icon={<MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
            />
            {renderClear("hidden lg:block")}
          </div>
        </Container>
      </div>
    );
  }
);

DashboardFilter.displayName = "DashboardFilter";

type RankItem = {
  id: string;
  views: number;
  agency: string;
  name: string;
  description: string;
};
interface RankingProps {
  ranks: RankItem[];
}

const Ranking = ({ ranks }: RankingProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {ranks.map((item: RankItem, i) => (
          <At href={"/dashboard".concat(item.id)} key={item.id}>
            <div className="border-outline hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark group w-full space-y-3 rounded-xl border p-6 transition-colors">
              <div className="relative flex items-center gap-3">
                <span className="text-primary text-sm font-bold">#{i + 1}</span>
                <p className="text-dim text-sm">{item.agency}</p>
                <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
              <div className="relative flex flex-col items-start gap-3 overflow-hidden">
                <p className="truncate text-lg font-bold dark:text-white" title={item.name}>
                  {item.name}
                </p>
                <p className="text-sm dark:text-white" title={item.name}>
                  {item.description}
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
