import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionExplorerDashboard from "@dashboards/democracy/election-explorer";
import { withi18n } from "@lib/decorators";

const ElectionExplorer: Page = ({
  election,
  candidate,
  party,
  seat,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionExplorerDashboard
        election={election}
        candidate={candidate}
        party={party}
        seat={seat}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  const { data: election } = await get("/explorer", {
    explorer: "ELECTIONS",
    chart: "full_result",
    type: "seats",
    election: "GE-15",
    seat: "Padang Besar, Perlis",
  });

  const { data: candidate } = await get("/explorer", {
    explorer: "ELECTIONS",
    chart: "candidates",
    name: "Tunku Abdul Rahman Putra Al-Haj",
    type: "parlimen",
  });

  const { data: party } = await get("/explorer", {
    explorer: "ELECTIONS",
    chart: "party",
    party_name: "PERIKATAN",
    state: "mys",
    type: "parlimen",
  });

  const { data: seat } = await get("/explorer", {
    explorer: "ELECTIONS",
    chart: "seats",
    seat_name: "Padang Besar, Perlis",
  });

  return {
    notFound: false,
    props: {
      election: election,
      candidate: candidate.reverse(),
      party: party.reverse(),
      seat: seat.reverse(),
    },
  };
});

export default ElectionExplorer;
