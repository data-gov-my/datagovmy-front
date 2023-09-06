import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import InternetPenetrationDashboard from "@dashboards/digitalisation/internet-penetration";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const InternetPenetration: Page = ({
  meta,
  last_updated,
  traffic_timeseries,
  traffic_timeseries_callout,
  penetration_timeseries,
  penetration_timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-internet-penetration", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <InternetPenetrationDashboard
        last_updated={last_updated}
        traffic_timeseries={traffic_timeseries}
        traffic_timeseries_callout={traffic_timeseries_callout}
        penetration_timeseries={penetration_timeseries}
        penetration_timeseries_callout={penetration_timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-internet-penetration",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "internet_penetration" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-internet-penetration",
          type: "dashboard",
          category: "digitalisation",
          agency: "MCMC",
        },
        last_updated: data.data_last_updated,
        traffic_timeseries: data.traffic_timeseries,
        traffic_timeseries_callout: data.traffic_timeseries_callout,
        penetration_timeseries: data.penetration_timeseries,
        penetration_timeseries_callout: data.penetration_timeseries_callout,
      },
    };
  }
);

export default InternetPenetration;
