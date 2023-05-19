import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionPartiesDashboard from "@dashboards/democracy/election-explorer/parties";
import { withi18n } from "@lib/decorators";

const ElectionParties: Page = ({
  params,
  selection,
  elections,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionPartiesDashboard params={params} selection={selection} elections={elections} />
    </>
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
            parlimen: party.data.parlimen.reverse(),
            dun: party.data.dun.reverse(),
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