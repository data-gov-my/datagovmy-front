import NextHead from "next/head";
import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const Metadata: FunctionComponent<MetadataProps> = ({ title, description, keywords }) => {
  const { t } = useTranslation();

  const META = {
    title: title ? title.concat(" | KKMNOW") : "KKMNOW",
    icon: "/favicon.ico",
    description: description ? description : t("site.description"),
    author: "Ministry of Health & Department of Statistics Malaysia",
    themeColor: "#13293D",
    keywords: keywords ?? "kkmnow kementerian kesihatan covidnow statistics malaysia",
    domain: "data.moh.gov.my",
    url: "https:/data.moh.gov.my",
    image: "https://data.moh.gov.my/static/images/jata_512.png",
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
