import { useTranslation as _useTranslation } from "next-i18next";
import { interpolate } from "../lib/helpers";

/**
 * Modified translation hook. Supports anchor (<a>) tag generation.
 * @param namespace i18n Translation file
 * @returns t, i18n
 */
export const useTranslation = (namespace?: string[] | string) => {
  const { t, i18n } = _useTranslation(namespace ?? "common");
  const _t = (key: string, params?: any): string | any => {
    return interpolate(t<string, any>(key, params));
  };

  return {
    t: _t,
    i18n,
  };
};
