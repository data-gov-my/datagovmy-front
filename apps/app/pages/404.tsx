import { At, Container, ErrorStatus, Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";

const Error404: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Metadata title={t("error.404.title") as string} keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorStatus
          title={t("error.404.title") as string}
          description={
            <>
              {`${t("error.404.description")} ${t("error.404.legacy")}`}
              <At external href={"https://archive.data.gov.my"} className="link-primary">
                archive.data.gov.my
              </At>
            </>
          }
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
        id: "error-400",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});
