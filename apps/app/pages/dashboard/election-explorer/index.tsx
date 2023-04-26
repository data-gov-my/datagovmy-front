import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionExplorerDashboard from "@dashboards/democracy/election-explorer";
import { withi18n } from "@lib/decorators";

const ElectionExplorer: Page = ({
  candidate,
  party,
  seat,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata
        title={t("dashboard-election-explorer:header")}
        description={t("dashboard-election-explorer:description")}
        keywords={""}
      />
      <ElectionExplorerDashboard candidate={candidate} seat={seat} party={party} />
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

  const { data: seat } = await get("/explorer", {
    explorer: "ELECTIONS",
    chart: "seats",
    seat_name: "Padang Besar, Perlis",
  });

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
      candidate: candidate.reverse(),
      seat: seat.reverse(),
      party: party.reverse(),
    },
  };
});

export default ElectionExplorer;
