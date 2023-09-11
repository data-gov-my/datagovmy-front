import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import CrimeDashboard from "@dashboards/public-safety/crime";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

/**
 * Crime Dashboard
 * @overview Status: In-development. Slated for future release.
 */

const Crime: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-crime", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CrimeDashboard />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-crime", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
    props: {
      meta: {
        id: "dashboard-crime",
        type: "dashboard",
        category: "public-safety",
        agency: "PDRM",
      },
    },
  };
});

export default Crime;
