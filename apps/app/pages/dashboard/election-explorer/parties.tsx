import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionPartiesDashboard from "@dashboards/democracy/election-explorer/parties";
import { withi18n } from "@lib/decorators";

const ElectionParties: Page = ({
  party,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionPartiesDashboard party={party} query={query} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboard-election-explorer",
  async ({ query }) => {
    const { data: party } = await get("/explorer", {
      explorer: "ELECTIONS",
      chart: "party",
      party_name: "PERIKATAN",
      state: "mys",
      type: "parlimen",
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
        party: party.reverse(),
      },
    };
  }
);

export default ElectionParties;
