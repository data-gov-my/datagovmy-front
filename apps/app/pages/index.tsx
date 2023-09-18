import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
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
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { withi18n } from "datagovmy-ui/decorators";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { AgencyIcon } from "datagovmy-ui/icons/agency";
import { Agency, Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const Home: Page = ({
  timeseries,
  timeseries_callouts,
  analytics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
    tabs_section_1: 0,
    tabs_section_2: 0,
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const yieldPrefix = (value: number) => (value >= 0 ? "+" : "-");

  const yieldCallout = (key: string) => {
    return [
      {
        title: t("common:home.section_3.daily"),
        value:
          yieldPrefix(timeseries_callouts.data[key].callout1) +
          numFormat(timeseries_callouts.data[key].callout1, "standard"),
      },
      {
        title: t("common:home.section_3.total"),
        value: numFormat(timeseries_callouts.data[key].callout2, "standard"),
      },
    ];
  };

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
      <Metadata keywords={"data.gov.my data malaysia election prices harga"} />
      <Hero
        background="gray"
        category={[t("common:home.category"), "text-primary dark:text-primary-dark"]}
        header={[t("common:home.title")]}
        description={[t("common:home.description"), "text-dim"]}
        action={
          <div className="flex flex-wrap gap-3">
            <At className="btn-primary shadow-button text-sm" href="/dashboard" enableIcon>
              {t("common:nav.dashboards")}
            </At>
            <At
              className="btn btn-border active:bg-washed shadow-button bg-white px-3 py-1.5 text-sm text-black"
              href="/data-catalogue"
              enableIcon
            >
              {t("common:nav.catalogue")}
            </At>
            <At
              className="btn px-3 py-1.5 text-sm"
              href="https://developer.data.gov.my"
              enableIcon
              external
            >
              {t("common:nav.api_docs")}
            </At>
          </div>
        }
        agencyBadge={<AgencyBadge agency="govt" />}
      />

      <Container className="min-h-screen">
        <Section
          title={t("common:home.section_1.title")}
          description={t("common:home.section_1.description")}
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
          title={t("common:home.section_2.title")}
          description={t("common:home.section_2.description")}
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
        <Section title={t("common:home.section_3.title")} date={timeseries.data_as_of}>
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  <Timeseries
                    className="h-[300px] w-full"
                    title={t("common:home.keys.views")}
                    enableAnimation={!play}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.views,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          label: t("common:home.keys.views") as string,
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
                    title={t("common:home.keys.users")}
                    enableAnimation={!play}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.users,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: 1.5,
                          label: t("common:home.keys.users") as string,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={yieldCallout("users")}
                  />
                  <Timeseries
                    className="h-[300px] w-full"
                    title={t("common:home.keys.downloads")}
                    enableAnimation={!play}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.downloads,
                          borderColor: AKSARA_COLOR.PRIMARY,
                          label: t("common:home.keys.downloads") as string,
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
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
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
            <Card className="border-outline hover:border-outlineHover hover:bg-background dark:hover:bg-washed-dark/50 dark:border-washed-dark dark:hover:border-outlineHover-dark group w-full space-y-2 rounded-xl border p-3 transition-colors">
              <div className="relative flex items-center gap-3">
                <AgencyIcon agency={item.agency_abbr} className="h-6 w-6" />
                <p className="text-dim text-sm">{t(`agencies:${item.agency_abbr}.abbr`)}</p>
                <ArrowUpRightIcon className="text-dim absolute right-2 h-5 w-5 opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-2 group-hover:opacity-100 group-hover:duration-300" />
              </div>
              <div className="relative overflow-hidden">
                <p
                  className="truncate font-medium dark:text-white"
                  title={item[`name_${lang as "en" | "bm"}`]}
                >
                  {item[`name_${lang as "en" | "bm"}`]}
                </p>
                <p className="text-dim transition-transform group-hover:translate-y-6">
                  {`${numFormat(item.count, "compact")} ${t("common:common.views", {
                    count: item.count,
                  })}`}
                </p>
                <p className="text-primary dark:text-primary-dark absolute -bottom-6 whitespace-nowrap transition-transform group-hover:-translate-y-6 group-hover:duration-300">
                  {t("common:components.click_to_explore")}
                </p>
              </div>
            </Card>
          </At>
        ))}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  const { data } = await get("/dashboard", { dashboard: "homepage" });

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
      analytics: {
        data_as_of: data.table_summary.data_as_of,
        today: {
          dataset: data.table_summary.data.today.dataset_views,
          dashboard: data.table_summary.data.today.dashboard_views,
        },
        all_time: {
          dataset: data.table_summary.data.all_time.dataset_views,
          dashboard: data.table_summary.data.all_time.dashboard_views,
        },
        total: {
          catalogue: data.total_catalog,
        },
      },
    },
  };
});

export default Home;
