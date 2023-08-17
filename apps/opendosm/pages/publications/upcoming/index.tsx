import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import PublicationsLayout from "misc/publications/layout";
import UpcomingPublicationsDashboard from "misc/publications/upcoming";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const UpcomingPublications: Page = ({
  meta,
  publications,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["publications", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <PublicationsLayout>
        <WindowProvider>
          <UpcomingPublicationsDashboard publications={publications} />
        </WindowProvider>
      </PublicationsLayout>
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(["publications"], async ({ locale }) => {
  const today = new Date();

  const { data } = await get("/pub-upcoming", {
    language: locale,
    start: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-01`,
    end: `${today.getFullYear()}-${(today.getMonth() + 2).toString().padStart(2, "0")}-07`,
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
      publications: data,
    },
  };
});

export default UpcomingPublications;
