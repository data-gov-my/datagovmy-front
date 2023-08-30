import CompositeIndexDashboard from "@dashboards/composite-indices";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const CompositeIndices: Page = ({
  meta,
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-composite-index", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CompositeIndexDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-composite-index", async () => {
  const { data } = await get("/dashboard", { dashboard: "composite_indices" });

  return {
    props: {
      meta: {
        id: "dashboard-composite-index",
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

export default CompositeIndices;
