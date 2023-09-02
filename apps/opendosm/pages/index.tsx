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
import { WindowContext } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { clx, numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import {
  UsersIcon,
  EconomicGrowthIcon,
  BankIcon,
  IndustryIcon,
  ProductionIcon,
  RetailTradeIcon,
  UnemploymentIcon,
  InflationIcon,
} from "../icons";
import { AgencyIcon, DOSMIcon } from "datagovmy-ui/icons/agency";
import { Agency, Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ReactNode, useContext, useMemo } from "react";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

const Home: Page = ({
  // highlights,
  timeseries,
  timeseries_callouts,
  analytics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { size } = useContext(WindowContext);
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
          yieldPrefix(timeseries_callouts.data[key].callout1) +
          numFormat(timeseries_callouts.data[key].callout1, "standard"),
      },
      {
        title: t("total"),
        value: numFormat(timeseries_callouts.data[key].callout2, "standard"),
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
  }

  const STATS = useMemo<StatProps[]>(
    () => [
      {
        icon: <UsersIcon className="h-6 w-6" />,
        title: t("stats.population"),
        url: routes.KAWASANKU,
        value: numFormat(
          33_400_000, //highlights.data.population.callout,
          "compact",
          1,
          "long",
          i18n.language,
          true
        ),
      },
      {
        icon: <EconomicGrowthIcon className="h-5 w-5" />,
        title: t("stats.economic_growth"),
        url: routes.GDP,
        value:
          numFormat(
            2.9, //highlights.data.growth.callout,
            "compact",
            1
          ) + "%",
      },
      {
        icon: <BankIcon className="h-4 w-4" />,
        title: t("stats.bnm_opr"),
        url: `https://data.gov.my/${
          i18n.language === "ms-MY" ? "ms-MY/" : ""
        }dashboard/interest-rates`,
        value:
          numFormat(
            3, //highlights.data.opr.callout,
            "compact",
            2
          ) + "%",
      },
      {
        icon: <UnemploymentIcon className="h-5 w-5" />,
        title: t("stats.unemployment"),
        url: routes.LABOUR_MARKET,
        value:
          numFormat(
            3.4, //highlights.data.unemployment.callout,
            "compact",
            1
          ) + "%",
      },
      {
        icon: <InflationIcon className="h-5 w-5" />,
        title: t("stats.inflation"),
        url: routes.CONSUMER_PRICES,
        value:
          numFormat(
            2.4, //highlights.data.inflation.callout,
            "compact",
            1
          ) + "%",
      },
      {
        icon: <ProductionIcon className="h-5 w-5" />,
        title: t("stats.production_cost"),
        url: routes.PRODUCER_PRICES,
        value:
          yieldPrefix(-4.8) + //highlights.data.ppi.callout) +
          numFormat(
            -4.8, //highlights.data.ppi.callout,
            "compact",
            1
          ) +
          "%",
      },
      {
        icon: <IndustryIcon className="h-4 w-4" />,
        title: t("stats.industrial_production"),
        url: routes.INDUSTRIAL_PRODUCTION,
        value:
          yieldPrefix(-2.2) + //highlights.data.ipi.callout) +
          numFormat(
            -2.2, //highlights.data.ipi.callout,
            "compact",
            1
          ) +
          "%",
      },
      {
        icon: <RetailTradeIcon className="h-5 w-5" />,
        title: t("stats.wholesale_retail"),
        url: routes.WHOLESALE_RETAIL,
        value:
          yieldPrefix(3.1) + //highlights.data.iowrt.callout) +
          numFormat(
            3.1, //highlights.data.iowrt.callout,
            "compact",
            1
          ) +
          "%",
      },
    ],
    []
  );

  // useEffect(() => {
  //   track("page_view", {
  //     type: "dashboard",
  //     id: "home",
  //     name_en: "Home",
  //     name_bm: "Utama",
  //     route: routes.HOME,
  //   });
  // }, []);

  return (
    <>
      <Metadata keywords={"opendosm data negara inflasi"} />

      <Hero
        background={clx(
          theme === undefined && "blue",
          theme === "light" && "home-banner",
          theme === "dark" && "home-banner-dark"
        )}
        category={[t("category"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge name={t("agencies:dosm.full")} icon={<DOSMIcon />} />}
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
            <At className="btn px-3 py-1.5 text-sm" href="/publications/browse" enableIcon>
              {t("common:nav.publications")}
            </At>
          </div>
        }
      />

      <Container className="min-h-screen">
        <Section title={t("at_a_glance")}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {STATS.map(({ icon, title, value, url }: StatProps) => (
              <div className="flex gap-5" key={url}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-outline dark:bg-washed-dark">
                  {icon}
                </div>
                <div>
                  <At
                    href={url}
                    className="relative flex flex-wrap items-start gap-x-2 text-sm font-medium uppercase text-dim transition-all [text-underline-position:from-font] hover:text-black hover:underline dark:hover:text-white"
                  >
                    <span>{title}</span>
                    <ArrowTopRightOnSquareIcon className="absolute -right-6 h-4 w-4" />
                  </At>

                  <p className="text-2xl font-medium">{value}</p>
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
                <Ranking ranks={panel.data.dashboard_views} />
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
                <Ranking ranks={panel.data.dataset_views} />
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
  agency_abbr: Agency;
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
                <AgencyIcon agency={item.agency_abbr} className="h-6 w-6" />
                <p className="text-sm text-dim">{t(`agencies:${item.agency_abbr}.abbr`)}</p>
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
  const { data } = await get("/dashboard/", { dashboard: "homepage" });

  return {
    props: {
      meta: {
        id: "home",
        type: "misc",
        category: null,
        agency: null,
      },
      timeseries_callouts: data.statistics,
      timeseries: data.timeseries,
      // highlights: data.highlight,
      analytics: {
        data_as_of: data.table_summary.data_as_of,
        today: data.table_summary.data.today,
        all_time: data.table_summary.data.all_time,
      },
    },
  };
});

export default Home;
