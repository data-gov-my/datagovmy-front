import { useState } from "react";
import { useRouter } from "next/router";
import { languages } from "@lib/options";

/**
 * Language switcher hook.
 * @returns Page with corrent language
 */
export const useLanguage = () => {
  const { pathname, asPath, query, locale, push } = useRouter();
  const [language, setLanguage] = useState(languages.find(language => language.value === locale));

  const onLanguageChange = (lang: any) => {
    push({ pathname, query }, asPath, {
      locale: lang.value,
      scroll: false,
    });
    setLanguage(lang);
  };

  return {
    language,
    onLanguageChange,
  };
};
