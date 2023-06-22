import { Metadata } from "datagovmy-ui/components";
import MoneySupplyDashboard from "@dashboards/money-supply";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "datagovmy-ui/hooks";

import { withi18n } from "datagovmy-ui/decorators";

const MoneySupply = ({
  last_updated,
  table_summary,
  timeseries,
  timeseries_callouts,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.money_supply")}
        description={t("moneysupply.description")}
        keywords={""}
      />
      <MoneySupplyDashboard
        last_updated={last_updated}
        table_summary={table_summary}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  const { data } = await get("/dashboard", { dashboard: "money_measures" });

  return {
    props: {
      meta: {
        id: "dashboard-money-supply",
        type: "dashboard",
        category: "financial-sector",
        agency: "BNM",
      },
      last_updated: new Date().valueOf(),
      table_summary: data.table_summary,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
  };
});

export default MoneySupply;
