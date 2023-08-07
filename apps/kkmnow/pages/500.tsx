import { Container, Metadata, ErrorStatus } from "datagovmy-ui/components";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { withi18n } from "datagovmy-ui/decorators";

const Error500: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  return (
    <>
      <Metadata title={t("error.500.title")} keywords={""} />
      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorStatus
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

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  return {
    props: {
      meta: {
        id: "error-500",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});
