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
    const isHomePage = cleanPath === "/" || cleanPath === "/index.en" || cleanPath === "/index.ms";
    const pageTitle = "Malaysia's Official Open API";

    console.log("SEO Props:", {
      path: cleanPath,
      isHomePage,
      pageTitle,
      titleTemplate: isHomePage ? pageTitle : `%s - ${pageTitle}`,
    });

    return {
      title: isHomePage ? pageTitle : undefined,
      titleTemplate: isHomePage ? pageTitle : `%s - ${pageTitle}`,
      description: description[lang],
      openGraph: {
        title: pageTitle,
        description: description[lang],
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
} satisfies DocsThemeConfig;
