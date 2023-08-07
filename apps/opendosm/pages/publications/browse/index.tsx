import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import BrowsePublicationsDashboard from "misc/publications/browse";
import PublicationsLayout from "misc/publications/layout";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const BrowsePublications: Page = ({
  data,
  meta,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["publications", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PublicationsLayout>
        <BrowsePublicationsDashboard data={data} query={query} />
      </PublicationsLayout>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  ["publications", "catalogue"],
  async ({ locale, query }) => {
    // const { data } = await get("/publication/", {
    //   language: locale,
    //   ...query,
    // });

    return {
      notFound: false,
      props: {
        meta: {
          id: "publications",
          type: "misc",
          category: null,
          agency: "DOSM",
        },
        query: query ?? {},
        data: {},
      },
    };
  }
);

export default BrowsePublications;
