import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import NewPublicationSubscription from "misc/publications/subscribe/new";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const SubscribePublication: Page = ({
  data,
  meta,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation("publication-subscription");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("new.header")} description={t("description")} />
      <NewPublicationSubscription data={data} token={token} />
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "publication-subscription",
  async ({ locale, query }) => {
    try {
      const { data } = await get("/publication-type-list", {
        lang: locale!.slice(0, 2),
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "subscribe-publication",
            type: "misc",
            category: null,
            agency: "DOSM",
          },
          data: data,
          token: query.token || "",
        },
      };
    } catch (e: any) {
      return { notFound: true };
    }
  }
);

export default SubscribePublication;
