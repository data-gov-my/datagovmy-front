import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PovertyDashboard from "@dashboards/economy/poverty";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const Poverty: Page = ({
  choropleth,
  heatmap,
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-poverty", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PovertyDashboard
        choropleth={choropleth}
        heatmap={heatmap}
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-poverty", async () => {
  const { data } = await get("/dashboard", { dashboard: "poverty" });

  return {
    notFound: false,
    props: {
      last_updated: data.data_last_updated,
      meta: {
        id: "dashboard-poverty",
        type: "dashboard",
        category: "economy",
        agency: "ICU JPM",
      },
      choropleth: { state: data.choropleth_state, district: data.choropleth_district },
      heatmap: data.heatmap,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default Poverty;
