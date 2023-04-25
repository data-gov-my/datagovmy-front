import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import GovernmentSiteTrackerDashboard from "@dashboards/digitalisation/government-site-tracker";
import { withi18n } from "@lib/decorators";

const GovernmentSiteTracker: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-government-site-tracker"]);

  return (
    <>
      <Metadata
        title={t("dashboard-government-site-tracker:header")}
        description={t("dashboard-government-site-tracker:description")}
        keywords={""}
      />
      <GovernmentSiteTrackerDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-government-site-tracker",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {},
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default GovernmentSiteTracker;
