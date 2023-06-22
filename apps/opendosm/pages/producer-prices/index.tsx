import { Metadata } from "datagovmy-ui/components";
import ProducerPricesDashboard from "@dashboards/producer-prices";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "datagovmy-ui/hooks";

import { withi18n } from "datagovmy-ui/decorators";

const ProducerPrices = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.producer_prices")}
        description={t("producer_prices.description")}
        keywords={""}
      />
      <ProducerPricesDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  // const { data } = await get("/dashboard", { dashboard: "producer_price_index" });

  return {
    notFound: true,
    props: {
      meta: {
        id: "dashboard-producer-prices",
        type: "dashboard",
        category: "economy",
        agency: "DOSM",
      },
      // last_updated: new Date().valueOf(),
      // timeseries: data.timeseries,
      // timeseries_callouts: data.statistics,
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default ProducerPrices;
