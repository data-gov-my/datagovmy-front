import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";

import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import ExchangeRatesDashboard from "@dashboards/exchange-rates";
import { withi18n } from "datagovmy-ui/decorators";

const ExchangeRates: Page = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.exchange_rate")}
        description={t("exchangerate.description")}
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

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  const { data } = await get("/dashboard", { dashboard: "exchange_rates" });

  return {
    props: {
      meta: {
        id: "dashboard-exchange-rates",
        type: "dashboard",
        category: "economy",
        agency: "MAMPU",
      },
      last_updated: new Date().valueOf(),
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
  };
});

export default ExchangeRates;
