import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import InternetPenetrationDashboard from "@dashboards/digitalisation/internet-penetration";
import { withi18n } from "@lib/decorators";

const InternetPenetration: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-internet-penetration", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
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
