import Metadata from "@components/Metadata";
import MoneySupplyDashboard from "@dashboards/financial-sector/money-supply";
import { get } from "@lib/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";

const MoneySupply = ({
  last_updated,
  table_summary,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-money-supply", "common"]);

  return (
    <>
      <Metadata
        title={t("common:nav.megamenu.dashboards.money_supply")}
        description={t("description")}
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

export const getStaticProps: GetStaticProps = withi18n("dashboard-money-supply", async () => {
  const { data } = await get("/dashboard", { dashboard: "money_measures" });

  return {
    notFound: false,
    props: {
      last_updated: new Date().valueOf(),
      table_summary: data.table_summary,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
  };
});

export default MoneySupply;
