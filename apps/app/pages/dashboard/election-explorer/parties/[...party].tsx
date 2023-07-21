import Metadata from "@components/Metadata";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import ElectionPartiesDashboard from "@dashboards/democracy/election-explorer/parties";
import type { Party } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const ElectionParties: Page = ({
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
        <ElectionPartiesDashboard params={params} selection={selection} elections={elections} />
      </ElectionLayout>
    </AnalyticsProvider>
  );
};

/**
 * Path: /parties/{party}/{state?}
 * party - required - Barisan Nasional
 * state - optional - eg. mlk,nsn,jhr
 */
export const getStaticPaths: GetStaticPaths = () => {
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
          last_updated: party.data.data_last_update,
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
              party.data.data.parlimen?.sort(
                (a: Party, b: Party) => Date.parse(b.date) - Date.parse(a.date)
              ) ?? [],
            dun:
              party.data.data.dun?.sort(
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
