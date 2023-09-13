import DataGPT from "@misc/datagpt";
import { Metadata, Progress } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const AIChat: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["datagpt"]);

  return (
    <>
      <Metadata title={"DataGPT"} description={t("description")} keywords={""} />
      <Progress />
      <DataGPT />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("datagpt", async () => {
  return {
    notFound: true,
    props: {
      meta: {
        id: "datagpt",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default AIChat;
