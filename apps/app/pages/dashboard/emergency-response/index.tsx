import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
// import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import EmergencyResponseDashboard from "@dashboards/healthcare/emergency-response";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const EmergencyResponse: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-emergency-response", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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
