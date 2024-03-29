import Nexti18NextConfig from "../next-i18next.config";
import "datagovmy-ui/styles";
import Layout from "@components/Layout";
import { Progress, Toast } from "datagovmy-ui/components";
import { header, body } from "datagovmy-ui/configs/font";
import mixpanelConfig from "datagovmy-ui/configs/mixpanel";
import { clx } from "datagovmy-ui/helpers";
import { ga_track, track } from "datagovmy-ui/mixpanel";
import { AppPropsLayout } from "datagovmy-ui/types";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";
import { useTranslation } from "datagovmy-ui/hooks";

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const { t } = useTranslation();
  const layout =
    Component.layout ||
    ((page: ReactNode) => (
      <Layout
        className={clx(body.variable, "font-sans")}
        useBanner={Boolean(t("common:common.banner")) ? true : false}
      >
        {page}
      </Layout>
    ));
  const router = useRouter();

  // Mixpanel initialisation
  useEffect(() => {
    const is_development = process.env.NEXT_PUBLIC_APP_ENV === "development";
    window.mixpanel.init(
      mixpanelConfig.token,
      {
        debug: is_development,
        verbose: is_development,
        api_host: mixpanelConfig.host,
      },
      mixpanelConfig.name
    );
  }, []);

  useEffect(() => {
    // trigger page view event for client-side navigation
    const handleRouteChange = (url: string) => {
      ga_track(url);
      track("page_view", pageProps?.meta);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, pageProps?.meta]);

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
