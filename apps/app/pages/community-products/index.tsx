import CommunityProductsDashboard from "@misc/community-products";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const CommunityProducts: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["community-products"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <CommunityProductsDashboard />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("community-products", async () => {
  return {
    notFound: false,
    props: {
      meta: {
        id: "community-products",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default CommunityProducts;
