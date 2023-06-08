import type { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { get } from "@lib/api";
import { useTranslation } from "@hooks/useTranslation";

import Metadata from "@components/Metadata";
import Hero from "@components/Hero";
import Container from "@components/Container";
import Section from "@components/Section";
import { default as Tabs, Panel } from "@components/Tabs";
import Slider from "@components/Chart/Slider";
import { AKSARA_COLOR, BREAKPOINTS, SHORT_LANG } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import Card from "@components/Card";
import { EyeIcon, DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import At from "@components/At";
import { ReactNode, useEffect, useMemo } from "react";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { routes } from "@lib/routes";
import {
  UsersIcon,
  EconomicGrowthIcon,
  BankIcon,
  IndustryIcon,
  ProductionIcon,
  RetailTradeIcon,
  UnemploymentIcon,
  InflationIcon,
} from "@components/Icon";
import { track } from "@lib/mixpanel";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const Home: Page = ({
  highlights,
  timeseries,
  timeseries_callouts,
  analytics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const windowWidth = useWindowWidth();
  const { t, i18n } = useTranslation();

  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const yieldPrefix = (value: number) => (value >= 0 ? "+" : "");

  const yieldCallout = (key: string) => {
    return [
      {
        title: t("home.section_3.daily"),
        value:
          yieldPrefix(timeseries_callouts.data[key].callout1) +
          numFormat(timeseries_callouts.data[key].callout1, "standard"),
      },
      {
        title: t("home.section_3.total"),
        value: numFormat(timeseries_callouts.data[key].callout2, "standard"),
      },
    ];
  };

  const PANELS = [
    {
      name: t("home.section_2.today"),
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

  interface StatProps {
    icon: ReactNode;
    title: string;
    url: string;
    value: string;
  }

  const STATS = useMemo<StatProps[]>(
    () => [
      {
        icon: <UsersIcon className="h-6 w-6" />,
        title: t("home.section_1.stats.population"),
        url: routes.KAWASANKU,
        value: numFormat(
          highlights.data.population.callout,
          "compact",
          [1, 1],
          "long",
          i18n.language,
          true
        ),
      },
      {
        icon: <EconomicGrowthIcon className="h-5 w-5" />,
        title: t("home.section_1.stats.economic_growth"),
        url: routes.GDP,
        value: numFormat(highlights.data.growth.callout, "compact", [1, 1]) + "%",
      },
      {
        icon: <BankIcon className="h-4 w-4" />,
        title: t("home.section_1.stats.bnm_opr"),
        url: routes.INTEREST_RATES,
        value: numFormat(highlights.data.opr.callout, "compact", [2, 2]) + "%",
      },
      {
        icon: <UnemploymentIcon className="h-5 w-5" />,
        title: t("home.section_1.stats.unemployment"),
        url: routes.LABOUR_MARKET,
        value: numFormat(highlights.data.unemployment.callout, "compact", [1, 1]) + "%",
      },
      {
        icon: <InflationIcon className="h-5 w-5" />,
        title: t("home.section_1.stats.inflation"),
        url: routes.CONSUMER_PRICES,
        value: numFormat(highlights.data.inflation.callout, "compact", [1, 1]) + "%",
      },
      {
        icon: <ProductionIcon className="h-5 w-5" />,
        title: t("home.section_1.stats.production_cost"),
        url: routes.PRODUCER_PRICES,
        value:
          yieldPrefix(highlights.data.ppi.callout) +
          numFormat(highlights.data.ppi.callout, "compact", [1, 1]) +
          "%",
      },
      {
        icon: <IndustryIcon className="h-4 w-4" />,
        title: t("home.section_1.stats.industrial_production"),
        url: routes.INDUSTRIAL_PRODUCTION,
        value:
          yieldPrefix(highlights.data.ipi.callout) +
          numFormat(highlights.data.ipi.callout, "compact", [1, 1]) +
          "%",
      },
      {
        icon: <RetailTradeIcon className="h-5 w-5" />,
        title: t("home.section_1.stats.wholesale_retail"),
        url: routes.WHOLESALE_RETAIL,
        value:
          yieldPrefix(highlights.data.iowrt.callout) +
          numFormat(highlights.data.iowrt.callout, "compact", [1, 1]) +
          "%",
      },
    ],
    []
  );

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "home",
      name_en: "Home",
      name_bm: "Utama",
      route: routes.HOME,
    });
  }, []);

  return (
    <>
      <Metadata keywords={"opendosm data negara inflasi"} />

      <Hero
        background="home-banner"
        className="relative flex min-h-[300px] flex-col items-center justify-center text-left md:text-center"
      >
        <h3 className="mb-3">{t("home.title")}</h3>
        <p className="max-w-3xl text-dim">{t("home.description")}</p>
      </Hero>
      <Container className="min-h-screen">
        <Section title={t("home.section_1.title")}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {STATS.map(({ icon, title, value, url }: StatProps) => (
              <div className="flex gap-5" key={url}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-outline">
                  {icon}
                </div>
                <div>
                  <At
                    href={url}
                    className="relative flex flex-wrap items-start gap-x-2 text-sm font-medium uppercase text-dim transition-all hover:text-black hover:underline"
                  >
                    <span>{title}</span>
                    <ArrowTopRightOnSquareIcon className="absolute -right-6 h-4 w-4" />
                  </At>

                  <h3 className="font-medium">{value}</h3>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section
          title={t("home.section_2.title")}
          description={t("home.section_2.description")}
          date={analytics.data_as_of}
        >
          <Tabs>
            {PANELS.map((panel, index) => (
              <Panel name={panel.name as string} key={index}>
                <div className="grid grid-cols-2 gap-6 py-6 lg:grid-cols-4">
                  <Card className="flex h-full flex-col justify-between space-y-3">
                    <h4 className="flex gap-3 text-base">{t("home.section_2.dashboards")}</h4>
                    <h3 className="font-medium">16</h3>
                  </Card>
                  <Card className="flex h-full flex-col justify-between space-y-3">
                    <h4 className="flex gap-3 text-base">
                      {t("home.section_2.datasets_available")}
                    </h4>
                    <h3 className="font-medium">
                      {numFormat(analytics.total.catalogue, "standard")}
                    </h3>
                  </Card>
                  <Card className="flex h-full flex-col justify-between space-y-3">
                    <h4 className="flex gap-3 text-base">{t("home.section_2.resource_views")}</h4>
                    <h3 className="font-medium">
                      {numFormat(
                        panel.data.resource_views,
                        windowWidth > BREAKPOINTS.MD ? "standard" : "compact",
                        2
                      )}
                    </h3>
                  </Card>
                  <Card className="flex h-full flex-col justify-between space-y-3">
                    <h4 className="flex gap-3 text-base">
                      {t("home.section_2.resource_downloads")}
                    </h4>
                    <h3 className="font-medium">
                      {numFormat(
                        panel.data.resource_downloads,
                        windowWidth > BREAKPOINTS.MD ? "standard" : "compact",
                        2
                      )}
                    </h3>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="space-y-3">
                    <Ranking
                      type="dashboard"
                      ranks={panel.data.dashboard_views}
                      title={["🔥", t("home.section_2.top_dashboards")]}
                      icon={<EyeIcon className="h-4 w-4" />}
                    />
                  </Card>
                  <Card className="space-y-3">
                    <Ranking
                      type={"catalogue"}
                      ranks={panel.data.dataset_views}
                      title={["🔥", t("home.section_2.top_catalogues")]}
                      icon={<EyeIcon className="h-4 w-4" />}
                    />
                  </Card>
                  <Card className="space-y-3">
                    <Ranking
                      type={"catalogue"}
                      ranks={panel.data.dataset_downloads}
                      title={["🔢", t("home.section_2.top_files")]}
                      icon={<DocumentArrowDownIcon className="h-4 w-4" />}
                    />
                  </Card>
                  <Card className="space-y-3">
                    <Ranking
                      type={"catalogue"}
                      ranks={panel.data.graphic_downloads}
                      title={["📊", t("home.section_2.top_images")]}
                      icon={<DocumentArrowDownIcon className="h-4 w-4" />}
                    />
                  </Card>
                </div>
              </Panel>
            ))}
          </Tabs>
        </Section>
        <Section title={t("home.section_3.title")} date={timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <Timeseries
              className="h-[350px] w-full"
              title={t("home.keys.views")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.views,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    label: t("home.keys.views") as string,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                ],
              }}
              stats={yieldCallout("views")}
            />
            <Timeseries
              className="h-[350px] w-full"
              title={t("home.keys.users")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.users,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    label: t("home.keys.users") as string,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                ],
              }}
              stats={yieldCallout("users")}
            />
            <Timeseries
              className="h-[350px] w-full"
              title={t("home.keys.downloads")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.downloads,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    label: t("home.keys.downloads") as string,
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
            className="pt-12"
            type="range"
            value={data.minmax}
            data={timeseries.data.x}
            onChange={e => setData("minmax", e)}
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
};
interface RankingProps {
  type: "catalogue" | "dashboard";
  title: [icon: ReactNode, title: ReactNode];
  ranks: RankItem[];
  icon: ReactNode;
}

const Ranking = ({ title, ranks, type = "catalogue", icon }: RankingProps) => {
  const { i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];

  return (
    <>
      <h4 className="flex gap-3 text-base">
        <span>{title[0]}</span>
        {title[1]}
      </h4>
      <ol className="list-inside space-y-3">
        {ranks.map((item: RankItem, index: number) => (
          <li className="flex items-start justify-between" key={item.id}>
            <At
              href={type === "catalogue" ? `/data-catalogue/${item.id}` : item.id}
              className="flex gap-5"
            >
              <span className="text-dim">{index + 1}</span>
              <span className="hover:underline">{item[`name_${lang}`]}</span>
            </At>
            <p className="flex items-center gap-2">
              {icon}
              <span>{numFormat(item.count, "compact", 2)}</span>
            </p>
          </li>
        ))}
      </ol>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  const { data } = await get("/dashboard", { dashboard: "homepage" });

  return {
    props: {
      ...i18n,
      timeseries_callouts: data.statistics,
      timeseries: data.timeseries,
      highlights: data.highlight,
      analytics: {
        data_as_of: data.table_summary.data_as_of,
        today: {
          resource_views: data.metrics_stats.data.today.resource_views.count,
          resource_downloads: data.metrics_stats.data.today.resource_downloads.count,
          ...data.table_summary.data.today,
        },
        last_month: {
          resource_views: data.metrics_stats.data.last_month.resource_views.count,
          resource_downloads: data.metrics_stats.data.last_month.resource_downloads.count,
          ...data.table_summary.data.last_month,
        },
        all_time: {
          resource_views: data.metrics_stats.data.all_time.resource_views.count,
          resource_downloads: data.metrics_stats.data.all_time.resource_downloads.count,
          ...data.table_summary.data.all_time,
        },
        total: {
          catalogue: data.total_catalog,
        },
      },
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default Home;
