import { Metadata } from "datagovmy-ui/components";
import MoneySupplyDashboard from "@dashboards/financial-sector/money-supply";
import { get } from "datagovmy-ui/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const MoneySupply = ({
  meta,
  last_updated,
  table_summary,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-money-supply", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <MoneySupplyDashboard
        last_updated={last_updated}
        table_summary={table_summary}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-money-supply", async () => {
  const { data } = await get("/dashboard", { dashboard: "money_measures" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-money-supply",
        type: "dashboard",
        category: "financial-sector",
        agency: "BNM",
      },
      last_updated: data.data_last_updated,
      table_summary: data.table_summary,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
  };
});

export default MoneySupply;
