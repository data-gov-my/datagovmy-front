import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import GovernmentSiteTrackerDashboard from "@dashboards/digitalisation/government-site-tracker";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

/**
 * Govt Site Tracker Dashboard
 * @overview Status: In-development. Slated for future release.
 */

const GovernmentSiteTracker: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-government-site-tracker", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GovernmentSiteTrackerDashboard />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-government-site-tracker",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
      props: {
        meta: {
          id: "dashboard-government-site-tracker",
          type: "dashboard",
          category: "digitalisation",
          agency: "MAMPU",
        },
      },
    };
  }
);

export default GovernmentSiteTracker;
