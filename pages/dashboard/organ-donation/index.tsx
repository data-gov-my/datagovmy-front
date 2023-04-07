import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import OrganDonationDashboard from "@dashboards/healthcare/organ-donation";

const OrganDonation: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-organ-donation"]);

  return (
    <>
      <Metadata
        title={t("dashboard-organ-donation:header")}
        description={t("dashboard-organ-donation:description")}
        keywords={""}
      />
      <OrganDonationDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common", "dashboard-organ-donation"], null, [
    "en-GB",
    "ms-MY",
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

export default OrganDonation;
