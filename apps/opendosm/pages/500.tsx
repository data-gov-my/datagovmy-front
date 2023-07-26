import { Container, Metadata } from "datagovmy-ui/components";
import ErrorCode from "@components/Error";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";

import { withi18n } from "datagovmy-ui/decorators";

const Error500: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");
  return (
    <>
      <Metadata title={t("error.500.title")} keywords={""} />
      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorCode
          title={t("error.500.title")}
          description={t("error.500.description")}
          code={500}
          reason={t("error.500.reason")}
        />
      </Container>
    </>
  );
};

export default Error500;

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  return {
    props: {
      meta: {
        id: "500",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});
