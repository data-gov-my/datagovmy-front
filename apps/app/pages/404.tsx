import Container from "@components/Container";
import ErrorCode from "@components/Error";
import Metadata from "@components/Metadata";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "hooks/useTranslation";
import { withi18n } from "@lib/decorators";

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

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  return {
    props: {},
  };
});
