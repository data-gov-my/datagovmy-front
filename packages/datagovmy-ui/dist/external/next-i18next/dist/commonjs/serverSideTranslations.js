import { commonjsRequire as M } from "../../../../_virtual/_commonjs-dynamic-modules.js";
import { __exports as P } from "../../../../_virtual/serverSideTranslations.js";
import "../../../core-js/modules/es.array.iterator.js";
import "../../../core-js/modules/es.string.iterator.js";
import "../../../core-js/modules/es.weak-map.constructor.js";
import "../../../core-js/modules/web.dom-collections.iterator.js";
import "../../../core-js/modules/es.object.define-property.js";
import "../../../core-js/modules/es.object.get-own-property-descriptor.js";
import "../../../core-js/modules/es.symbol.constructor.js";
import "../../../core-js/modules/es.symbol.for.js";
import "../../../core-js/modules/es.symbol.key-for.js";
import "../../../core-js/modules/es.json.stringify.js";
import "../../../core-js/modules/es.object.get-own-property-symbols.js";
import "../../../core-js/modules/es.array.filter.js";
import "../../../core-js/modules/es.object.get-own-property-descriptors.js";
import "../../../core-js/modules/es.object.define-properties.js";
import { i as G } from "../../../@babel/runtime/helpers/interopRequireDefault.js";
import { _ as $ } from "../../../@babel/runtime/helpers/typeof.js";
import { __require as U } from "../../../@babel/runtime/regenerator/index.js";
import { __require as B } from "../../../core-js/modules/es.object.to-string.js";
import { __require as H } from "../../../core-js/modules/es.promise.js";
import { __require as X } from "../../../core-js/modules/es.array.some.js";
import { __require as z } from "../../../core-js/modules/es.array.for-each.js";
import { __require as K } from "../../../core-js/modules/web.dom-collections.for-each.js";
import { __require as J } from "../../../core-js/modules/es.array.concat.js";
import { __require as Q } from "../../../core-js/modules/es.array.is-array.js";
import { __require as V } from "../../../core-js/modules/es.array.map.js";
import { __require as Y } from "../../../core-js/modules/es.regexp.exec.js";
import { __require as Z } from "../../../core-js/modules/es.string.replace.js";
import { __require as rr } from "../../../core-js/modules/es.array.flat.js";
import { __require as er } from "../../../core-js/modules/es.array.unscopables.flat.js";
import { __require as tr } from "../../../core-js/modules/es.object.keys.js";
import { __require as ar } from "../../../@babel/runtime/helpers/defineProperty.js";
import { __require as ir } from "../../../@babel/runtime/helpers/asyncToGenerator.js";
import R from "../../../../_virtual/___vite-browser-external.js";
import { __require as nr } from "./config/createConfig.js";
import { __require as or } from "./createClient/node.js";
import { __require as sr } from "./appWithTranslation.js";
import { __require as ur } from "./utils.js";
var m = G,
  fr = $;
Object.defineProperty(P, "__esModule", {
  value: !0,
});
P.serverSideTranslations = void 0;
var D = m(U());
B();
H();
X();
z();
K();
J();
Q();
V();
Y();
Z();
rr();
er();
tr();
var j = m(ar()),
  cr = m(ir()),
  O = m(R),
  I = m(R),
  lr = nr(),
  pr = m(or()),
  E = sr(),
  A = ur();
