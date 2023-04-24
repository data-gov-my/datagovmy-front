import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ExchangeRatesDashboard from "@dashboards/economy/exchange-rates";
import nextI18nextConfig from "next-i18next.config";

const ExchangeRates: Page = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-exchange-rates", "common"]);

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.exchange_rate")}
        description={t("dashboard-exchange-rates:description")}
        keywords={""}
      />
      <ExchangeRatesDashboard
        last_updated={last_updated}
        bar={bar}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["dashboard-exchange-rates", "common"]);

  const { data } = await get("/dashboard", { dashboard: "exchange_rates" });

  return {
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

export default ExchangeRates;
