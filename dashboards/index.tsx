import {
  At,
  Button,
  Checkbox,
  Container,
  Dropdown,
  Hero,
  Input,
  Modal,
  Radio,
  Section,
  Tabs,
} from "@components/index";
import {
  ArrowTrendingUpIcon,
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  FunctionComponent,
  useMemo,
  useRef,
  ForwardRefExoticComponent,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  ForwardedRef,
} from "react";
import Label from "@components/Label";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { OptionType } from "@components/types";
import Sidebar from "@components/Sidebar";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { BREAKPOINTS, SHORT_LANG } from "@lib/constants";
import Daterange from "@components/Dropdown/Daterange";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import Card from "@components/Card";
import { numFormat } from "@lib/helpers";
import { rankItem } from "@tanstack/match-sorter-utils";
import { routes } from "@lib/routes";

/**
 * Dashboard Index
 * @overview Status: Live
 */

export type Dashboard = {
  id: string;
  dashboard_name: string;
};

interface DashboardIndexProps {
  query: Record<string, string>;
  //   collection: Record<string, any>;
  //   total: number;
  analytics: any;
  timeseries: any;
  sources: string[];
}

type RankItem = {
  id: string;
  count: number;
  name_bm: string;
  name_en: string;
};
interface RankingProps {
  ranks: RankItem[];
}

const Ranking = ({ ranks }: RankingProps) => {
  const { i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {ranks.map((item: RankItem) => (
          <At href={item.id} key={item.id}>
            <Card className="group w-full space-y-3 p-3 transition-colors hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark">
              <div className="relative flex items-center gap-4">
                <div className="h-4 w-4 rounded-full bg-outline" />
                <p className="text-sm text-dim">agency_name</p>
                <ArrowUpRightIcon className="absolute right-1 h-5 w-5 text-dim opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
              <div className="relative overflow-hidden">
                <p
                  className="truncate font-medium dark:text-white"
                  title={item[`name_${lang as "en" | "bm"}`]}
                >
                  {item[`name_${lang as "en" | "bm"}`]}
                </p>
                <p className="text-dim transition-transform group-hover:translate-y-6">
                  {numFormat(item.count, "compact")} views
                </p>
                <p className="absolute -bottom-6 text-primary transition-transform group-hover:-translate-y-6 dark:text-primary-dark">
                  Click to explore
                </p>
              </div>
            </Card>
          </At>
        ))}
      </div>
    </>
  );
};

