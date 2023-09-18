import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import LabourProductivityDashboard from "@dashboards/labour-productivity";

const LabourProductivity: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-labour-productivity", "common"]);
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <LabourProductivityDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-labour-productivity",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "labour_productivity" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-labour-productivity",
          type: "dashboard",
          category: "labour-markets",
          agency: "DOSM",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
      },
    };
  }
);

export default LabourProductivity;
