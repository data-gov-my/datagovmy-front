import Metadata from "@components/Metadata";
import ElectionExplorerDashboard from "@dashboards/democracy/election-explorer/elections";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import { Party } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { CountryAndStates } from "@lib/constants";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const ElectionExplorerIndex: Page = ({
  last_updated,
  meta,
  params,
  seats,
  selection,
  table,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionLayout last_updated={last_updated}>
        <ElectionExplorerDashboard
          params={params}
          seats={seats}
          selection={selection}
          table={table}
        />
      </ElectionLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboard-election-explorer",
  async ({ query }) => {
    try {
      let [election, state] =
        Object.keys(query).length === 0
          ? [null, null]
          : [query.election?.toString(), query.state?.toString()];

      election =
        typeof election === "string" &&
        typeof state === "string" &&
        election.startsWith("S") &&
        state &&
        ["mys", "kul", "lbn", "pjy"].includes(state) === false
          ? `${CountryAndStates[state]} ${election}`
          : election;

      const [{ data: dropdown }, { data: seats }, { data: table }] = await Promise.all([
        get("/explorer", {
          explorer: "ELECTIONS",
          dropdown: "election_list",
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "overall_seat",
          election: election ?? "GE-15",
          state: state ?? "mys",
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "full_result",
          type: "party",
          election: election ?? "GE-15",
          state: state ?? "mys",
        }),
      ]).catch(e => {
        throw new Error("Invalid election name/state. Message: " + e);
      });

      return {
        props: {
          last_updated: seats.data_last_updated,
          meta: {
            id: "dashboard-election-explorer",
            type: "dashboard",
            category: "democracy",
            agency: "SPR",
          },
          params: { election, state },
          seats: seats.data,
          selection: dropdown ?? [],
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
  }
);

export default ElectionExplorerIndex;
