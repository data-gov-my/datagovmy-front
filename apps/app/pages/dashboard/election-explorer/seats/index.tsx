import { Metadata } from "datagovmy-ui/components";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import ElectionSeatsDashboard from "@dashboards/democracy/election-explorer/seats";
import { Seat } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { useTranslation } from "datagovmy-ui/hooks";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const ElectionSeats: Page = ({
  last_updated,
  meta,
  params,
  selection,
  elections,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboard-election-explorer",
  async ({ query }) => {
    try {
      const [name, type] =
        Object.keys(query).length === 0 ? [null, null] : [query.name, query.type];

      const [{ data: dropdown }, { data: seat }] = await Promise.all([
        get("/explorer", {
          explorer: "ELECTIONS",
          dropdown: "seats_list",
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "seats",
          seat_name: name ?? "padang-besar-perlis",
          type: type ?? "parlimen",
        }),
      ]).catch(e => {
        throw new Error("Invalid seat name. Message: " + e);
      });

      return {
        notFound: false,
        props: {
          last_updated: seat.data_last_updated,
          meta: {
            id: "dashboard-election-explorer",
            type: "dashboard",
            category: "democracy",
            agency: "SPR",
          },
          params: { seat_name: name, type: type },
          selection: dropdown,
          elections:
            seat.data.sort(
              (a: Seat, b: Seat) => Number(new Date(b.date)) - Number(new Date(a.date))
            ) ?? [],
        },
      };
    } catch (error: any) {
      console.error(error.message);
      return { notFound: true };
    }
  }
);

export default ElectionSeats;
