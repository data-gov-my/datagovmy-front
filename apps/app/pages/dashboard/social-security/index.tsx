import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import SocialSecurityDashboard from "@dashboards/economy/social-security";
import { withi18n } from "@lib/decorators";

const SocialSecurity: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-social-security"]);

  return (
    <>
      <Metadata
        title={t("dashboard-social-security:header")}
        description={t("dashboard-social-security:description")}
        keywords={""}
      />
      <SocialSecurityDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-social-security", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {},
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default SocialSecurity;
