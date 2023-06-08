import Metadata from "@components/Metadata";
import MoneySupplyDashboard from "@dashboards/money-supply";
import { get } from "@lib/api";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "@hooks/useTranslation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard", { dashboard: "money_measures" });

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      table_summary: data.table_summary,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default MoneySupply;
