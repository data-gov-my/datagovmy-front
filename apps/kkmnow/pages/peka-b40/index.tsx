import { InferGetStaticPropsType, GetStaticProps } from "next";
import { get } from "@lib/api";
import { Page, ReactElement } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PekaB40Dashboard from "@dashboards/peka-b40";
import Metadata from "@components/Metadata";
import { useTranslation } from "next-i18next";
import { StateDropdown, StateModal } from "@components/index";
import Layout from "@components/Layout";
import { routes } from "@lib/routes";
import { JSXElementConstructor } from "react";

const PekaB40Index: Page = ({
  last_updated,
  timeseries_screenrate,
  heatmap_screenrate,
  bar_age,
  choropleth_malaysia_peka_b40,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.peka_b40")}
        description={t("peka.title_description")}
        keywords={""}
      />
      <PekaB40Dashboard
        last_updated={last_updated}
        timeseries_screenrate={timeseries_screenrate}
        heatmap_screenrate={heatmap_screenrate}
        bar_age={bar_age}
        choropleth_malaysia_peka_b40={choropleth_malaysia_peka_b40}
      />
    </>
  );
};

PekaB40Index.layout = (page: ReactElement<any, string | JSXElementConstructor<any>>) => (
  <Layout
    stateSelector={
      <StateDropdown url={routes.PEKA_B40} currentState={"mys"} exclude={["kvy"]} hideOnScroll />
    }
  >
    <StateModal url={routes.PEKA_B40} exclude={["kvy"]} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "peka_b40", state: "mys" });
  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries_screenrate: data.timeseries,
      heatmap_screenrate: data.heatmap_screenrate,
      bar_age: data.barchart_ages,
      choropleth_malaysia_peka_b40: data.choropleth_malaysia,
    },
    revalidate: 300,
  };
};

export default PekaB40Index;
