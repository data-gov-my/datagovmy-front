import { Container, Metadata, ErrorStatus } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { useTranslation } from "next-i18next";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const Error404: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  return (
    <>
      <Metadata title={t("error.404.title")} keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorStatus
          title={t("error.404.title")}
          description={t("error.404.description")}
          code={404}
          reason={t("error.404.reason")}
        />
      </Container>
    </>
  );
};

export default Error404;

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  return {
    props: {
      meta: {
        id: "error-404",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});
