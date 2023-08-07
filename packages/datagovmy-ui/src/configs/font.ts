import { Poppins, Inter } from "next/font/google";

const header = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-header",
});

const body = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export { header, body };
