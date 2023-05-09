import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import PovertyDashboard from "@dashboards/economy/poverty";
import { withi18n } from "@lib/decorators";

const Poverty: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-poverty", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PovertyDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-poverty", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-poverty",
        type: "dashboard",
        category: "economy",
        agency: "ICU JPM",
      },
    },
  };
});

export default Poverty;
