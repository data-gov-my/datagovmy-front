import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import CurrencyInCirculationDashboard from "@dashboards/financial-sector/currency-in-circulation";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const CurrencyInCirculation: Page = ({
  meta,
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-currency-in-circulation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CurrencyInCirculationDashboard
        last_updated={last_updated}
        bar={bar}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-currency-in-circulation",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
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
    };
  }
);

export default CurrencyInCirculation;
