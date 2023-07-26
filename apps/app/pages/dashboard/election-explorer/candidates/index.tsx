import Metadata from "@components/Metadata";
import ElectionCandidatesDashboard from "@dashboards/democracy/election-explorer/candidates";
import ElectionLayout from "@dashboards/democracy/election-explorer/layout";
import type { Candidate } from "@dashboards/democracy/election-explorer/types";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { withi18n } from "@lib/decorators";
import type { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const ElectionCandidates: Page = ({
  last_updated,
  meta,
  elections,
  selection,
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ElectionLayout last_updated={last_updated}>
        <ElectionCandidatesDashboard elections={elections} selection={selection} params={params} />
      </ElectionLayout>
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
        last_updated: candidate.data.data_last_updated,
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
            candidate.data.data.parlimen?.sort(
              (a: Candidate, b: Candidate) => Date.parse(b.date) - Date.parse(a.date)
            ) ?? [],
          dun:
            candidate.data.data.dun?.sort(
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
