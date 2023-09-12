import HelpdeskDashboard from "@misc/helpdesk";
import { Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const Helpdesk: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["helpdesk", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <HelpdeskDashboard />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("helpdesk", async () => {
  return {
    notFound: false,
    props: {
      meta: {
        id: "helpdesk",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});

export default Helpdesk;
