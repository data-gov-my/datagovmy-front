import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import ServicesProducerPricesDashboard from "@dashboards/services-producer-prices";

const ServicesProducerPrices: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-services-producer-prices", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ServicesProducerPricesDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-services-producer-prices",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "services_ppi" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-services-producer-prices",
          type: "dashboard",
          category: "producer-price",
          agency: "DOSM",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
      },
    };
  }
);

export default ServicesProducerPrices;
