import { useRouter } from "next/router";

/**
 * Language switcher hook.
 * @returns Page with corrent language
 */
export const useLanguage = () => {
  const { pathname, asPath, query, locale, push } = useRouter();

  const onLanguageChange = (lang: any) => {
    push({ pathname, query }, asPath, {
      locale: lang.value,
      scroll: false,
    });
  };

  return {
    language: locale,
    onLanguageChange,
  };
};
