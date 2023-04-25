import Container from "@components/Container";
import ErrorCode from "@components/Error";
import Metadata from "@components/Metadata";
import { withi18n } from "@lib/decorators";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";

const Error500: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");
  return (
    <>
      <Metadata title={t("common:error.500.title")} keywords={""} />
      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorCode
          title={t("common:error.500.title")}
          description={t("common:error.500.description")}
          code={500}
          reason={t("common:error.500.reason")}
        />
      </Container>
    </>
  );
};

export default Error500;

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  return {
    props: {},
  };
});
