import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionExplorerDashboard from "@dashboards/democracy/election-explorer";

const ElectionExplorer: Page = ({ candidate }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-election-explorer"]);

  return (
    <>
      <Metadata
        title={t("dashboard-election-explorer:header")}
        description={t("dashboard-election-explorer:description")}
        keywords={""}
      />
      <ElectionExplorerDashboard candidate={candidate} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(
    locale!,
    ["common", "dashboard-election-explorer"],
    null,
    ["en-GB", "ms-MY"]
  );

  const { data: candidate } = await get("/explorer", {
    explorer: "ELECTIONS",
    chart: "candidates",
    name: "Tunku Abdul Rahman Putra Al-Haj",
    type: "parlimen",
  });
  return {
    notFound: false,
    props: {
      ...i18n,
      candidate: candidate.reverse(),
    },
  };
};

export default ElectionExplorer;
