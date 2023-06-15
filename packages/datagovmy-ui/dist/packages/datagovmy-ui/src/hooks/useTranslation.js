import { useTranslation as a } from "next-i18next";
import { interpolate as e } from "../../../../helpers.js";
const c = t => {
  const { t: n, i18n: o } = a(t ?? "common");
  return {
    t: (r, s) => e(n(r, s)),
    i18n: o,
  };
};
export { c as useTranslation };
