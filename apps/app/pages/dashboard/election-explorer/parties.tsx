import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionPartiesDashboard from "@dashboards/democracy/election-explorer/parties";
import { withi18n } from "@lib/decorators";

const ElectionParties: Page = ({ party }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionPartiesDashboard party={party} />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
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
      party: party.reverse(),
    },
  };
});

export default ElectionParties;
