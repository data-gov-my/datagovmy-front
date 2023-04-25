import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import InternetPenetrationDashboard from "@dashboards/digitalisation/internet-penetration";
import { withi18n } from "@lib/decorators";

const InternetPenetration: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-internet-penetration"]);

  return (
    <>
      <Metadata
        title={t("dashboard-internet-penetration:header")}
        description={t("dashboard-internet-penetration:description")}
        keywords={""}
      />
      <InternetPenetrationDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-internet-penetration",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {},
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default InternetPenetration;
