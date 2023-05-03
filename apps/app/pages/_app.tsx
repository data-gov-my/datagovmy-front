import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout } from "@lib/types";
import Layout from "@components/Layout";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import mixpanelConfig from "@config/mixpanel";
import { ga_track, init_session } from "@lib/mixpanel";
import Fonts from "@config/font";
import { ThemeProvider } from "next-themes";
import Nexti18NextConfig from "../next-i18next.config";
import { clx } from "@lib/helpers";
import { WindowProvider } from "@hooks/useWindow";

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout =
    Component.layout ??
    ((page: ReactNode) => (
      <Layout className={clx(Fonts.body.variable, "font-sans")}>{page}</Layout>
    ));
  const router = useRouter();

  // Mixpanel initialisation
  useEffect(() => {
    // window.mixpanel.init(mixpanelConfig.token, {
    //   debug: true,
    //   api_host: "https://api.mixpanel.com",
    // });
  }, []);

  useEffect(() => {
    // trigger page view event for client-side navigation
    const handleRouteChange = (url: string) => {
      //   ga_track(url);
      //   init_session();
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div className={clx(Fonts.body.variable, Fonts.header.variable, "font-sans dark:bg-black")}>
      <WindowProvider>
        <ThemeProvider attribute="class" enableSystem={false}>
          {layout(<Component {...pageProps} />, pageProps)}
        </ThemeProvider>
      </WindowProvider>
    </div>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
