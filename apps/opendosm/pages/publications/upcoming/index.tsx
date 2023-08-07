import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import PublicationsLayout from "misc/publications/layout";
import UpcomingPublicationsDashboard from "misc/publications/upcoming";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const UpcomingPublications: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["publications", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PublicationsLayout>
        <UpcomingPublicationsDashboard />
      </PublicationsLayout>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(["publications", "catalogue"], async () => {
  // const { data } = await get("/dashboard", { dashboard: "" });
  return {
    notFound: false,
    props: {
      meta: {
        id: "publications",
        type: "misc",
        category: null,
        agency: "DOSM",
      },
    },
  };
});

export default UpcomingPublications;
