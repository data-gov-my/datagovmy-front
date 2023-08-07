import { Container, ErrorStatus, Metadata } from "datagovmy-ui/components";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const Fallback: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Oops, You are offline!"} keywords={""} />

      <Container className="min-h-[76vh] pt-7 text-black">
        <ErrorStatus
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

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  return {
    props: {
      meta: {
        id: "error-offline",
        type: "misc",
        category: null,
        agency: null,
      },
    },
  };
});