const DashboardIndex: FunctionComponent<DashboardIndexProps> = ({
  query,
  //   collection,
  //   total,
  timeseries,
  analytics,
  sources,
}) => {
  const { t } = useTranslation();
  const filterRef = useRef<DashboardFilterRef>(null);

  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.lnegth - 1],
    tabs_section_1: 0,
  });

  const PANELS = [
    {
      name: t("home.section_2.past_24h"),
      data: analytics.today,
    },
    {
      name: t("home.section_2.past_month"),
      data: analytics.last_month,
    },
    {
      name: t("home.section_2.all_time"),
      data: analytics.all_time,
    },
  ];

  // TODO: might be good to extract into constants then use to refer in  components/Layout/Header and this file. (don't have to update in multiple places)
  const megaMenuItems = [
    {
      title: t("nav.megamenu.categories.economy"),
      list: [
        {
          title: t("nav.megamenu.dashboards.consumer_prices"),
          link: routes.CONSUMER_PRICES,
        },
        { title: t("nav.megamenu.dashboards.exchange_rate"), link: routes.EXCHANGE_RATE },
        { title: t("nav.megamenu.dashboards.gdp"), link: routes.GDP },
      ],
    },
    {
      title: t("nav.megamenu.categories.financial_sector"),
      list: [
        {
          title: t("nav.megamenu.dashboards.currency_in_circulation"),
          link: routes.CURRENCY_IN_CIRCULATION,
        },
        {
          title: t("nav.megamenu.dashboards.money_supply"),
          link: routes.MONEY_SUPPLY,
        },
        {
          title: t("nav.megamenu.dashboards.reserve_money"),
          link: routes.RESERVE_MONEY,
        },
        {
          title: t("nav.megamenu.dashboards.international_reserves"),
          link: routes.INTERNATIONAL_RESERVES,
        },
        {
          title: t("nav.megamenu.dashboards.interest_rates"),
          link: routes.INTEREST_RATES,
        },
      ],
    },
    {
      title: t("nav.megamenu.categories.healthcare"),
      list: [{ title: t("nav.megamenu.dashboards.blood_donation"), link: routes.BLOOD_DONATION }],
    },
  ];

  return (
    <div>
      <Hero
        background="bg-gradient-radial from-white to-primary/10 dark:from-outlineHover-dark dark:to-black"
        header={[t("dashboard.header")]}
        description={[t("dashboard.description")]}
      />

      <Container className="min-h-screen lg:px-0">
        <DashboardFilter ref={filterRef} query={query} sources={sources} />
        <Section
          title={"Most Popular Dashboards"}
          description="Explore popular dashboards"
          menu={
            <Tabs.List
              options={PANELS.map(item => item.name)}
              current={data.tabs_section_1}
              onChange={index => setData("tabs_section_1", index)}
            />
          }
        >
          <Tabs
            hidden
            current={data.tabs_section_1}
            onChange={index => setData("tabs_section_1", index)}
          >
            {PANELS.map((panel, index) => (
              <Tabs.Panel name={panel.name as string} key={index}>
                <Ranking ranks={panel.data.dashboard_views} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Section>
        <Section title={t("dashboard.section2_title")}>TODO...</Section>
        {megaMenuItems.map((category, index) => (
          <Section title={category.title}>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              {category.list.map(item => (
                <At href={item.link} key={item.title}>
                  <Card className="group w-full space-y-3 p-3 transition-colors hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark">
                    <div className="relative flex items-center gap-4">
                      <div className="h-4 w-4 rounded-full bg-outline" />
                      <p className="text-sm text-dim">Agency</p>
                      <ArrowUpRightIcon className="absolute right-1 h-5 w-5 text-dim opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                    <div className="relative overflow-hidden">
                      <p className="truncate font-medium dark:text-white">{item.title}</p>
                    </div>
                  </Card>
                </At>
              ))}
            </div>
          </Section>
        ))}
      </Container>
    </div>
  );
};

/**
 * Dashboard Filter Component
 */
interface DashboardFilterProps {
  query: Record<string, any>;
  sources: string[];
  ref: ForwardedRef<DashboardFilterRef>;
}

interface DashboardFilterRef {
  sourceFilter: () => ReactNode;
}

const DashboardFilter: ForwardRefExoticComponent<DashboardFilterProps> = forwardRef(
  ({ query, sources }, ref) => {
    const { t } = useTranslation();

    const filterGeographics: Array<OptionType> = [
      { label: t("catalogue.index_filters.state"), value: "STATE" },
      { label: t("catalogue.index_filters.district"), value: "DISTRICT" },
      { label: t("catalogue.index_filters.parlimen"), value: "PARLIMEN" },
      { label: t("catalogue.index_filters.dun"), value: "DUN" },
      { label: t("catalogue.index_filters.national"), value: "NATIONAL" },
    ];

    const filterDemographics: Array<OptionType> = [
      { label: t("dashboard.index_filters.sex"), value: "SEX" },
      { label: t("dashboard.index_filters.ethnicity"), value: "ETHNICITY" },
      { label: t("dashboard.index_filters.age"), value: "AGE" },
      { label: t("dashboard.index_filters.religion"), value: "RELIGION" },
      { label: t("dashboard.index_filters.nationality"), value: "NATIONALITY" },
      { label: t("dashboard.index_filters.disability_status"), value: "DISABILITY_STATUS" },
      { label: t("dashboard.index_filters.marital_status"), value: "MARITAL_STATUS" },
    ];

    const filterSources: Array<OptionType> = sources.map(source => ({
      label: source,
      value: source,
    }));

    const { filter, setFilter, actives } = useFilter({
      geography: query.geography
        ? filterGeographics.filter(item => query.geography.split(",").includes(item.value))
        : [],
      demographics: query.demographics
        ? filterDemographics.filter(item => query.demographics.split(",").includes(item.value))
        : [],
      source: query.source ? filterSources.find(item => query.source === item.value) : [],
      search: query.search ?? "",
    });

    const reset = () => {
      setFilter("search", "");
      setFilter("geography", []);
      setFilter("demographics", []);
      setFilter("source", undefined);
    };

    // useImperativeHandle(ref, () => {
    //   return {
    //     sourceFilter: () => (
    //       <Dropdown
    //         icon={<BuildingLibraryIcon className="h-4 w-4 text-dim" />}
    //         className="min-w-[250px]"
    //         placeholder={t("catalogue.source_placeholder")}
    //         anchor="left"
    //         options={filterSources}
    //         selected={filter.source}
    //         onChange={e => setFilter("source", e)}
    //         enableSearch
    //         enableClear
    //       />
    //     ),
    //   };
    // });

    return (
      <div className="sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:border-washed-dark dark:bg-black lg:pl-2">
        <div className="flex flex-grow items-center">
          <div className="hidden xl:block">
            <Dropdown
              icon={<BuildingLibraryIcon className="h-4 w-4 text-dim" />}
              placeholder={t("dashboard.source_placeholder")}
              anchor="left"
              options={filterSources}
              selected={filter.source}
              onChange={e => setFilter("source", e)}
              enableSearch
              enableClear
            />
          </div>
          <Input
            className="border-0"
            type="search"
            placeholder={t("catalogue.search_placeholder")}
            autoFocus
            value={filter.search}
            onChange={e => setFilter("search", e)}
            icon={<MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
          />
        </div>
        {/* Mobile */}
        <div className="block xl:hidden">
          <Modal
            trigger={open => (
              <Button
                onClick={open}
                className="mr-3 block self-center border border-outline px-3 py-1.5 shadow-sm dark:border-washed-dark"
              >
                <span>{t("catalogue.filter")}</span>
                <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white dark:bg-white dark:text-black">
                  {actives.length}
                </span>
              </Button>
            )}
            title={
              <Label
                label={t("catalogue.filter") + ":"}
                className="block text-sm font-medium text-black dark:text-white"
              />
            }
            fullScreen
          >
            {close => (
              <div className="flex-grow space-y-4 divide-y overflow-y-auto pb-28 dark:divide-outlineHover-dark">
                <Checkbox
                  label={t("catalogue.geography")}
                  className="flex flex-wrap gap-4 px-1 pt-2"
                  name="geography"
                  options={filterGeographics}
                  value={filter.geography}
                  onChange={e => setFilter("geography", e)}
                />
                <Checkbox
                  label={t("dashboard.demographics")}
                  className="flex flex-wrap gap-4 px-1 pt-2"
                  name="demographics"
                  options={filterDemographics}
                  value={filter.geography}
                  onChange={e => setFilter("demographics", e)}
                />
                <Checkbox
                  label={t("catalogue.source")}
                  className="space-y-4 px-1 pt-4"
                  name="source"
                  options={filterSources}
                  value={filter.source}
                  onChange={e => setFilter("source", e)}
                />

                <div className="fixed bottom-0 left-0 w-full space-y-2 bg-white py-3 px-2 dark:bg-black">
                  <Button
                    className="btn btn-primary w-full justify-center"
                    disabled={!actives.length}
                    onClick={reset}
                  >
                    {t("common.reset")}
                  </Button>
                  <Button
                    className="btn w-full justify-center"
                    icon={<XMarkIcon className="h-4 w-4" />}
                    onClick={close}
                  >
                    {t("common.close")}
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>

        {/* Desktop */}
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

          <Dropdown
            multiple
            enableClear
            title={t("catalogue.geography")}
            options={filterGeographics}
            selected={filter.geography}
            onChange={e => setFilter("geography", e)}
          />

          <Dropdown
            multiple
            enableClear
            title={t("dashboard.demographics")}
            options={filterDemographics}
            selected={filter.demographics}
            onChange={e => setFilter("demographics", e)}
          />
        </div>
      </div>
    );
  }
);

export default DashboardIndex;
