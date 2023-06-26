import Metadata from "@components/Metadata";
import GDPDashboard from "@dashboards/economy/gdp";
import { get } from "@lib/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const GDP = ({
  meta,
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-gdp", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GDPDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-gdp", async () => {
  const { data } = await get("/dashboard", { dashboard: "gross_domestic_product" });

  return {
    props: {
      meta: {
        id: "dashboard-gdp",
        type: "dashboard",
        category: "economy",
        agency: "DOSM",
      },
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
  };
});

export default GDP;
