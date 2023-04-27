import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import Metadata from "@components/Metadata";
import ElectionSeatsDashboard from "@dashboards/democracy/election-explorer/seats";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";

const ElectionSeats: Page = ({ seat }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionSeatsDashboard seat={seat} />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  const { data: seat } = await get("/explorer", {
    explorer: "ELECTIONS",
    chart: "seats",
    seat_name: "Padang Besar, Perlis",
  });

  return {
    notFound: false,
    props: {
      seat: seat.reverse(),
    },
  };
});

export default ElectionSeats;
