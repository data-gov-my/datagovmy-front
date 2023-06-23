import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import InternetPenetrationDashboard from "@dashboards/digitalisation/internet-penetration";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const InternetPenetration: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-internet-penetration", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <InternetPenetrationDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-internet-penetration",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-internet-penetration",
          type: "dashboard",
          category: "digitalisation",
          agency: "MCMC",
        },
      },
    };
  }
);

export default InternetPenetration;
