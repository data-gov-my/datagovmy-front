import Metadata from "@components/Metadata";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import ElectionSeatsDashboard from "@dashboards/democracy/election-explorer/seats";
import type { Seat } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const ElectionSeats: Page = ({
  last_updated,
  meta,
  params,
  selection,
  elections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionLayout last_updated={last_updated}>
        <ElectionSeatsDashboard params={params} selection={selection} elections={elections} />
      </ElectionLayout>
    </AnalyticsProvider>
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
      const [name, type] = params ? (params.seat as string[]) : [undefined, undefined];
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
          type,
        }),
      ]).catch(e => {
        throw new Error("Invalid seat name. Message: " + e);
      });

      return {
        props: {
          last_updated: seat.data.data_last_update,
          meta: {
            id: "dashboard-election-explorer",
            type: "dashboard",
            category: "democracy",
            agency: "SPR",
          },
          params: { seat_name: name, type: type },
          selection: dropdown.data,
          elections:
            seat.data.data.sort((a: Seat, b: Seat) => Date.parse(b.date) - Date.parse(a.date)) ??
            [],
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default ElectionSeats;
