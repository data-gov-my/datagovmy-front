import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ElectionPartiesDashboard from "@dashboards/democracy/election-explorer/parties";
import { withi18n } from "@lib/decorators";
import type { Party } from "@dashboards/democracy/election-explorer/types";

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

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  try {
    const [party_name, state] = ["PERIKATAN", "mys"];

    const [dropdown, party] = await Promise.all([
      get("/explorer", {
        explorer: "ELECTIONS",
        dropdown: "party_list",
      }),
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "party",
        type: "parlimen",
        party_name,
        state,
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
          party_name: party_name,
          state: state,
        },
        selection: dropdown.data,
        elections: {
          parlimen:
            party.data.parlimen?.sort(
              (a: Party, b: Party) => Date.parse(b.date) - Date.parse(a.date)
            ) ?? [],
          dun:
            party.data.dun?.sort((a: Party, b: Party) => Date.parse(b.date) - Date.parse(a.date)) ??
            [],
        },
      },
    };
  } catch (e: any) {
    console.error(e.message);
    return { notFound: true };
  }
});

export default ElectionParties;
