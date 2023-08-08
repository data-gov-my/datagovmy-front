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
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["publications", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PublicationsLayout>
        <BrowsePublicationsDashboard
          dropdown={dropdown}
          publications={publications}
          query={query}
        />
      </PublicationsLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["publications", "catalogue"],
  async ({ locale, query }) => {
    try {
      const [{ data: dropdown }, { data }] = await Promise.all([
        get("/publication-dropdown", {
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
            type: "misc",
            category: null,
            agency: "DOSM",
          },
          dropdown: dropdown,
          publications:
            data.results.sort(
              (a: Publication, b: Publication) =>
                Date.parse(b.release_date) - Date.parse(a.release_date)
            ) ?? [],
          query: query ?? {},
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default BrowsePublications;
