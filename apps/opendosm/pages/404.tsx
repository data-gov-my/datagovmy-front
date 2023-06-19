import ErrorCode from "@components/Error";
import { Container } from "datagovmy-ui/components";
import { Metadata } from "datagovmy-ui/components";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { withi18n } from "datagovmy-ui/decorators";

const Error404: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");
  return (
    <>
      <Metadata title={t("error.404.title") as string} keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorCode
          title={t("error.404.title") as string}
          description={t("error.404.description")}
          code={404}
          reason={t("error.404.reason")}
        />
      </Container>
    </>
  );
};

export default Error404;

export const getStaticProps: GetStaticProps = withi18n("common", async () => {
  return {
    props: {
      meta: {
        id: "404",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});
