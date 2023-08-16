import Progress from "@components/Progress";
import AIHelper from "@data-catalogue/ai-helper";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const AIChat: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={"AI Helper"} description={""} keywords={""} />
      <Progress />
      <AIHelper />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("catalogue", async () => {
  return {
    props: {
      meta: {
        id: "catalogue-chat",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default AIChat;
