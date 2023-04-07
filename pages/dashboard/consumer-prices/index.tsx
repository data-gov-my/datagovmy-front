import Metadata from "@components/Metadata";
import ConsumerPricesDashboard from "@dashboards/economy/consumer-prices";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ConsumerPrices = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
  choropleth,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-consumer-prices"]);

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.consumer_prices")}
        description={t("dashboard-consumer-prices:description")}
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
  const i18n = await serverSideTranslations(
    locale!,
    ["common", "dashboard-consumer-prices"],
    null,
    ["en-GB", "ms-MY"]
  );

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
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default ConsumerPrices;
