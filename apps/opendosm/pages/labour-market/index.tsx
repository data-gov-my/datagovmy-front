import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import LabourMarketDashboard from "@dashboards/labour-market";
import { useTranslation } from "@hooks/useTranslation";

const Labour: Page = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.labour_market")}
        description={t("organ.title_description")}
        keywords={""}
      />
      <LabourMarketDashboard
        last_updated={last_updated}
        bar={bar}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
        choropleth={choropleth}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard", { dashboard: "labour" });

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
      choropleth: data.choropleth_malaysia,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default Labour;
