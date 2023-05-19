import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Metadata from "@components/Metadata";
import ElectionSeatsDashboard from "@dashboards/democracy/election-explorer/seats";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import type { Seat } from "@dashboards/democracy/election-explorer/types";

const ElectionSeats: Page = ({
  params,
  selection,
  elections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionSeatsDashboard params={params} selection={selection} elections={elections} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-election-explorer",
  async ({ params }) => {
    try {
      const name = params?.seat;
      if (!name) throw new Error("Undefined seat name");

      const [dropdown, seat] = await Promise.all([
        get("/explorer", {
          explorer: "ELECTIONS",
          dropdown: "seats_list",
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "seats",
          seat_name: name,
        }),
      ]).catch(e => {
        throw new Error("Invalid seat name. Message: " + e);
      });

      return {
        // notFound: true,
        props: {
          meta: {
            id: "dashboard-election-explorer",
            type: "dashboard",
            category: "democracy",
            agency: "SPR",
          },
          params: { seat_name: name },
          selection: dropdown.data,
          elections: seat.data.sort(
            (a: Seat, b: Seat) => Number(new Date(b.date)) - Number(new Date(a.date))
          ),
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default ElectionSeats;
