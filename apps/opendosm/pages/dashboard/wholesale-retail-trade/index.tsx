import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import WholesaleRetailDashboard from "@dashboards/wholesale-retail";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const WholesaleRetail: Page = ({
  meta,
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-wholesale-retail"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <WholesaleRetailDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-wholesale-retail", async () => {
  const { data } = await get("/dashboard", { dashboard: "wholesale_retail_trade" });

  return {
    props: {
      meta: {
        id: "dashboard-wholesale-retail",
        type: "dashboard",
        category: "economy",
        agency: "DOSM",
      },
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default WholesaleRetail;
