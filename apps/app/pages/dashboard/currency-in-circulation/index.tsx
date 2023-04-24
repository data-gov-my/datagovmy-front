import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CurrencyInCirculationDashboard from "@dashboards/financial-sector/currency-in-circulation";

const CurrencyInCirculation: Page = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common"]);

  return (
    <>
      <Metadata
        title={t("common:nav.megamenu.dashboards.currency_in_circulation")}
        description={t("description")}
        keywords={""}
      />
      <CurrencyInCirculationDashboard
        last_updated={last_updated}
        bar={bar}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, [
    "common",
    "dashboard-currency-in-circulation",
  ]);

  const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default CurrencyInCirculation;
