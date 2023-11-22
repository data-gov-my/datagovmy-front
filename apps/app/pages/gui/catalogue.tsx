import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import GUILayout from "@misc/gui/layout";

const GUICatalogue: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["gui-opendosm-pub"]);
  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GUILayout>
        <h1>hello from catalogue</h1>
      </GUILayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("gui-opendosm-pub", async () => {
  return {
    notFound: true,
    props: {
      meta: {
        id: "gui",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default GUICatalogue;
