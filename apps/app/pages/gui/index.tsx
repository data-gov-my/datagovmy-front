import { GetServerSideProps } from "next";
import { routes } from "@lib/routes";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: routes.GUI_CATALOGUE,
      permanent: false,
    },
  };
};

export default function GUIPage() {
  return null;
}
