import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import Metadata from "@components/Metadata";
import ElectionCandidatesDashboard from "@dashboards/democracy/election-explorer/candidates";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";

const ElectionCandidates: Page = ({
  candidate,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionCandidatesDashboard candidate={candidate} />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  const { data: candidate } = await get("/explorer", {
    explorer: "ELECTIONS",
    chart: "candidates",
    name: "Tunku Abdul Rahman Putra Al-Haj",
    type: "parlimen",
  });

  return {
    notFound: false,
    props: {
      candidate: candidate.reverse(),
    },
  };
});

export default ElectionCandidates;
