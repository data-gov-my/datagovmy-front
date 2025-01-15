import Nexti18NextConfig from "../next-i18next.config";
import "datagovmy-ui/styles";
import Layout from "@components/Layout";
import { Progress, Toast } from "datagovmy-ui/components";
import { header, body } from "datagovmy-ui/configs/font";
import { clx } from "datagovmy-ui/helpers";
import { AppPropsLayout } from "datagovmy-ui/types";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout =
    Component.layout ||
    ((page: ReactNode) => <Layout className={clx(body.variable, "font-sans")}>{page}</Layout>);

  return (
    <div className={clx(body.variable, header.variable, "font-sans dark:bg-black")}>
      <ThemeProvider attribute="class" enableSystem={false} forcedTheme={Component.theme}>
        {layout(<Component {...pageProps} />, pageProps)}
        <Progress />
        <Toast />
      </ThemeProvider>
    </div>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
