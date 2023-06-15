import { __exports as e } from "../../../../../_virtual/defaultConfig.js";
import "../../../../core-js/modules/es.object.define-property.js";
var r;
function c() {
  if (r) return e;
  (r = 1),
    Object.defineProperty(e, "__esModule", {
      value: !0,
    }),
    (e.defaultConfig = void 0);
  var a = "en",
    o = ["en"],
    t = "common",
    n = "./public/locales",
    l = "{{lng}}/{{ns}}",
    i = "json",
    u = {
      defaultNS: t,
      errorStackTraceLimit: 0,
      i18n: {
        defaultLocale: a,
        locales: o,
      },
      get initImmediate() {
        return process.browser && typeof window < "u";
      },
      interpolation: {
        escapeValue: !1,
      },
      load: "currentOnly",
      localeExtension: i,
      localePath: n,
      localeStructure: l,
      react: {
        useSuspense: !1,
      },
      reloadOnPrerender: !1,
      serializeConfig: !0,
      use: [],
    };
  return (e.defaultConfig = u), e;
}
export { c as __require };
