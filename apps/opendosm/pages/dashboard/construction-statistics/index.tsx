import ConstructionStatisticsDashboard from "@dashboards/construction-statistics";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const ConstructionStatistics: Page = ({
  meta,
  last_updated,
  timeseries,
  timeseries_callout,
  projowner,
  projowner_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-construction-statistics", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ConstructionStatisticsDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        projowner={projowner}
        projowner_callout={projowner_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-construction-statistics",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "construction" });

    return {
      props: {
        meta: {
          id: "dashboard-construction-statistics",
          type: "dashboard",
          category: "construction",
          agency: "DOSM",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
        projowner: data.timeseries_projowner,
        projowner_callout: data.timeseries_projowner_callout,
      },
    };
  }
);

export default ConstructionStatistics;
