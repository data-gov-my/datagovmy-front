import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";

import LabourMarketDashboard from "@dashboards/labour-market";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const Labour: Page = ({
  meta,
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-labour-market"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <LabourMarketDashboard
        last_updated={last_updated}
        bar={bar}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
        choropleth={choropleth}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-labour-market", async () => {
  const { data } = await get("/dashboard", { dashboard: "labour" });

  return {
    props: {
      meta: {
        id: "dashboard-labour-market",
        type: "dashboard",
        category: "economy",
        agency: "DOSM",
      },
      last_updated: data.data_last_updated,
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
      choropleth: data.choropleth_malaysia,
    },
  };
});

export default Labour;
