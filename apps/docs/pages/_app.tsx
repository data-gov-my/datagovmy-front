import type { AppProps } from "next/app";
import "datagovmy-nextra/style.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
