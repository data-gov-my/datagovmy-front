import type { AppProps } from "next/app";

import "datagovmy-nextra/style.css";
import "../styles/index.css";
import Fonts from "../config/font";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={[Fonts.body.variable, Fonts.header.variable].join(" ")}>
      <Component {...pageProps} />
    </main>
  );
}
