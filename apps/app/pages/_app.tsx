import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout } from "@lib/types";
import Layout from "@components/Layout";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import mixpanelConfig from "@config/mixpanel";
import { ga_track, track } from "@lib/mixpanel";
import Fonts from "@config/font";
import { ThemeProvider } from "next-themes";
import Nexti18NextConfig from "../next-i18next.config";
import { clx } from "@lib/helpers";
import { Toast } from "@components/Toast";
import Progress from "@components/Progress";

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout =
    Component.layout ||
    ((page: ReactNode) => (
      <Layout className={clx(Fonts.body.variable, "font-sans")}>{page}</Layout>
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
    <div className={clx(Fonts.body.variable, Fonts.header.variable, "font-sans dark:bg-black")}>
      <Progress />
      <ThemeProvider attribute="class" enableSystem={false}>
        {layout(<Component {...pageProps} />, pageProps)}
        <Toast />
      </ThemeProvider>
    </div>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
