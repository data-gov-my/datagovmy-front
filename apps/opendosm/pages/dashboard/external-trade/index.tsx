import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import ExternalTradeDashboard from "@dashboards/external-trades";

const ExternalTrade: Page = ({
  last_updated,
  meta,
  timeseries,
  indices_timeseries,
  timeseries_callout,
  indices_timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-external-trade", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ExternalTradeDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        indices_timeseries={indices_timeseries}
        indices_timeseries_callout={indices_timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-external-trade", async ({}) => {
  const { data } = await get("/dashboard", { dashboard: "trade" });

  return {
    props: {
      meta: {
        id: "dashboard-external-trade",
        type: "dashboard",
        category: "trade",
        agency: "DOSM",
      },
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      indices_timeseries: data.indices_timeseries,
      timeseries_callout: data.timeseries_callout,
      indices_timeseries_callout: data.indices_timeseries_callout,
    },
  };
});

export default ExternalTrade;
