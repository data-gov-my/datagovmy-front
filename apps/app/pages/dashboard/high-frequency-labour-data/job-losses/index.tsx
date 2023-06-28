import Metadata from "@components/Metadata";
import LabourLossesDashboard from "@dashboards/economy/high-frequency-labour-data/job-losses";
import LabourLayout from "@dashboards/economy/high-frequency-labour-data/layout";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";

const LabourLosses: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-high-frequency-labour-data", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <LabourLayout last_updated={last_updated}>
        <LabourLossesDashboard timeseries={timeseries} timeseries_callout={timeseries_callout} />
      </LabourLayout>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-high-frequency-labour-data",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "perkeso" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-high-frequency-labour-data",
          type: "dashboard",
          category: "economy",
          agency: "PERKESO",
        },
        last_updated: data.data_last_updated,
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
      },
    };
  }
);

export default LabourLosses;
