import CatalogueDataGPT from "@data-catalogue/datagpt";
import { get } from "datagovmy-ui/api";
import { Metadata, Progress } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const AIChat: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={"DataGPT"} description={t("description")} keywords={""} />
      <Progress />
      <CatalogueDataGPT />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("catalogue-datagpt", async () => {
  return {
    props: {
      meta: {
        id: "catalogue-datagpt",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default AIChat;
