import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import FormalSectorWagesDashboard from "@dashboards/formal-sector-wages";

const FormalSectorWages: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
  bar_bracket,
  bar_percentile,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-formal-sector-wages", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <FormalSectorWagesDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        bar_bracket={bar_bracket}
        bar_percentile={bar_percentile}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-formal-sector-wages",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "formal_wages" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-formal-sector-wages",
          type: "dashboard",
          category: "labour-markets",
          agency: "DOSM",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
        bar_bracket: data.bar_bracket,
        bar_percentile: data.bar_percentile,
      },
    };
  }
);

export default FormalSectorWages;
