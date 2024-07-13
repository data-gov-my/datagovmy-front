import Image from "next/image";
import { useRouter } from "next/router";
import type { DocsThemeConfig } from "datagovmy-nextra";

export default {
  logo: (
    <>
      <Image src="/assets/logo.png" width={32} height={32} alt="data.gov.my" />
      <h4 className="block">data.gov.my</h4>
      <span
        style={{
          fontSize: "12px",
          lineHeight: 1,
          border: "2px solid",
          borderRadius: 6,
          padding: "2px 6px",
          fontFamily: "Inter",
          fontWeight: 700,
        }}
      >
        API
      </span>
    </>
  ),
  useNextSeoProps: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const lang = locale || defaultLocale || "en";
    const description: Record<string, string> = {
      en: "OpenAPI Documentation helps you to explore the extensive array of open datasets and realtime information produced by the Malaysian government via APIs. ",
      ms: "Dokumentasi OpenAPI sedia membantu anda meneroka pelbagai set data terbuka dan maklumat masa nyata yang dihasilkan oleh kerajaan Malaysia melalui API",
    };

    const cleanPath = asPath.split(/[?#]/)[0];

    let pageTitle = "Malaysia's Official Open API";

    if (cleanPath === "/realtime-api/gtfs-static") {
      pageTitle = "GTFS Static";
    } else if (cleanPath === "/realtime-api/gtfs-realtime") {
      pageTitle = "GTFS Realtime";
    } else if (cleanPath !== "/" && cleanPath.length > 1) {
      pageTitle =
        cleanPath
          .split("/")
          .pop()
          ?.split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") || "Malaysia's Official Open API";
    }

    const fullTitle = cleanPath === "/" ? pageTitle : `${pageTitle} - Malaysia's Official Open API`;

    return {
      title: pageTitle,
      titleTemplate: cleanPath === "/" ? "%s" : "%s - Malaysia's Official Open API",
      description: description[lang],
      openGraph: {
        title: fullTitle,
        description: description[lang],
        type: "website",
        url: `${process.env.NEXT_PUBLIC_APP_URL}${cleanPath}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/assets/og_${lang}.png`,
            alt: `og_${lang}.png`,
          },
        ],
      },
    };
  },
  search: {
    placeholder: () => {
      const { defaultLocale, locale } = useRouter();
      const lang = locale || defaultLocale || "en";
      return lang === "en" ? "Search API docs" : "Cari dokumentasi API";
    },
  },
  project: {
    link: "https://github.com/data-gov-my/datagovmy-front",
  },
  i18n: [
    { locale: "en", text: "English" },
    { locale: "ms", text: "Bahasa Melayu" },
  ],
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="" />
    </>
  ),
} satisfies DocsThemeConfig;
