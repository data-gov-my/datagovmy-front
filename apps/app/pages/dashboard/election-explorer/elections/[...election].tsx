import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionExplorerDashboard from "@dashboards/democracy/election-explorer/elections";
import { withi18n } from "@lib/decorators";
import { Party } from "@dashboards/democracy/election-explorer/types";
import { CountryAndStates } from "@lib/constants";

const ElectionExplorer: Page = ({
  params,
  seats,
  selection,
  table,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionExplorerDashboard
        params={params}
        seats={seats}
        selection={selection}
        table={table}
      />
    </>
  );
};

/**
 * Path: /elections/{election}/{state?}
 * election - required - eg. GE-15, GE-14
 * state    - optional - eg. mlk,nsn,jhr
 */
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
      const [election, state] = params ? (params.election as string[]) : [undefined, undefined];
      if (!election) throw new Error("Undefined election");
      const election_name =
        election.startsWith("S") && state && ["mys", "kul", "lbn", "pjy"].includes(state) === false
          ? `${CountryAndStates[state]} ${election}`
          : election;

      const [dropdown, seats, table] = await Promise.all([
        get("/explorer", {
          explorer: "ELECTIONS",
          dropdown: "election_list",
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "overall_seat",
          election: election_name,
          state: state ?? "mys",
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "full_result",
          type: "party",
          election: election_name,
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
          params: { election: election_name, state: state ?? "mys" },
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
  }
);

export default ElectionExplorer;
