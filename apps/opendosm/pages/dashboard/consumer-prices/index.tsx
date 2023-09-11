import ConsumerPricesDashboard from "@dashboards/consumer-prices";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { GetStaticProps, InferGetServerSidePropsType } from "next";

const ConsumerPrices = ({
  meta,
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
  choropleth,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-consumer-prices", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ConsumerPricesDashboard
        last_updated={last_updated}
        bar={bar}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
        choropleth={choropleth}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-consumer-prices", async () => {
  const { data } = await get("/dashboard", { dashboard: "consumer_price_index" });

  return {
    props: {
      meta: {
        id: "dashboard-consumer-prices",
        type: "dashboard",
        category: "economy",
        agency: "DOSM",
      },
      last_updated: data.data_last_updated,
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
      choropleth: data.choropleth_district,
    },
  };
});

export default ConsumerPrices;
