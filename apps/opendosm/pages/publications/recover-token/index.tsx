import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import RecoverSubscriptionTokenPage from "misc/publications/subscribe/recover";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const RecoverSubscriptionToken: Page = ({
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("publication-subscription");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("recover.header")} description={t("description")} keywords={""} />
      <RecoverSubscriptionTokenPage />
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "publication-subscription",
  async () => {
    try {
      return {
        notFound: false,
        props: {
          meta: {
            id: "recover-token",
            type: "misc",
            category: null,
            agency: "DOSM",
          },
        },
      };
    } catch (e: any) {
      return { notFound: true };
    }
  }
);

export default RecoverSubscriptionToken;
