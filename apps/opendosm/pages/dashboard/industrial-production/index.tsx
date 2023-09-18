import IndustrialProductionDashboard from "@dashboards/industrial-production";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { GetStaticProps, InferGetServerSidePropsType } from "next";

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
    const { data } = await get("/dashboard", { dashboard: "industrial_production" });

    return {
      props: {
        meta: {
          id: "dashboard-industrial-production",
          type: "dashboard",
          category: "economy",
          agency: "DOSM",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        timeseries_callouts: data.statistics,
      },
    };
  }
);

export default IndustrialProduction;
