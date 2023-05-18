import { GetStaticProps } from "next";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";

const Shell: Page = () => <></>;
export default Shell;

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      permanent: true,
      destination: routes.ELECTION_EXPLORER.concat("/elections"),
    },
  };
};
