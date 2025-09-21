import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import GUIDataCatalogueLanding from "@misc/gui/landing";
import Layout from "@components/Layout";
import { clx } from "datagovmy-ui/helpers";
import { body } from "datagovmy-ui/configs/font";
import { SessionProvider } from "next-auth/react";

const GUICatalogue: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["gui-data-catalogue"]);

  return (
    <SessionProvider>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GUIDataCatalogueLanding />
    </SessionProvider>
  );
};

GUICatalogue.layout = (page, props) => {
  return (
    <Layout className={clx(body.variable, "font-sans")} hideLanguage={true}>
      {page}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["gui-data-catalogue", "catalogue"],
  async ({}) => {
    return {
      notFound: false,
      props: {
        meta: {
          id: "gui",
          type: "misc",
          category: null,
          agency: null,
        },
      },
    };
  }
);

export default GUICatalogue;
