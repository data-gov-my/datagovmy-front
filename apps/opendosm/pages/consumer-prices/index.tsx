import { Metadata } from "datagovmy-ui/components";
import ConsumerPricesDashboard from "@dashboards/consumer-prices";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "datagovmy-ui/hooks";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ConsumerPrices = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
  choropleth,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.consumer_prices")}
        description={t("consumer_prices.description")}
        keywords={""}
      />
      <ConsumerPricesDashboard
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

  const { data } = await get("/dashboard", { dashboard: "consumer_price_index" });

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
      choropleth: data.choropleth_district,
    },
  };
};

export default ConsumerPrices;
