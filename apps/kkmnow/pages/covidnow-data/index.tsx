/**
 * CovidNow Data Page <Index>
 */
import { Metadata } from "@components/index";
import CovidNowDashboard from "@dashboards/covidnow-data";
import { get } from "@lib/api";
import { sortMsiaFirst } from "@lib/helpers";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CovidNowDataIndex: Page = ({
  last_updated,
  timeseries,
  heatmap,
  barmeter,
  choropleth_malaysia,
  choropleth_world,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const final = heatmap.data.map((item: any) => {
    return {
      ...item,
      id: t(`covidnow.days.${item.id}`),
    };
  });
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.covidnow_data")}
        description={t("covidnow.title_description")}
        keywords={""}
      />

      <CovidNowDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        heatmap={{
          data_as_of: heatmap.data_as_of,
          data: final,
        }}
        barmeter={barmeter}
        choropleth_malaysia={choropleth_malaysia}
        choropleth_world={choropleth_world}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "covid_now" }); // fetch static data here
  data.choropleth_malaysia.data = sortMsiaFirst(data.choropleth_malaysia.data, "state");

  const sortingArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  data.heatmap.data = Object.values(data.heatmap.data).sort((a: any, b: any) => {
    return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id);
  });
  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      heatmap: data.heatmap,
      barmeter: data.bar_chart,
      choropleth_malaysia: data.choropleth_malaysia,
      choropleth_world: data.choropleth_world,
    },
    revalidate: 300,
  };
};

export default CovidNowDataIndex;
