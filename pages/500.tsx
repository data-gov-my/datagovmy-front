import Container from "@components/Container";
import ErrorCode from "@components/Error";
import Metadata from "@components/Metadata";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  return {
    props: {
      ...i18n,
    },
  };
};
