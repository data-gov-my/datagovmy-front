import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
// import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import EmergencyResponseDashboard from "@dashboards/healthcare/emergency-response";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const EmergencyResponse: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-emergency-response", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("dashboard-emergency-response:header")}
        description={t("dashboard-emergency-response:description")}
        keywords={""}
      />
      <EmergencyResponseDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-emergency-response", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "emergency-response" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-emergency-response",
        type: "dashboard",
        category: "healthcare",
        agency: "KKM",
      },
    },
  };
});

export default EmergencyResponse;
