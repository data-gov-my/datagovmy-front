import type { AppProps } from "next/app";
import { AIHelper } from "datagovmy-nextra";
import "datagovmy-nextra/style.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AIHelper />
      <Component {...pageProps} />
    </>
  );
}
