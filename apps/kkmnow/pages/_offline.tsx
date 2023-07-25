import { Container, ErrorCode, Metadata } from "@components/index";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Fallback: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Oops, You are offline!"} keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorCode
          title="You are offline."
          description="You are offline. Please connect to the internet"
          code={200}
          reason={"User is offline"}
        />
      </Container>
    </>
  );
};

export default Fallback;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  return {
    props: {
      ...i18n,
    },
  };
};
