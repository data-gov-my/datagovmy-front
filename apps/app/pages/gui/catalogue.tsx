import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import GUIDataCatalogueLanding from "@misc/gui/landing";
import { get } from "datagovmy-ui/api";
import { SHORT_LANG } from "datagovmy-ui/constants";
import Layout from "@components/Layout";
import { clx } from "datagovmy-ui/helpers";
import { body } from "datagovmy-ui/configs/font";
import { SessionProvider } from "next-auth/react";

const GUICatalogue: Page = ({ sources }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["gui-data-catalogue"]);

  return (
    <SessionProvider>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <GUIDataCatalogueLanding sources={sources} />
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
  async ({ locale }) => {
    const { data } = await get("/data-catalogue", {
      language: SHORT_LANG[locale! as keyof typeof SHORT_LANG],
      site: "datagovmy",
    });

    return {
      notFound: process.env.NEXT_PUBLIC_APP_ENV === "production",
      props: {
        meta: {
          id: "gui",
          type: "misc",
          category: null,
          agency: null,
        },
        sources: data.source_filters.sort((a: string, b: string) => a.localeCompare(b)),
      },
    };
  }
);

export default GUICatalogue;
