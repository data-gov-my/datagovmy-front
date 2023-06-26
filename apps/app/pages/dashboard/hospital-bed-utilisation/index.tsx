import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import HospitalBedUtilisationDashboard from "@dashboards/healthcare/hospital-bed-utilisation";
import { withi18n } from "@lib/decorators";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const HospitalBedUtilisation: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-hospital-bed-utilisation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <HospitalBedUtilisationDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-hospital-bed-utilisation",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-hospital-bed-utilisation",
          type: "dashboard",
          category: "healthcare",
          agency: "KKM",
        },
      },
    };
  }
);

export default HospitalBedUtilisation;
