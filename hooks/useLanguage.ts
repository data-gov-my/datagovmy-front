import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
/**
 * Language switcher hook.
 * @returns Page with current language
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();
  const { pathname, asPath, query, locale, push } = useRouter();
  const exceptions = ["/data-catalogue", "/data-catalogue/[id]", "/dashboard"]; // for getServerSideProps pages.

  const onLanguageChange = (lang: any) => {
    i18n.changeLanguage(lang.value).then(() =>
      push({ pathname, query }, asPath, {
        locale: lang.value,
        scroll: false,
        shallow: !exceptions.includes(pathname),
      })
    );
  };

  return {
    language: locale,
    onLanguageChange,
  };
};
