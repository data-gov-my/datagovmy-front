import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionExplorerDashboard from "@dashboards/democracy/election-explorer";
import { withi18n } from "@lib/decorators";

const ElectionExplorer: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-election-explorer"]);

  return (
    <>
      <Metadata
        title={t("dashboard-election-explorer:header")}
        description={t("dashboard-election-explorer:description")}
        keywords={""}
      />
      <ElectionExplorerDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  //   const { data } = await get("/dashboard", { dashboard: "currency" });

  return {
    notFound: false,
    props: {},
  };
});

export default ElectionExplorer;
