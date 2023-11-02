import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import TechnicalNotesDashboard from "misc/publications/technical-notes";
import PublicationsLayout from "misc/publications/layout";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Publication } from "datagovmy-ui/components";

const TechnicalNotes: Page = ({
  meta,
  pub,
  publications,
  params,
  query,
  total_pubs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["publications", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={pub ? pub.title : t("header")}
        description={pub ? pub.description : t("description")}
        keywords={""}
      />
      <PublicationsLayout>
        <TechnicalNotesDashboard
          pub={pub}
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
    const pub = pub_id
      ? await get(`/pub-docs-resource/${pub_id}`, {
          language: locale,
        })
      : null;

    return {
      notFound: false,
      props: {
        meta: {
          id: "publications",
          type: "dashboard",
          category: null,
          agency: "DOSM",
        },
        pub: pub ? pub.data : null,
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
