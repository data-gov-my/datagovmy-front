import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import ServicesStatisticsDashboard from "@dashboards/services-statistics";

const ServicesStatistics: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-services-statistics", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ServicesStatisticsDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        meta={meta}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-services-statistics",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "service_statistics" });

    return {
      props: {
        meta: {
          id: "dashboard-services-statistics",
          type: "dashboard",
          category: "services",
          agency: "DOSM",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
      },
    };
  }
);

export default ServicesStatistics;
