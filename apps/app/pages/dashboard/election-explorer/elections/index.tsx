import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionExplorerDashboard from "@dashboards/democracy/election-explorer/elections";
import { withi18n } from "@lib/decorators";
import { Party } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const ElectionExplorerIndex: Page = ({
  meta,
  params,
  seats,
  selection,
  table,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionExplorerDashboard
        params={params}
        seats={seats}
        selection={selection}
        table={table}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  try {
    const [election, state] = ["GE-15", "mys"];
    const [dropdown, seats, table] = await Promise.all([
      get("/explorer", {
        explorer: "ELECTIONS",
        dropdown: "election_list",
      }),
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "overall_seat",
        election,
        state,
      }),
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "full_result",
        type: "party",
        election,
        state,
      }),
    ]).catch(e => {
      throw new Error("Invalid seat name. Message: " + e);
    });

    return {
      props: {
        meta: {
          id: "dashboard-election-explorer",
          type: "dashboard",
          category: "democracy",
          agency: "SPR",
        },
        params: { election, state },
        seats: seats.data,
        selection: dropdown.data ?? [],
        table: table.data.sort((a: Party, b: Party) => {
          if (a.seats.won === b.seats.won) {
            return b.votes.perc - a.votes.perc;
          } else {
            return b.seats.won - a.seats.won;
          }
        }),
      },
    };
  } catch (error: any) {
    console.error(error.message);
    return { notFound: true };
  }
});

export default ElectionExplorerIndex;
