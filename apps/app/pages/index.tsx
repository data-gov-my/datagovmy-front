import AgencyBadge from "@components/AgencyBadge";
import At from "@components/At";
import Card from "@components/Card";
import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import Container from "@components/Container";
import Hero from "@components/Hero";
import Metadata from "@components/Metadata";
import Section from "@components/Section";
import Tabs from "@components/Tabs";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AKSARA_COLOR, SHORT_LANG } from "@lib/constants";
import { withi18n } from "@lib/decorators";
import { numFormat } from "@lib/helpers";
import type { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const Home: Page = ({
  highlights,
  timeseries,
  timeseries_callouts,
  analytics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t, i18n } = useTranslation();

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
      name: t("common:home.section_2.past_month"),
      data: analytics.last_month,
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
        description={
          <div className="space-y-6">
            <p className="text-dim xl:w-2/3">{t("common:home.description")}</p>
            <div className="flex flex-wrap gap-3">
              <At className="btn btn-primary text-sm" href="/dashboard" enableIcon>
                {t("common:nav.dashboards")}
              </At>
              <At className="btn btn-default text-sm" href="/data-catalogue" enableIcon>
                {t("common:nav.catalogue")}
              </At>
              <At className="btn text-sm" href="#" enableIcon>
                API Docs
              </At>
            </div>
          </div>
        }
        agencyBadge={
          <AgencyBadge
            prefixThe
            agency={t("common:agency.govt")}
            link="https://www.malaysia.gov.my/portal/index"
            icon={
              <Image src={"/static/images/jata_logo.png"} width={28} height={28} alt="Jata Logo" />
            }
          />
        }
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
                    className="h-[200px] w-full"
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
                    className="h-[200px] w-full"
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
                    className="h-[200px] w-full"
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
  agency_abbr: string;
};
interface RankingProps {
  ranks: RankItem[];
}

const Ranking = ({ ranks }: RankingProps) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {ranks.map((item: RankItem) => (
          <At href={item.id} key={item.id}>
            <Card className="border-outline hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark group w-full space-y-3 rounded-xl border p-3 transition-colors">
              <div className="relative flex items-center gap-4">
                <div className="bg-outline h-4 w-4 rounded-full" />
                <p className="text-dim text-sm uppercase">{item.agency_abbr}</p>
                <ArrowUpRightIcon className="text-dim absolute right-1 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
              <div className="relative overflow-hidden">
                <p
                  className="truncate font-medium dark:text-white"
                  title={item[`name_${lang as "en" | "bm"}`]}
                >
                  {item[`name_${lang as "en" | "bm"}`]}
                </p>
                <p className="text-dim transition-transform group-hover:translate-y-6">
                  {numFormat(item.count, "compact")} {t("common:common.views")}
                </p>
                <p className="text-primary dark:text-primary-dark absolute -bottom-6 transition-transform group-hover:-translate-y-6">
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

// track("page_view", {
//   type: "dashboard",
//   id: "home",
//   name_en: "Home",
//   name_bm: "Utama",
//   route: routes.HOME,
// });

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
        last_month: {
          dataset: data.table_summary.data.last_month.dataset_views,
          dashboard: data.table_summary.data.last_month.dashboard_views,
        },
        all_time: {
          dataset: data.table_summary.data.all_time.dataset_views,
          dashboard: data.table_summary.data.all_time.dataset_views,
        },
        total: {
          catalogue: data.total_catalog,
        },
      },
    },
  };
});

export default Home;
