import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PovertyDashboard from "@dashboards/economy/poverty";
import { withi18n } from "@lib/decorators";

const Poverty: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-poverty"]);

  return (
    <>
      <Metadata
        title={t("dashboard-poverty:header")}
        description={t("dashboard-poverty:description")}
        keywords={""}
      />
      <PovertyDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-poverty", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {},
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default Poverty;
