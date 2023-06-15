import { __exports as x } from "../../../../../_virtual/createConfig.js";
import { __require as qr } from "../../../../core-js/modules/es.object.keys.js";
import "../../../../core-js/modules/es.symbol.constructor.js";
import "../../../../core-js/modules/es.symbol.for.js";
import "../../../../core-js/modules/es.symbol.key-for.js";
import "../../../../core-js/modules/es.json.stringify.js";
import "../../../../core-js/modules/es.object.get-own-property-symbols.js";
import "../../../../core-js/modules/es.object.get-own-property-descriptor.js";
import { __require as br } from "../../../../core-js/modules/web.dom-collections.for-each.js";
import "../../../../core-js/modules/es.object.get-own-property-descriptors.js";
import "../../../../core-js/modules/es.object.define-properties.js";
import "../../../../core-js/modules/es.object.define-property.js";
import { __require as Er } from "../../../../core-js/modules/es.array.slice.js";
import { __require as hr } from "../../../../core-js/modules/es.function.name.js";
import { __require as wr } from "../../../../core-js/modules/es.array.from.js";
import "../../../../core-js/modules/es.string.iterator.js";
import { __require as Pr } from "../../../../core-js/modules/es.symbol.description.js";
import { __require as Sr } from "../../../../core-js/modules/es.symbol.iterator.js";
import "../../../../core-js/modules/es.array.iterator.js";
import "../../../../core-js/modules/web.dom-collections.iterator.js";
import { i as Or } from "../../../../@babel/runtime/helpers/interopRequireDefault.js";
import "../../../../core-js/modules/es.array.filter.js";
import { __require as kr } from "../../../../core-js/modules/es.object.to-string.js";
import { __require as xr } from "../../../../core-js/modules/es.array.concat.js";
import { __require as jr } from "../../../../core-js/modules/es.array.reduce.js";
import { __require as Lr } from "../../../../core-js/modules/es.array.includes.js";
import { __require as Ar } from "../../../../core-js/modules/es.string.includes.js";
import { __require as Dr } from "../../../../core-js/modules/es.array.is-array.js";
import { __require as Nr } from "../../../../core-js/modules/es.object.entries.js";
import { __require as $r } from "../../../../core-js/modules/es.array.some.js";
import { __require as Cr } from "../../../../core-js/modules/es.regexp.exec.js";
import { __require as Ir } from "../../../../core-js/modules/es.string.replace.js";
import { __require as Fr } from "../../../../core-js/modules/es.array.join.js";
import { __require as Tr } from "../../../../core-js/modules/es.array.map.js";
import { __require as Mr } from "../../../../core-js/modules/es.array.index-of.js";
import { __require as Rr } from "../../../../core-js/modules/es.array.for-each.js";
import { __require as Ur } from "../../../../@babel/runtime/helpers/toConsumableArray.js";
import { _ as Wr } from "../../../../@babel/runtime/helpers/typeof.js";
import { __require as Br } from "../../../../@babel/runtime/helpers/slicedToArray.js";
import { __require as Vr } from "../../../../@babel/runtime/helpers/defineProperty.js";
import { __require as Hr } from "../../../../@babel/runtime/helpers/objectWithoutProperties.js";
import { __require as Kr } from "./defaultConfig.js";
import { __require as zr } from "../utils.js";
import X from "../../../../../_virtual/___vite-browser-external.js";
var Y;
function Te() {
  if (Y) return x;
  (Y = 1), qr(), br(), Er(), hr(), wr(), Pr(), Sr();
  var P = Or;
  Object.defineProperty(x, "__esModule", {
    value: !0,
  }),
    (x.createConfig = void 0),
    kr(),
    xr(),
    jr(),
    Lr(),
    Ar(),
    Dr(),
    Nr(),
    $r(),
    Cr(),
    Ir(),
    Fr(),
    Tr(),
    Mr(),
    Rr();
  var $ = P(Ur()),
    T = P(Wr),
    C = P(Br()),
    Z = P(Vr()),
    M = P(Hr()),
    R = Kr(),
    y = zr(),
    rr = ["i18n"],
    er = ["i18n"];
  function tr(a, e) {
    var t = (typeof Symbol < "u" && a[Symbol.iterator]) || a["@@iterator"];
    if (!t) {
      if (Array.isArray(a) || (t = ar(a)) || (e && a && typeof a.length == "number")) {
        t && (a = t);
        var i = 0,
          f = function () {};
        return {
          s: f,
          n: function () {
            return i >= a.length ? { done: !0 } : { done: !1, value: a[i++] };
          },
          e: function (r) {
            throw r;
          },
          f,
        };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var j = !0,
      L = !1,
      A;
    return {
      s: function () {
        t = t.call(a);
      },
      n: function () {
        var r = t.next();
        return (j = r.done), r;
      },
      e: function (r) {
        (L = !0), (A = r);
      },
      f: function () {
        try {
          !j && t.return != null && t.return();
        } finally {
          if (L) throw A;
        }
      },
    };
  }
  function ar(a, e) {
    if (a) {
      if (typeof a == "string") return U(a, e);
      var t = Object.prototype.toString.call(a).slice(8, -1);
      if ((t === "Object" && a.constructor && (t = a.constructor.name), t === "Map" || t === "Set"))
        return Array.from(a);
      if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)) return U(a, e);
    }
  }
  function U(a, e) {
    (e == null || e > a.length) && (e = a.length);
    for (var t = 0, i = new Array(e); t < e; t++) i[t] = a[t];
    return i;
  }
  function W(a, e) {
    var t = Object.keys(a);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(a);
      e &&
        (i = i.filter(function (f) {
          return Object.getOwnPropertyDescriptor(a, f).enumerable;
        })),
        t.push.apply(t, i);
    }
    return t;
  }
  function g(a) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e] != null ? arguments[e] : {};
      e % 2
        ? W(Object(t), !0).forEach(function (i) {
            (0, Z.default)(a, i, t[i]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(t))
        : W(Object(t)).forEach(function (i) {
            Object.defineProperty(a, i, Object.getOwnPropertyDescriptor(t, i));
          });
    }
    return a;
  }
  var nr = ["backend", "detection"],
    or = function (e) {
      var t, i, f;
      if (typeof (e == null ? void 0 : e.lng) != "string")
        throw new Error("config.lng was not passed into createConfig");
      var j = e.i18n,
        L = (0, M.default)(e, rr),
        A = R.defaultConfig.i18n,
        s = (0, M.default)(R.defaultConfig, er),
        r = g(g(g(g({}, s), L), A), j),
        S = r.defaultNS,
        l = r.lng,
        q = r.localeExtension,
        o = r.localePath,
        ir = r.nonExplicitSupportedLngs,
        B = r.locales.filter(function (n) {
          return n !== "default";
        });
      if (l === "cimode") return r;
      if (
        typeof r.fallbackLng > "u" &&
        ((r.fallbackLng = r.defaultLocale), r.fallbackLng === "default")
      ) {
        var cr = (0, C.default)(B, 1);
        r.fallbackLng = cr[0];
      }
      var D = e == null || (t = e.interpolation) === null || t === void 0 ? void 0 : t.prefix,
        N = e == null || (i = e.interpolation) === null || i === void 0 ? void 0 : i.suffix,
        b = D ?? "{{",
        E = N ?? "}}";
      typeof (e == null ? void 0 : e.localeStructure) != "string" &&
        (D || N) &&
        (r.localeStructure = "".concat(b, "lng").concat(E, "/").concat(b, "ns").concat(E));
      var d = r.fallbackLng,
        _ = r.localeStructure;
      if (ir) {
        var V = function (c, u) {
          var v = u.split("-"),
            p = (0, C.default)(v, 1),
            w = p[0];
          return (c[u] = [w]), c;
        };
        if (typeof d == "string")
          r.fallbackLng = r.locales
            .filter(function (n) {
              return n.includes("-");
            })
            .reduce(V, {
              default: [d],
            });
        else if (Array.isArray(d))
          r.fallbackLng = r.locales
            .filter(function (n) {
              return n.includes("-");
            })
            .reduce(V, {
              default: d,
            });
        else if ((0, T.default)(d) === "object")
          r.fallbackLng = Object.entries(r.fallbackLng).reduce(function (n, c) {
            var u = (0, C.default)(c, 2),
              v = u[0],
              p = u[1];
            return (
              (n[v] = v.includes("-")
                ? (0, y.unique)([v.split("-")[0]].concat((0, $.default)(p)))
                : p),
              n
            );
          }, d);
        else if (typeof d == "function")
          throw new Error(
            "If nonExplicitSupportedLngs is true, no functions are allowed for fallbackLng"
          );
      }
      var H =
        e == null || (f = e.use) === null || f === void 0
          ? void 0
          : f.some(function (n) {
              return n.type === "backend";
            });
      if (!process.browser && typeof window > "u") {
        if (((r.preload = B), !H)) {
          var m = X,
            h = X;
          if (typeof S == "string" && typeof l < "u") {
            if (typeof o == "string") {
              var ur = _.replace("".concat(b, "lng").concat(E), l).replace(
                  "".concat(b, "ns").concat(E),
                  S
                ),
                K = "/".concat(ur, ".").concat(q),
                z = h.join(o, K),
                lr = m.existsSync(z),
                fr = (0, y.getFallbackForLng)(l, r.fallbackLng),
                sr = fr.some(function (n) {
                  var c = K.replace(l, n),
                    u = h.join(o, c);
                  return m.existsSync(u);
                });
              if (!lr && !sr && process.env.NODE_ENV !== "production")
                throw new Error("Default namespace not found at ".concat(z));
            } else if (typeof o == "function") {
              var G = o(l, S, !1),
                pr = m.existsSync(G),
                dr = (0, y.getFallbackForLng)(l, r.fallbackLng),
                _r = dr.some(function (n) {
                  var c = o(n, S, !1);
                  return m.existsSync(c);
                });
              if (!pr && !_r && process.env.NODE_ENV !== "production")
                throw new Error("Default namespace not found at ".concat(G));
            }
          }
          if (typeof o == "string")
            r.backend = {
              addPath: h.resolve(process.cwd(), "".concat(o, "/").concat(_, ".missing.").concat(q)),
              loadPath: h.resolve(process.cwd(), "".concat(o, "/").concat(_, ".").concat(q)),
            };
          else if (typeof o == "function")
            r.backend = {
              addPath: function (c, u) {
                return o(c, u, !0);
              },
              loadPath: function (c, u) {
                return o(c, u, !1);
              },
            };
          else throw new Error("Unsupported localePath type: ".concat((0, T.default)(o)));
          if (!r.ns && typeof l < "u") {
            if (typeof o == "function")
              throw new Error(
                "Must provide all namespaces in ns option if using a function as localePath"
              );
            var mr = function (c) {
              var u = function O(I) {
                  var k = [];
                  return (
                    m.existsSync(I) &&
                      m.readdirSync(I).map(function (F) {
                        var Q = h.join(I, F);
                        if (m.statSync(Q).isDirectory()) {
                          var yr = O(Q).map(function (gr) {
                            return "".concat(F, "/").concat(gr);
                          });
                          k = k.concat(yr);
                          return;
                        }
                        k.push(F.replace(".".concat(q), ""));
                      }),
                    k
                  );
                },
                v = c.map(function (O) {
                  return u(h.resolve(process.cwd(), "".concat(o, "/").concat(O)));
                }),
                p = [],
                w = tr(v),
                J;
              try {
                for (w.s(); !(J = w.n()).done; ) {
                  var vr = J.value;
                  p.push.apply(p, (0, $.default)(vr));
                }
              } catch (O) {
                w.e(O);
              } finally {
                w.f();
              }
              return (0, y.unique)(p);
            };
            if (_.indexOf("".concat(b, "lng").concat(E)) > _.indexOf("".concat(b, "ns").concat(E)))
              throw new Error(
                "Must provide all namespaces in ns option if using a localeStructure that is not namespace-listable like lng/ns"
              );
            r.ns = mr(
              (0, y.unique)([l].concat((0, $.default)((0, y.getFallbackForLng)(l, r.fallbackLng))))
            );
          }
        }
      } else
        H ||
          (typeof o == "string"
            ? (r.backend = {
                addPath: "".concat(o, "/").concat(_, ".missing.").concat(q),
                loadPath: "".concat(o, "/").concat(_, ".").concat(q),
              })
            : typeof o == "function" &&
              (r.backend = {
                addPath: function (c, u) {
                  return o(c, u, !0);
                },
                loadPath: function (c, u) {
                  return o(c, u, !1);
                },
              })),
          typeof r.ns != "string" && !Array.isArray(r.ns) && (r.ns = [S]);
      return (
        nr.forEach(function (n) {
          e[n] && (r[n] = g(g({}, r[n]), e[n]));
        }),
        r
      );
    };
  return (x.createConfig = or), x;
}
export { Te as __require };
