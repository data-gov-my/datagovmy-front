import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import CommunityDashboard from "@misc/community";

const Community: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["community", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CommunityDashboard />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("community", async () => {
  return {
    notFound: false,
    props: {
      meta: {
        id: "community",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default Community;
