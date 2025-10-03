import "datagovmy-nextra/style.css";
import type { AppProps } from "next/app";
import { AIHelper } from "datagovmy-nextra";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AIHelper />
      <Component {...pageProps} />
    </>
  );
}
