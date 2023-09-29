import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { routes } from "@lib/routes";
import { get } from "datagovmy-ui/api";
import {
  AgencyBadge,
  At,
  Card,
  Container,
  Hero,
  Metadata,
  Section,
  Slider,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, SHORT_LANG } from "datagovmy-ui/constants";
import { withi18n } from "datagovmy-ui/decorators";
import { clx, numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import {
  UsersIcon,
  EconomicGrowthIcon,
  IndustryIcon,
  ProductionIcon,
  RetailTradeIcon,
  UnemploymentIcon,
  InflationIcon,
} from "../icons";
import { DOSMIcon } from "datagovmy-ui/icons/agency";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ReactNode, useMemo } from "react";
import DivisionIcon, { Division } from "@icons/division";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

const Home: Page = ({
  analytics,
  keystats,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t, i18n } = useTranslation("opendosm-home");
  const { theme } = useTheme();
  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
    tabs_section_1: 0,
    tabs_section_2: 0,
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const yieldPrefix = (value: number) => (value >= 0 ? "+" : "");

  const yieldCallout = (key: string) => {
    return [
      {
        title: t("daily"),
        value:
          yieldPrefix(timeseries_callout.data[key].callout1) +
          numFormat(timeseries_callout.data[key].callout1, "standard"),
      },
      {
        title: t("total"),
        value: numFormat(timeseries_callout.data[key].callout2, "standard"),
      },
    ];
  };

  const PANELS = [
    {
      name: t("past_24h"),
      data: analytics.today,
    },
    {
      name: t("all_time"),
      data: analytics.all_time,
    },
  ];

  interface StatProps {
    icon: ReactNode;
    title: string;
    url: string;
    value: string;
    data_as_of: string;
  }

  const STATS = useMemo<StatProps[]>(
    () => [
      {
        icon: <UsersIcon className="h-6 w-6" />,
        title: "stats.population",
        url: routes.POPULATION,
        value: numFormat(keystats.population.callout, "compact", 1, "long", i18n.language, true),
        data_as_of: toDate(
          keystats.population.data_as_of,
          `${i18n.language === "ms-MY" ? "'ST'" : ""}q${i18n.language === "ms-MY" ? "" : "Q"} yyyy`,
          i18n.language
        ),
      },
      {
        icon: <EconomicGrowthIcon className="h-6 w-6" />,
        title: "stats.economic_growth",
        url: routes.GDP,
        value: numFormat(keystats.growth.callout, "compact", 1) + "%",
        data_as_of: toDate(
          keystats.growth.data_as_of,
          `${i18n.language === "ms-MY" ? "'ST'" : ""}q${i18n.language === "ms-MY" ? "" : "Q"} yyyy`,
          i18n.language
        ),
      },
      {
        icon: <UnemploymentIcon className="h-6 w-6" />,
        title: "stats.unemployment",
        url: routes.LABOUR_MARKET,
        value: numFormat(keystats.unemployment.callout, "compact", 1) + "%",
        data_as_of: toDate(keystats.unemployment.data_as_of, "MMM yyyy", i18n.language),
      },
      {
        icon: <InflationIcon className="h-6 w-6" />,
        title: "stats.inflation",
        url: routes.CONSUMER_PRICES,
        value: numFormat(keystats.inflation.callout, "compact", 1) + "%",
        data_as_of: toDate(keystats.inflation.data_as_of, "MMM yyyy", i18n.language),
      },
      {
        icon: <ProductionIcon className="h-6 w-6" />,
        title: "stats.production_cost",
        url: routes.PRODUCER_PRICES,
        value:
          yieldPrefix(keystats.ppi.callout) + numFormat(keystats.ppi.callout, "compact", 1) + "%",
        data_as_of: toDate(keystats.ppi.data_as_of, "MMM yyyy", i18n.language),
      },
      {
        icon: <ProductionIcon className="h-6 w-6" />,
        title: "stats.manufacturing_output",
        url: routes.MANUFACTURING_STATISTICS,
        value:
          yieldPrefix(keystats.mfg.callout) + numFormat(keystats.mfg.callout, "compact", 1) + "%",
        data_as_of: toDate(keystats.mfg.data_as_of, "MMM yyyy", i18n.language),
      },
      {
        icon: <IndustryIcon className="h-5 w-5" />,
        title: "stats.industrial_production",
        url: routes.INDUSTRIAL_PRODUCTION,
        value:
          yieldPrefix(keystats.ipi.callout) + numFormat(keystats.ipi.callout, "compact", 1) + "%",
        data_as_of: toDate(keystats.ipi.data_as_of, "MMM yyyy", i18n.language),
      },
      {
        icon: <RetailTradeIcon className="h-6 w-6" />,
        title: "stats.wholesale_retail",
        url: routes.WHOLESALE_RETAIL,
        value:
          yieldPrefix(keystats.iowrt.callout) +
          numFormat(keystats.iowrt.callout, "compact", 1) +
          "%",
        data_as_of: toDate(keystats.iowrt.data_as_of, "MMM yyyy", i18n.language),
      },
    ],
    [i18n.language]
  );

  return (
    <>
      <Metadata keywords={"opendosm data negara inflasi"} />

      <Hero
        background={clx(
          theme === undefined && "gray",
          theme === "light" && "home-banner",
          theme === "dark" && "home-banner-dark"
        )}
        category={[t("category"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="dosm" />}
        action={
          <div className="flex flex-wrap gap-3">
            <At className="btn-primary text-sm shadow-button" href="/dashboard" enableIcon>
              {t("common:nav.dashboards")}
            </At>
            <At
              className="btn btn-border bg-white px-3 py-1.5 text-sm text-black shadow-button active:bg-washed"
              href="/data-catalogue"
              enableIcon
            >
              {t("common:nav.catalogue")}
            </At>
            <At className="btn px-3 py-1.5 text-sm" href="/publications" enableIcon>
              {t("common:nav.publications")}
            </At>
          </div>
        }
      />

      <Container className="min-h-screen">
        <Section title={t("at_a_glance")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {STATS.map(({ data_as_of, icon, title, value, url }: StatProps) => (
              <div className="flex items-center gap-3" key={url}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-outline dark:bg-washed-dark">
                  {icon}
                </div>
                <div className="space-y-0.5">
                  <At
                    href={url}
                    className="relative flex flex-wrap items-start gap-1.5 text-sm font-medium uppercase text-dim transition-all [text-underline-position:from-font] hover:text-black hover:underline dark:hover:text-white"
                  >
                    <span>{t(title)}</span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </At>
                  <span className="flex items-baseline gap-1.5">
                    <p className="text-2xl font-medium">{value}</p>
                    <p className="text-sm text-dim">{`(${data_as_of})`}</p>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section
          title={t("dashboard.title")}
          description={t("dashboard.description")}
          date={analytics.data_as_of}
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
                <Ranking ranks={panel.data.dashboard} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Section>
        <Section
          title={t("catalogue.title")}
          description={t("catalogue.description")}
          date={analytics.data_as_of}
          menu={
            <Tabs.List
              options={PANELS.map(item => item.name)}
              current={data.tabs_section_2}
              onChange={index => setData("tabs_section_2", index)}
            />
          }
        >
          <Tabs
            hidden
            current={data.tabs_section_2}
            onChange={index => setData("tabs_section_2", index)}
          >
            {PANELS.map((panel, index) => (
              <Tabs.Panel name={panel.name as string} key={index}>
                <Ranking ranks={panel.data.dataset} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Section>
        <Section title={t("usage")} date={timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <Timeseries
              className="h-[300px] w-full"
              title={t("views")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.views,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    label: t("views") as string,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                ],
              }}
              stats={yieldCallout("views")}
            />
            <Timeseries
              className="h-[300px] w-full"
              title={t("users")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.users,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    label: t("users") as string,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                ],
              }}
              stats={yieldCallout("users")}
            />
            <Timeseries
              className="h-[300px] w-full"
              title={t("downloads")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.downloads,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    label: t("downloads") as string,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
              stats={yieldCallout("downloads")}
            />
          </div>

          <Slider
            type="range"
            value={data.minmax}
            data={timeseries.data.x}
            onChange={(e: any) => setData("minmax", e)}
          />
        </Section>
      </Container>
    </>
  );
};

type RankItem = {
  id: string;
  count: number;
  name_bm: string;
  name_en: string;
  agency_abbr: Division;
};
interface RankingProps {
  ranks: RankItem[];
}

const Ranking = ({ ranks }: RankingProps) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ranks.map((item: RankItem) => (
          <At href={item.id} key={item.id}>
            <Card className="group w-full space-y-3 rounded-xl border border-outline p-3 transition-colors hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50">
              <div className="relative flex items-center gap-3">
                <DivisionIcon division={item.agency_abbr} className="h-6 w-6" />
                <p className="text-sm text-dim">{t(`division:${item.agency_abbr}.abbr`)}</p>
                <ArrowUpRightIcon className="absolute right-2 h-5 w-5 text-dim opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-2 group-hover:opacity-100 group-hover:duration-300" />
              </div>
              <div className="relative overflow-hidden">
                <p
                  className="truncate font-medium dark:text-white"
                  title={item[`name_${lang as "en" | "bm"}`]}
                >
                  {item[`name_${lang as "en" | "bm"}`]}
                </p>
                <p className="text-dim transition-transform group-hover:translate-y-6">
                  {`${numFormat(item.count, "compact")} ${t("common.views", {
                    count: item.count,
                  })}`}
                </p>
                <p className="absolute -bottom-6 whitespace-nowrap text-primary transition-transform group-hover:-translate-y-6 group-hover:duration-300 dark:text-primary-dark">
                  {t("components.click_to_explore")}
                </p>
              </div>
            </Card>
          </At>
        ))}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("opendosm-home", async () => {
  const { data } = await get("/dashboard/", { dashboard: "opendosm_homepage" });

  return {
    props: {
      meta: {
        id: "home",
        type: "misc",
        category: null,
        agency: null,
      },
      analytics: {
        data_as_of: data.table_summary.data_as_of,
        today: {
          dataset: data.table_summary.data.dataset_views.today,
          dashboard: data.table_summary.data.dashboard_views.today,
        },
        all_time: {
          dataset: data.table_summary.data.dataset_views.all_time,
          dashboard: data.table_summary.data.dashboard_views.all_time,
        },
      },
      keystats: data.keystats.data,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default Home;
