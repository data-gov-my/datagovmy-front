import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { en, ms } from "./i18n";
import { useRouter } from "next/router";
const useLocalStorage = <T>(key: string, defaultValue: {}): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String(defaultValue));
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

const useSessionStorage = (key: string, defaultValue: string = "") => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(sessionStorage.getItem(key) || String(defaultValue));
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

const useTranslation = () => {
  const { locale, defaultLocale } = useRouter();

  const getValueByDotNotation = (obj: any, dotNotation: string) => {
    const properties = dotNotation.split(".");
    let value = obj;
    for (let i = 0; i < properties.length; i++) {
      value = value[properties[i]];
      if (value === undefined) return dotNotation; // Property not found, return undefined
    }
    return value;
  };

  const t = (key: string) => {
    const _locale = locale ? locale : defaultLocale ? defaultLocale : "en";
    const dict = _locale === "ms" ? ms : en;
    return getValueByDotNotation(dict, key);
  };

  return { t, locale: locale };
};

export { useLocalStorage, useSessionStorage, useTranslation };
