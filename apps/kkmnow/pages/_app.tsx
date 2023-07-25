import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout } from "@lib/types";
import { Layout } from "@components/index";
import { ReactNode } from "react";

function App({ Component, pageProps }: AppPropsLayout) {
  const layout = Component.layout || ((page: ReactNode) => <Layout>{page}</Layout>);

  return layout(<Component {...pageProps} />, pageProps);
}

export default appWithTranslation(App);
