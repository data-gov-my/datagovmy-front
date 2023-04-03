import Card from "@components/Card";
import { At, Button, Container, Dropdown, Hero, Input, Section, Tabs } from "@components/index";
import { OptionType } from "@components/types";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { ArrowUpRightIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { SHORT_LANG } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  ReactNode,
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
  sources: string[];
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
      name: t("home.section_2.past_24h"),
      data: analytics[lang].today,
    },
    {
      name: t("home.section_2.past_month"),
      data: analytics[lang].last_month,
    },
    {
      name: t("home.section_2.all_time"),
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
        header={[
          t("dashboard.header").concat(
            filterRef.current?.source ? `: ${filterRef.current?.source}` : ""
          ),
        ]}
        description={
          <div className="space-y-6">
            <p className="text-dim">{t("dashboard.description")}</p>
            {filterRef.current?.sourceFilter()}
          </div>
        }
      />

      <Container className="min-h-screen">
        <DashboardFilter ref={filterRef} query={query} sources={sources} />

        {!query["search"] && !query["source"] && (
          <Section
            title={
              <>
                <h4>{t("dashboard.section1_title")}</h4>
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
        {_collection.sort().map(([category, dashboards]) => {
          return (
            dashboards.length > 0 && (
              <Section title={category}>
                <div className="grid  grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
                  {dashboards.map((item: Dashboard) => (
                    <At href={item.id} key={item.id}>
                      <Card className="group w-full space-y-3 rounded-xl border border-outline p-3 transition-colors hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark">
                        <div className="relative flex items-center gap-4">
                          <div className="h-4 w-4 rounded-full bg-outline" />
                          <p className="text-sm text-dim">{item.agency}</p>
                          <ArrowUpRightIcon className="absolute right-1 h-5 w-5 text-dim opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                        </div>
                        <div className="relative overflow-hidden">
                          <p className="truncate font-medium dark:text-white">{item.name}</p>
                        </div>
                      </Card>
                    </At>
                  ))}
                </div>
              </Section>
            )
          );
        })}
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
  sourceFilter: () => ReactNode;
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
        sourceFilter: () => (
          <Dropdown
            icon={<BuildingLibraryIcon className="h-4 w-4 text-dim" />}
            className="min-w-[250px]"
            placeholder={t("dashboard.source_placeholder")}
            anchor="left"
            options={filterSources}
            selected={filter.source}
            onChange={e => setFilter("source", e)}
            enableSearch
            enableClear
          />
        ),
      };
    });

    return (
      <div className="sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:border-washed-dark dark:bg-black lg:pl-2">
        <div className="flex flex-grow items-center">
          <Input
            className="border-0"
            type="search"
            placeholder={t("dashboard.search_placeholder")}
            autoFocus
            value={filter.search}
            onChange={e => setFilter("search", e)}
            icon={<MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
          />
        </div>
        <div className="hidden gap-2 pr-6 xl:flex">
          {actives.length > 0 && (
            <div>
              <Button
                icon={<XMarkIcon className="h-4 w-4" />}
                disabled={!actives.length}
                onClick={reset}
              >
                {t("common.clear_all")}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

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
            <div className="group w-full space-y-3 rounded-xl border border-outline p-6 transition-colors hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark">
              <div className="relative flex items-center gap-3">
                <span className="text-sm font-bold text-primary">#{i + 1}</span>
                <p className="text-sm text-dim">{item.agency}</p>
                <ArrowUpRightIcon className="absolute right-1 h-5 w-5 text-dim opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
              <div className="relative flex flex-col items-start gap-3 overflow-hidden">
                <p className="truncate text-lg font-bold dark:text-white" title={item.name}>
                  {item.name}
                </p>
                <p className="text-sm dark:text-white" title={item.name}>
                  {item.description}
                </p>
                <p className="text-dim transition-transform group-hover:translate-y-6">
                  {`${numFormat(item.views, "compact")} ${t("common.views")}`}
                </p>
                <p className="absolute -bottom-6 text-primary transition-transform group-hover:-translate-y-6 dark:text-primary-dark">
                  {t("components.click_to_explore")}
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
