import { GetStaticProps, InferGetStaticPropsType } from "next";
import Metadata from "@components/Metadata";
import ElectionCandidatesDashboard from "@dashboards/democracy/election-explorer/candidates";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import type { Candidate } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";

const ElectionCandidates: Page = ({
  meta,
  elections,
  selection,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionCandidatesDashboard elections={elections} selection={selection} params={params} />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-election-explorer", async () => {
  try {
    const name = "tunku-abdul-rahman-putra-alhaj";
    const [dropdown, candidate] = await Promise.all([
      get("/explorer", {
        explorer: "ELECTIONS",
        dropdown: "candidate_list",
      }),
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "candidates",
        name,
      }),
    ]).catch(e => {
      throw new Error("Invalid candidate name. Message: " + e);
    });

    return {
      props: {
        meta: {
          id: "dashboard-election-explorer",
          type: "dashboard",
          category: "democracy",
          agency: "SPR",
        },
        params: { candidate_name: name },
        selection: dropdown.data ?? [],
        elections: {
          parlimen:
            candidate.data.parlimen?.sort(
              (a: Candidate, b: Candidate) => Date.parse(b.date) - Date.parse(a.date)
            ) ?? [],
          dun:
            candidate.data.dun?.sort(
              (a: Candidate, b: Candidate) => Date.parse(b.date) - Date.parse(a.date)
            ) ?? [],
        },
      },
    };
  } catch (e: any) {
    console.error(e.message);
    return { notFound: true };
  }
});

export default ElectionCandidates;
