import "datagovmy-ui/styles";
import { appWithTranslation } from "next-i18next";
import Layout from "@components/Layout";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import mixpanelConfig from "@config/mixpanel";
import { ga_track, track } from "datagovmy-ui/mixpanel";
import { clx } from "datagovmy-ui/helpers";
import { body, header } from "@config/font";
import Nexti18NextConfig from "../next-i18next.config";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { ThemeProvider } from "next-themes";

// App instance
function App({ Component, pageProps }: any) {
  const layout =
    Component.layout ||
    ((page: ReactNode) => <Layout className={clx(body.variable, "font-sans")}>{page}</Layout>);
  const router = useRouter();

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
    <ThemeProvider attribute="class" enableSystem={false} forcedTheme={Component.theme}>
      <WindowProvider>
        {layout(
          <div className={clx(body.variable, header.variable, "font-sans")}>
            <Component {...pageProps} />
          </div>
        )}
      </WindowProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
