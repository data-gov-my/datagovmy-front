import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import PublicContractingDashboard from "@dashboards/public-finances/public-contracting";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

/**
 * Public Contracting Dashboard
 * @overview Status: In-development. Slated for future release.
 */

const PublicContracting: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-public-contracting", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PublicContractingDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-public-contracting", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
    props: {
      meta: {
        id: "dashboard-public-contracting",
        type: "dashboard",
        category: "public-finances",
        agency: "MoF",
      },
    },
  };
});

export default PublicContracting;
