import "datagovmy-ui/styles";
import { appWithTranslation } from "next-i18next";
import Layout from "@components/Layout";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import mixpanelConfig from "@config/mixpanel";
import { ga_track, init_session } from "datagovmy-ui/mixpanel";
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

  // useEffect(() => {
  //   // trigger page view event for client-side navigation
  //   const handleRouteChange = (url: string) => {
  //     ga_track(url);
  //     init_session();
  //   };
  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   console.log(
  //     "%cIn loving memory of Hamzah Bin Ismail (1979-2023). Al-Fatihah",
  //     "font: 20px; font-family: monospace; font-weight: bold; background: #a4a4a4; color: #000; padding: 4px 12px"
  //   );

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router.events]);

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
