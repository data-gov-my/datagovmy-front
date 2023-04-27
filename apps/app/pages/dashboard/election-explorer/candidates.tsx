import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Metadata from "@components/Metadata";
import ElectionCandidatesDashboard from "@dashboards/democracy/election-explorer/candidates";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";

const ElectionCandidates: Page = ({
  candidate,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionCandidatesDashboard candidate={candidate} query={query} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboard-election-explorer",
  async ({ query }) => {
    const { data: candidate } = await get("/explorer", {
      explorer: "ELECTIONS",
      chart: "candidates",
      name: "Tunku Abdul Rahman Putra Al-Haj",
      type: "parlimen",
    });

    return {
      notFound: false,
      props: {
        query: query ?? {},
        candidate: candidate.reverse(),
      },
    };
  }
);

export default ElectionCandidates;
