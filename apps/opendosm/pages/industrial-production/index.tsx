import { Metadata } from "datagovmy-ui/components";
import IndustrialProductionDashboard from "@dashboards/industrial-production";
import { get } from "datagovmy-ui/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "datagovmy-ui/hooks";

import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const IndustrialProduction = ({
  meta,
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-industrial-production"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <IndustrialProductionDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-industrial-production",
  async () => {
    // const { data } = await get("/dashboard", { dashboard: "industrial_production" });

    return {
      props: {
        meta: {
          id: "dashboard-indusrial-production",
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
  }
);

export default IndustrialProduction;
