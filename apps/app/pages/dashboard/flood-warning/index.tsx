import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import FloodWarningDashboard from "@dashboards/environment/flood-warning";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

/**
 * Flood Warning Dashboard
 * @overview Status: In-development. Slated for future release.
 */

const FloodWarning: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-flood-warning", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <FloodWarningDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-flood-warning", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
    props: {
      meta: {
        id: "dashboard-flood-warning",
        type: "dashboard",
        category: "environment",
        agency: "JPS",
      },
    },
  };
});

export default FloodWarning;
