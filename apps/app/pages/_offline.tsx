import type { Page } from "@lib/types";
import Container from "@components/Container";
import Metadata from "@components/Metadata";
import ErrorCode from "@components/Error";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { withi18n } from "@lib/decorators";

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
