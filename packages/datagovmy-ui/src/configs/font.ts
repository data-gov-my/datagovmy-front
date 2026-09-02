import localFont from "next/font/local";

const header = localFont({
  src: "../assets/fonts/poppins-latin-700.woff2",
  weight: "700",
  variable: "--font-header",
});

const body = localFont({
  src: "../assets/fonts/inter-latin.woff2",
  weight: "100 900",
  variable: "--font-body",
});

export { header, body };
