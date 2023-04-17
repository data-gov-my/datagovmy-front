import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import GovernmentSiteTrackerDashboard from "@dashboards/digitalisation/government-site-tracker";

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
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(
    locale!,
    ["common", "dashboard-government-site-tracker"],
    null,
    ["en-GB", "ms-MY"]
  );
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      ...i18n,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default GovernmentSiteTracker;
