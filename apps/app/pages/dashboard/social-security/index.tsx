import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import SocialSecurityDashboard from "@dashboards/economy/social-security";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const SocialSecurity: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-social-security", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <SocialSecurityDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-social-security", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-social-security",
        type: "dashboard",
        category: "economy",
        agency: "PERKESO",
      },
    },
  };
});

export default SocialSecurity;
