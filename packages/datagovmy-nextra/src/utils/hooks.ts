import { useState, useEffect } from "react";
import { en, ms } from "./i18n";
const useLocalStorage = (key: string, defaultValue: {}) => {
  const [value, setValue] = useState(() => {
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

const useTranslation = (locale?: string) => {
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
    const dict = locale === "ms" ? ms : en;
    return getValueByDotNotation(dict, key);
  };

  return { t };
};

export { useLocalStorage, useSessionStorage, useTranslation };
