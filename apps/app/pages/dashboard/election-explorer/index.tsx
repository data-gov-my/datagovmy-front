import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionExplorerDashboard from "@dashboards/democracy/election-explorer";
import { withi18n } from "@lib/decorators";

const ElectionExplorer: Page = ({
  election,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionExplorerDashboard election={election} query={query} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboard-election-explorer",
  async ({ query }) => {
    const { data: election } = await get("/explorer", {
      explorer: "ELECTIONS",
      chart: "overall_seat",
      type: "parlimen",
      election: "GE-15",
      state: "pls",
    });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-election-explorer",
          type: "dashboard",
          category: "democracy",
          agency: "SPR",
        },
        query: query ?? {},
        election: election,
      },
    };
  }
);

export default ElectionExplorer;
