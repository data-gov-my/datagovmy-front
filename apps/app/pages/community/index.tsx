import CommunityDashboard from "@misc/community";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

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
