import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import FloodWarningDashboard from "@dashboards/environment/flood-warning";
import { withi18n } from "@lib/decorators";

const FloodWarning: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-flood-warning", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <FloodWarningDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-flood-warning", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-flood-warning",
        type: "dashboard",
        category: "environment",
        agency: "JPS",
      },
    },
  };
});

export default FloodWarning;
