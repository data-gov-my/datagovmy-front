import IncomeTaxationDashboard from "@dashboards/economy/income-taxation";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const IncomeTaxation: Page = ({
  last_updated,
  meta,
  stacked_bar,
  timeseries,
  timeseries_callout,
  year,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-income-taxation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <WindowProvider>
        <IncomeTaxationDashboard
          last_updated={last_updated}
          stacked_bar={stacked_bar}
          timeseries={timeseries}
          timeseries_callout={timeseries_callout}
          year={year}
        />
      </WindowProvider>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-income-taxation", async () => {
  const { data } = await get("/dashboard", {
    dashboard: "income_tax",
    variable: "tax",
    state: "mys",
    type: "all",
    age: "all",
  });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-income-taxation",
        type: "dashboard",
        category: "economy",
        agency: "LHDN",
      },
      year: Number(data.tax_percentile.data_as_of.substring(0, 4)) - 1,
      last_updated: data.data_last_updated,
      stacked_bar: data.stacked_bar,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default IncomeTaxation;
