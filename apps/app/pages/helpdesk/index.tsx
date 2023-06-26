import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import { withi18n } from "@lib/decorators";
import HelpdeskDashboard from "@misc/helpdesk";

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
