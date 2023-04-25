import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PublicPensionDashboard from "@dashboards/economy/public-pension";
import { withi18n } from "@lib/decorators";

const PublicPension: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-public-pension"]);

  return (
    <>
      <Metadata
        title={t("dashboard-public-pension:header")}
        description={t("dashboard-public-pension:description")}
        keywords={""}
      />
      <PublicPensionDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-public-pension", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {},
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default PublicPension;
