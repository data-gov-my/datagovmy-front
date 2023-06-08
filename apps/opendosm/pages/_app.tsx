import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout } from "@lib/types";
import { Layout } from "@components/index";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "@config/mixpanel";
import { ga_track, init_session } from "@lib/mixpanel";
import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/en";

// Global settings
mixpanel.init(mixpanelConfig.token, { debug: process.env.NODE_ENV === "development" });

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout = Component.layout ?? ((page: ReactNode) => <Layout>{page}</Layout>);
  const router = useRouter();

  useEffect(() => {
    // trigger page view event for client-side navigation
    const handleRouteChange = (url: string) => {
      ga_track(url);
      init_session();
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    console.log(
      "%cIn loving memory of Hamzah Bin Ismail (1979-2023). Al-Fatihah",
      "font: 20px; font-family: monospace; font-weight: bold; background: #a4a4a4; color: #000; padding: 4px 12px"
    );

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return layout(
    <>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(App);
