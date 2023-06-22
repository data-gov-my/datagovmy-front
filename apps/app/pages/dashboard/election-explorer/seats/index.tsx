import { GetStaticProps, InferGetStaticPropsType } from "next";
import Metadata from "@components/Metadata";
import ElectionSeatsDashboard from "@dashboards/democracy/election-explorer/seats";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import type { Seat } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const ElectionSeats: Page = ({
  meta,
  params,
  selection,
  elections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionSeatsDashboard params={params} selection={selection} elections={elections} />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  try {
    const name = "padang-besar-perlis";
    const type = "parlimen";
    const [dropdown, seat] = await Promise.all([
      get("/explorer", {
        explorer: "ELECTIONS",
        dropdown: "seats_list",
      }),
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "seats",
        seat_name: name,
        type: type,
      }),
    ]).catch(e => {
      throw new Error("Invalid seat name. Message: " + e);
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
        params: { seat_name: name, type: type },
        selection: dropdown.data,
        elections:
          seat.data?.sort(
            (a: Seat, b: Seat) => Number(new Date(b.date)) - Number(new Date(a.date))
          ) ?? [],
      },
    };
  } catch (error: any) {
    console.error(error.message);
    return { notFound: true };
  }
});

export default ElectionSeats;
