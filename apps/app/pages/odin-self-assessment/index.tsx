import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { OdinDashboard } from "datagovmy-ui/misc";

const OdinPage: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <OdinDashboard />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("", async () => {
  return {
    notFound: false,
    props: {
      meta: {
        id: "odin",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default OdinPage;
