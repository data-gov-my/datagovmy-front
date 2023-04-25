import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ExchangeRatesDashboard from "@dashboards/economy/exchange-rates";
import { withi18n } from "@lib/decorators";

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
        title={t("common:nav.megamenu.dashboards.exchange_rate")}
        description={t("description")}
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

export const getStaticProps: GetStaticProps = withi18n("dashboard-exchange-rate", async () => {
  const { data } = await get("/dashboard", { dashboard: "exchange_rates" });

  return {
    props: {
      last_updated: new Date().valueOf(),
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default ExchangeRates;
