import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import TechnicalNotesDashboard from "misc/publications/technical-notes";
import PublicationsLayout from "misc/publications/layout";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Publication } from "misc/publications/browse";

const TechnicalNotes: Page = ({
  meta,
  publications,
  params,
  query,
  total_pubs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["publications", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PublicationsLayout>
        <TechnicalNotesDashboard
          publications={publications}
          params={params}
          query={query}
          total_pubs={total_pubs}
        />
      </PublicationsLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["publications"],
  async ({ locale, params, query }) => {
    const pub_id = params.pub_id ? params.pub_id[0] : "";
    const { data } = await get("/pub-docs/technical-note", { language: locale, ...query });

    return {
      notFound: false,
      props: {
        meta: {
          id: "publications",
          type: "dashboard",
          category: null,
          agency: "DOSM",
        },
        publications:
          data.results.sort(
            (a: Publication, b: Publication) =>
              Date.parse(b.release_date) - Date.parse(a.release_date)
          ) ?? [],
        params: { pub_id },
        query: query ?? {},
        total_pubs: data.count,
      },
    };
  },
  {
    cache_expiry: 600, // 10min
  }
);

export default TechnicalNotes;
