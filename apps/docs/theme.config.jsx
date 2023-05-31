import Image from "next/image";

/** @type {import('datagovmy-nextra').DocsThemeConfig} */
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
  search: {
    placeholder: "Search API docs",
  },
  project: {
    link: "https://github.com/data-gov-my/datagovmy-front",
  },
  i18n: [
    { locale: "en", text: "English" },
    { locale: "ms", text: "Bahasa Melayu" },
  ],
};
