import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ExchangeRatesDashboard from "@dashboards/economy/exchange-rates";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const ExchangeRates: Page = ({
  meta,
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-exchange-rates", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ExchangeRatesDashboard
        last_updated={last_updated}
        bar={bar}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-exchange-rates", async () => {
  const { data } = await get("/dashboard", { dashboard: "exchange_rates" });

  return {
    props: {
      meta: {
        id: "dashboard-exchange-rates",
        type: "dashboard",
        category: "economy",
        agency: "MAMPU",
      },
      last_updated: data.data_last_updated,
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
  };
});

export default ExchangeRates;
