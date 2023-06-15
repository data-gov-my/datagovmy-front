import { __exports as g } from "../../../../_virtual/appWithTranslation.js";
import { __require as $ } from "../../../core-js/modules/es.object.keys.js";
import "../../../core-js/modules/es.symbol.constructor.js";
import "../../../core-js/modules/es.symbol.for.js";
import "../../../core-js/modules/es.symbol.key-for.js";
import "../../../core-js/modules/es.json.stringify.js";
import "../../../core-js/modules/es.object.get-own-property-symbols.js";
import "../../../core-js/modules/es.array.filter.js";
import { __require as A } from "../../../core-js/modules/es.object.to-string.js";
import "../../../core-js/modules/es.object.get-own-property-descriptor.js";
import { __require as B } from "../../../core-js/modules/es.array.for-each.js";
import { __require as H } from "../../../core-js/modules/web.dom-collections.for-each.js";
import "../../../core-js/modules/es.object.get-own-property-descriptors.js";
import "../../../core-js/modules/es.object.define-properties.js";
import "../../../core-js/modules/es.object.define-property.js";
import "../../../core-js/modules/es.array.iterator.js";
import "../../../core-js/modules/es.string.iterator.js";
import "../../../core-js/modules/es.weak-map.constructor.js";
import "../../../core-js/modules/web.dom-collections.iterator.js";
import { i as K } from "../../../@babel/runtime/helpers/interopRequireDefault.js";
import { _ as k } from "../../../@babel/runtime/helpers/typeof.js";
import { __require as z } from "../../../@babel/runtime/helpers/extends.js";
import { __require as F } from "../../../@babel/runtime/helpers/defineProperty.js";
import G from "react";
import { __require as J } from "../../../hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js";
import Q from "react-i18next";
import { __require as U } from "./config/createConfig.js";
import { __require as V } from "./createClient/browser.js";
var T;
function Tr() {
  return T
    ? g
    : ((T = 1),
      (function (o) {
        $(), A(), B(), H();
        var p = K,
          W = k;
        Object.defineProperty(o, "__esModule", {
          value: !0,
        }),
          Object.defineProperty(o, "Trans", {
            enumerable: !0,
            get: function () {
              return s.Trans;
            },
          }),
          (o.globalI18n = o.appWithTranslation = void 0),
          Object.defineProperty(o, "useTranslation", {
            enumerable: !0,
            get: function () {
              return s.useTranslation;
            },
          }),
          Object.defineProperty(o, "withTranslation", {
            enumerable: !0,
            get: function () {
              return s.withTranslation;
            },
          });
        var E = p(z()),
          I = p(F()),
          h = C(G),
          j = p(J()),
          s = Q,
          D = U(),
          x = p(V());
        function O(r) {
          if (typeof WeakMap != "function") return null;
          var i = /* @__PURE__ */ new WeakMap(),
            e = /* @__PURE__ */ new WeakMap();
          return (O = function (f) {
            return f ? e : i;
          })(r);
        }
        function C(r, i) {
          if (!i && r && r.__esModule) return r;
          if (r === null || (W(r) !== "object" && typeof r != "function")) return { default: r };
          var e = O(i);
          if (e && e.has(r)) return e.get(r);
          var t = {},
            f = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var n in r)
            if (n !== "default" && Object.prototype.hasOwnProperty.call(r, n)) {
              var l = f ? Object.getOwnPropertyDescriptor(r, n) : null;
              l && (l.get || l.set) ? Object.defineProperty(t, n, l) : (t[n] = r[n]);
            }
          return (t.default = r), e && e.set(r, t), t;
        }
        var v = h.default.createElement;
        function q(r, i) {
          var e = Object.keys(r);
          if (Object.getOwnPropertySymbols) {
            var t = Object.getOwnPropertySymbols(r);
            i &&
              (t = t.filter(function (f) {
                return Object.getOwnPropertyDescriptor(r, f).enumerable;
              })),
              e.push.apply(e, t);
          }
          return e;
        }
        function _(r) {
          for (var i = 1; i < arguments.length; i++) {
            var e = arguments[i] != null ? arguments[i] : {};
            i % 2
              ? q(Object(e), !0).forEach(function (t) {
                  (0, I.default)(r, t, e[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(e))
              : q(Object(e)).forEach(function (t) {
                  Object.defineProperty(r, t, Object.getOwnPropertyDescriptor(e, t));
                });
          }
          return r;
        }
        var w = null;
        o.globalI18n = w;
        var R = function (i) {
          var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null,
            t = function (n) {
              var l,
                d,
                S = n.pageProps || {},
                a = S._nextI18Next,
                c =
                  (l = a == null ? void 0 : a.initialLocale) !== null && l !== void 0
                    ? l
                    : n == null || (d = n.router) === null || d === void 0
                    ? void 0
                    : d.locale,
                y = a == null ? void 0 : a.ns,
                P = (0, h.useMemo)(
                  function () {
                    var m;
                    if (!a && !e) return null;
                    var u = e ?? (a == null ? void 0 : a.userConfig);
                    if (!u)
                      throw new Error(
                        "appWithTranslation was called without a next-i18next config"
                      );
                    if (!(u != null && u.i18n))
                      throw new Error("appWithTranslation was called without config.i18n");
                    if (!(u != null && (m = u.i18n) !== null && m !== void 0 && m.defaultLocale))
                      throw new Error("config.i18n does not include a defaultLocale property");
                    var M = a || {},
                      N = M.initialI18nStore,
                      L = e != null && e.resources ? e.resources : N;
                    c || (c = u.i18n.defaultLocale);
                    var b = (0, x.default)(
                      _(
                        _(
                          {},
                          (0, D.createConfig)(
                            _(
                              _({}, u),
                              {},
                              {
                                lng: c,
                              }
                            )
                          )
                        ),
                        {},
                        {
                          lng: c,
                          ns: y,
                          resources: L,
                        }
                      )
                    ).i18n;
                    return (o.globalI18n = w = b), b;
                  },
                  [a, c, e, y]
                );
              return P !== null
                ? v(
                    s.I18nextProvider,
                    {
                      i18n: P,
                    },
                    v(i, n)
                  )
                : v(
                    i,
                    (0, E.default)(
                      {
                        key: c,
                      },
                      n
                    )
                  );
            };
          return (0, j.default)(t, i);
        };
        o.appWithTranslation = R;
      })(g),
      g);
}
export { Tr as __require };
