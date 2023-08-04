import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import InternetPenetrationDashboard from "@dashboards/digitalisation/internet-penetration";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

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
