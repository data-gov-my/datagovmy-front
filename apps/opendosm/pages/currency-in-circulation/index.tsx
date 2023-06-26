import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import CurrencyInCirculationDashboard from "@dashboards/currency-in-circulation";
import { withi18n } from "datagovmy-ui/decorators";

const CurrencyInCirculation: Page = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.currency_in_circulation")}
        description={t("currencyincirculation.description")}
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

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    props: {
      meta: {
        id: "dashboard-currency-in-circulation",
        type: "dashboard",
        category: "financial-sector",
        agency: "BNM",
      },
      last_updated: new Date().valueOf(),
      bar: data.bar_chart,
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    // revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default CurrencyInCirculation;
