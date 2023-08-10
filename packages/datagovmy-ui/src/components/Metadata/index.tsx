import NextHead from "next/head";
import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";
import useConfig from "next/config";

interface MetadataProps {
  title?: string | null;
  description?: string | null;
  keywords?: string;
}

const Metadata: FunctionComponent<MetadataProps> = ({ title, description, keywords = "" }) => {
  const { t, i18n } = useTranslation();
  const {
    publicRuntimeConfig: {
      APP_NAME,
      META_AUTHOR,
      META_THEME,
      META_DOMAIN,
      META_URL,
      META_IMAGE,
      META_KEYWORDS,
    },
  } = useConfig();

  const META = {
    title: title ? title.concat(" | ", APP_NAME) : APP_NAME,
    icon: "/favicon.ico",
    description: description ? description : t("common:site.description"),
    author: META_AUTHOR,
    themeColor: META_THEME,
    keywords: keywords.concat(META_KEYWORDS),
    domain: META_DOMAIN,
    url: META_URL,
    image: META_IMAGE.replace("{{lang}}", i18n.language),
  };

  return (
    <NextHead>
      <title>{META.title}</title>
      <link rel="shortcut icon" href={META.icon} type="image/x-icon" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={META.description} />
      <meta name="author" content={META.author} />
      <meta name="theme-color" content={META.themeColor} />

      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:url" content={META.url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:image" content={META.image} />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={META.domain} />
      <meta property="twitter:url" content={META.url} />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />
      <meta name="twitter:image" content={META.image} />
    </NextHead>
  );
};

export default Metadata;
