import type { AppProps } from "next/app";
import { AIHelper } from "datagovmy-nextra";
import "datagovmy-nextra/style.css";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const track = (event: "page_view", prop?: Record<string, any>): void => {
  if (window.mixpanel?.instance) {
    window.mixpanel.instance.track(event, prop);
  }
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Mixpanel initialisation
  useEffect(() => {
    const is_development = process.env.NEXT_PUBLIC_APP_ENV === "development";
    window.mixpanel.init(
      process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? "",
      {
        debug: is_development,
        verbose: is_development,
        api_host: process.env.NEXT_PUBLIC_APP_URL.concat("/mp"),
      },
      "instance"
    );
  }, []);

  useEffect(() => {
    // trigger page view event for client-side navigation
    const handleRouteChange = (url: string) => {
      track("page_view");
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <AIHelper />
      <Component {...pageProps} />
    </>
  );
}
