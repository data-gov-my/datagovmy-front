import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionPartiesDashboard from "@dashboards/democracy/election-explorer/parties";
import { withi18n } from "@lib/decorators";
import type { Party } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const ElectionParties: Page = ({
  meta,
  params,
  selection,
  elections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionPartiesDashboard params={params} selection={selection} elections={elections} />
    </AnalyticsProvider>
  );
};

/**
 * Path: /parties/{party}/{state?}
 * party - required - Barisan Nasional
 * state - optional - eg. mlk,nsn,jhr
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
      const [party_name, state] = params ? (params.party as string[]) : [undefined, undefined];
      if (!party_name) throw new Error("Undefined party name");

      const [dropdown, party] = await Promise.all([
        get("/explorer", {
          explorer: "ELECTIONS",
          dropdown: "party_list",
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "party",
          party_name: party_name,
          state: state ?? "mys",
          type: "parlimen",
        }),
      ]).catch(e => {
        throw new Error("Invalid party. Message: " + e);
      });

      return {
        props: {
          meta: {
            id: "dashboard-election-explorer",
            type: "dashboard",
            category: "democracy",
            agency: "SPR",
          },
          params: {
            party_name,
            state: state ?? "mys",
          },
          selection: dropdown.data,
          elections: {
            parlimen:
              party.data.parlimen?.sort(
                (a: Party, b: Party) => Date.parse(b.date) - Date.parse(a.date)
              ) ?? [],
            dun:
              party.data.dun?.sort(
                (a: Party, b: Party) => Date.parse(b.date) - Date.parse(a.date)
              ) ?? [],
          },
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default ElectionParties;