function N(r, i) {
  var e = Object.keys(r);
  if (Object.getOwnPropertySymbols) {
    var t = Object.getOwnPropertySymbols(r);
    i &&
      (t = t.filter(function (s) {
        return Object.getOwnPropertyDescriptor(r, s).enumerable;
      })),
      e.push.apply(e, t);
  }
  return e;
}
function g(r) {
  for (var i = 1; i < arguments.length; i++) {
    var e = arguments[i] != null ? arguments[i] : {};
    i % 2
      ? N(Object(e), !0).forEach(function (t) {
          (0, j.default)(r, t, e[t]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(e))
      : N(Object(e)).forEach(function (t) {
          Object.defineProperty(r, t, Object.getOwnPropertyDescriptor(e, t));
        });
  }
  return r;
}
function W(r) {
  if (typeof WeakMap != "function") return null;
  var i = /* @__PURE__ */ new WeakMap(),
    e = /* @__PURE__ */ new WeakMap();
  return (W = function (s) {
    return s ? e : i;
  })(r);
}
function mr(r, i) {
  if (!i && r && r.__esModule) return r;
  if (r === null || (fr(r) !== "object" && typeof r != "function")) return { default: r };
  var e = W(i);
  if (e && e.has(r)) return e.get(r);
  var t = {},
    s = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var n in r)
    if (n !== "default" && Object.prototype.hasOwnProperty.call(r, n)) {
      var f = s ? Object.getOwnPropertyDescriptor(r, n) : null;
      f && (f.get || f.set) ? Object.defineProperty(t, n, f) : (t[n] = r[n]);
    }
  return (t.default = r), e && e.set(r, t), t;
}
var F = "./next-i18next.config.js";
process.env.I18NEXT_DEFAULT_CONFIG_PATH && (F = process.env.I18NEXT_DEFAULT_CONFIG_PATH);
var _r = /* @__PURE__ */ (function () {
  var r = (0, cr.default)(
    /* @__PURE__ */ D.default.mark(function i(e) {
      var t,
        s,
        n,
        f,
        b,
        c,
        d,
        l,
        w,
        q,
        v,
        T,
        y,
        h,
        C,
        S,
        p,
        x,
        k,
        u = arguments;
      return D.default.wrap(function (a) {
        for (;;)
          switch ((a.prev = a.next)) {
            case 0:
              if (
                ((n = u.length > 1 && u[1] !== void 0 ? u[1] : void 0),
                (f = u.length > 2 && u[2] !== void 0 ? u[2] : null),
                (b = u.length > 3 && u[3] !== void 0 ? u[3] : !1),
                typeof e == "string")
              ) {
                a.next = 5;
                break;
              }
              throw new Error("Initial locale argument was not passed into serverSideTranslations");
            case 5:
              if (((c = f), (d = I.default.resolve(F)), !(!c && O.default.existsSync(d)))) {
                a.next = 11;
                break;
              }
              return (
                (a.next = 10),
                Promise.resolve("".concat(d)).then(function (o) {
                  return mr(M(o));
                })
              );
            case 10:
              c = a.sent;
            case 11:
              if (c !== null) {
                a.next = 13;
                break;
              }
              throw new Error("next-i18next was unable to find a user config at ".concat(d));
            case 13:
              if (
                ((l = (0, lr.createConfig)(
                  g(
                    g({}, c),
                    {},
                    {
                      lng: e,
                    }
                  )
                )),
                (w = l.localeExtension),
                (q = l.localePath),
                (v = l.fallbackLng),
                (T = l.reloadOnPrerender),
                !T)
              ) {
                a.next = 18;
                break;
              }
              return (
                (a.next = 18),
                E.globalI18n === null || E.globalI18n === void 0
                  ? void 0
                  : E.globalI18n.reloadResources()
              );
            case 18:
              return (
                (y = (0, pr.default)(
                  g(
                    g({}, l),
                    {},
                    {
                      lng: e,
                    }
                  )
                )),
                (h = y.i18n),
                (C = y.initPromise),
                (a.next = 21),
                C
              );
            case 21:
              if (
                ((S =
                  (t = c) === null || t === void 0 || (s = t.use) === null || s === void 0
                    ? void 0
                    : s.some(function (o) {
                        return o.type === "backend";
                      })),
                !(S && n))
              ) {
                a.next = 25;
                break;
              }
              return (a.next = 25), h.loadNamespaces(n);
            case 25:
              if (
                ((p = (0, j.default)({}, e, {})),
                (0, A.getFallbackForLng)(e, v ?? !1)
                  .concat(b || [])
                  .forEach(function (o) {
                    p[o] = {};
                  }),
                Array.isArray(n))
              ) {
                a.next = 33;
                break;
              }
              if (typeof q != "function") {
                a.next = 30;
                break;
              }
              throw new Error(
                "Must provide namespacesRequired to serverSideTranslations when using a function as localePath"
              );
            case 30:
              (x = function (_) {
                return O.default.existsSync(_)
                  ? O.default.readdirSync(_).map(function (L) {
                      return L.replace(".".concat(w), "");
                    })
                  : [];
              }),
                (k = Object.keys(p)
                  .map(function (o) {
                    return x(I.default.resolve(process.cwd(), "".concat(q, "/").concat(o)));
                  })
                  .flat()),
                (n = (0, A.unique)(k));
            case 33:
              return (
                n.forEach(function (o) {
                  for (var _ in p) p[_][o] = (h.services.resourceStore.data[_] || {})[o] || {};
                }),
                a.abrupt("return", {
                  _nextI18Next: {
                    initialI18nStore: p,
                    initialLocale: e,
                    ns: n,
                    userConfig: l.serializeConfig ? c : null,
                  },
                })
              );
            case 35:
            case "end":
              return a.stop();
          }
      }, i);
    })
  );
  return function (e) {
    return r.apply(this, arguments);
  };
})();
P.serverSideTranslations = _r;
export { P as default };
