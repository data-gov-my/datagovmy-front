import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import HospitalBedUtilisationDashboard from "@dashboards/healthcare/hospital-bed-utilisation";

const HospitalBedUtilisation: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-hospital-bed-utilisation", "common"]);

  return (
    <>
      <Metadata
        title={t("dashboard-hospital-bed-utilisation:header")}
        description={t("dashboard-hospital-bed-utilisation:description")}
        keywords={""}
      />
      <HospitalBedUtilisationDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, [
    "common",
    "dashboard-hospital-bed-utilisation",
  ]);
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      ...i18n,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default HospitalBedUtilisation;
