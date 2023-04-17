import AgencyBadge from "@components/AgencyBadge";
import At from "@components/At";
import Image from "next/image";
import Card from "@components/Card";
import Slider from "@components/Chart/Slider";
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
import { numFormat } from "@lib/helpers";
import type { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useEffect } from "react";

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

  useEffect(() => {
    // track("page_view", {
    //   type: "dashboard",
    //   id: "home",
    //   name_en: "Home",
    //   name_bm: "Utama",
    //   route: routes.HOME,
    // });
  }, []);

  return (
    <>
      <Metadata keywords={"opendosm data negara inflasi"} />

      <Hero
        background="gray"
        category={[t("home.category"), "text-primary dark:text-primary-dark"]}
        header={[t("home.title")]}
        description={
          <div className="space-y-6">
            <p className="text-dim xl:w-2/3">{t("home.description")}</p>
            <div className="flex flex-wrap gap-3">
              <At className="btn btn-primary text-sm" href="/dashboard" enableIcon>
                {t("nav.dashboards")}
              </At>
              <At className="btn btn-default text-sm" href="/data-catalogue" enableIcon>
                {t("nav.catalogue")}
              </At>
              <At className="btn text-sm" href="#" enableIcon>
                API Docs
              </At>
            </div>
          </div>
        }
        agencyBadge={
          <AgencyBadge
            agency={t("agency.govt")}
            link="https://www.malaysia.gov.my/portal/index"
            icon={
              <Image src={"/static/images/jata_logo.png"} width={28} height={28} alt="Jata Logo" />
            }
          />
        }
      />

      <Container className="min-h-screen">
        <Section
          title={"Explore out hottest dashboards"}
          description="Explore how you compare to the national data"
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
          title={"Study our most popular datasets"}
          description={
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore odio ut facere sunt recusandae quas delectus animi error nemo exercitationem aut rerum, sint quos labore nostrum. Tempore earum distinctio in!"
          }
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
        <Section title={t("home.section_3.title")} date={timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <Timeseries
              className="h-[200px] w-full"
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
              className="h-[200px] w-full"
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
              className="h-[200px] w-full"
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
            <Card className="group w-full space-y-3 rounded-xl border border-outline p-3 transition-colors hover:border-primary hover:bg-primary/5 dark:border-washed-dark dark:hover:border-outlineHover-dark">
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
                  {numFormat(item.count, "compact")} {t("common.views")}
                </p>
                <p className="absolute -bottom-6 text-primary transition-transform group-hover:-translate-y-6 dark:text-primary-dark">
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"], null, ["en-GB", "ms-MY"]);
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
