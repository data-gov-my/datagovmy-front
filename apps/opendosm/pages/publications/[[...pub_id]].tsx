import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import BrowsePublicationsDashboard, { Publication } from "misc/publications/browse";
import PublicationsLayout from "misc/publications/layout";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const BrowsePublications: Page = ({
  dropdown,
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
        <BrowsePublicationsDashboard
          dropdown={dropdown}
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
  ["publications", "catalogue"],
  async ({ locale, query, params }) => {
    try {
      const pub_id = params.pub_id ? params.pub_id[0] : "";
      const [{ data: dropdown }, { data }] = await Promise.all([
        get("/publication-dropdown/", {
          language: locale,
        }),
        get("/publication/", {
          language: locale,
          ...query,
        }),
      ]).catch(e => {
        throw new Error("Invalid filter. Message: " + e);
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "publications",
            type: "dashboard",
            category: null,
            agency: "DOSM",
          },
          dropdown: dropdown,
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
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  },
  {
    cache_expiry: 600, // 10 min
  }
);

export default BrowsePublications;
