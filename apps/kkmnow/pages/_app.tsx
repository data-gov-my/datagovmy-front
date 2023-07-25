import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout, ReactElement } from "@lib/types";
import { Layout } from "@components/index";

function App({ Component, pageProps }: AppPropsLayout) {
  const layout = Component.layout ?? ((page: ReactElement) => <Layout>{page}</Layout>);

  return layout(<Component {...pageProps} />);
}

export default appWithTranslation(App);
