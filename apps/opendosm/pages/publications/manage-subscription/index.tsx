import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import ManageSubscriptionPage from "misc/publications/subscribe/manage";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const ManageSubscription: Page = ({
  data,
  meta,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("publication-manage");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ManageSubscriptionPage data={data} />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["publication-manage", "publication-subscription"],
  async ({ locale }) => {
    try {
      const { data } = await get("/publication-type-list", {
        lang: locale!.slice(0, 2),
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "manage-subscription",
            type: "misc",
            category: null,
            agency: "DOSM",
          },
          data: data,
        },
      };
    } catch (e: any) {
      return { notFound: true };
    }
  }
);

export default ManageSubscription;
