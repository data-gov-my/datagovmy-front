import Metadata from "@components/Metadata";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import ElectionPartiesDashboard from "@dashboards/democracy/election-explorer/parties";
import type { Party } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { isEmpty } from "lodash";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const ElectionParties: Page = ({
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
        <ElectionPartiesDashboard params={params} selection={selection} elections={elections} />
      </ElectionLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "dashboard-election-explorer",
  async ({ query }) => {
    try {
      const [party_name, state] = isEmpty(query) ? [null, null] : [query.name, query.state];

      const [{ data: dropdown }, { data: party }] = await Promise.all([
        get("/explorer", {
          explorer: "ELECTIONS",
          dropdown: "party_list",
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "party",
          party_name: party_name ?? "PERIKATAN",
          state: state ?? "mys",
        }),
      ]).catch(e => {
        throw new Error("Invalid party. Message: " + e);
      });

      return {
        props: {
          last_updated: party.data_last_updated,
          meta: {
            id: "dashboard-election-explorer",
            type: "dashboard",
            category: "democracy",
            agency: "SPR",
          },
          params: {
            party_name: party_name,
            state: state,
          },
          selection: dropdown,
          elections: {
            parlimen:
              party.data.parlimen.sort(
                (a: Party, b: Party) => Date.parse(b.date) - Date.parse(a.date)
              ) ?? [],
            dun:
              party.data.dun.sort(
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
