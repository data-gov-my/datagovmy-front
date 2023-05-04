import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Metadata from "@components/Metadata";
import ElectionSeatsDashboard, { Seat } from "@dashboards/democracy/election-explorer/seats";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";

const ElectionSeats: Page = ({
  query,
  seat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionSeatsDashboard query={query} seat={seat} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboard-election-explorer",
  async ({ query }) => {
    const { data: seat } = await get("/explorer", {
      explorer: "ELECTIONS",
      chart: "seats",
      seat_name: "Padang Besar, Perlis",
    });

    return {
      notFound: false,
      props: {
        query: query ?? {},
        seat: seat.sort((a: Seat, b: Seat) => Number(new Date(b.date)) - Number(new Date(a.date))),
      },
    };
  }
);

export default ElectionSeats;
