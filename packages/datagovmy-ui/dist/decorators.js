import { s as a } from "./external/next-i18next/serverSideTranslations.js";
import l from "./external/lodash/merge.js";
const e = (r, n) => async o => {
  const s = r === null ? ["common"] : Array.isArray(r) ? r.concat("common") : [r].concat("common"),
    [i, t] = await Promise.all([a.serverSideTranslations(o.locale, s, null), n(o)]);
  return l({}, { props: i }, t);
};
export { e as withi18n };
