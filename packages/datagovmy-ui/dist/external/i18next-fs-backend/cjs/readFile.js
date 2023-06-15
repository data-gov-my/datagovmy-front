import { commonjsRequire as c } from "../../../_virtual/_commonjs-dynamic-modules.js";
import { __module as s } from "../../../_virtual/readFile.js";
import { __require as J } from "./formats/json5.js";
import { __require as T } from "./formats/yaml.js";
import { __require as Y } from "./fs.js";
import { __require as k } from "./path.js";
import { __require as B } from "./extname.js";
var g;
function X() {
  return g
    ? s.exports
    : ((g = 1),
      (function (L, f) {
        function l(e) {
          "@babel/helpers - typeof";
          return (
            (l =
              typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
                ? function (r) {
                    return typeof r;
                  }
                : function (r) {
                    return r &&
                      typeof Symbol == "function" &&
                      r.constructor === Symbol &&
                      r !== Symbol.prototype
                      ? "symbol"
                      : typeof r;
                  }),
            l(e)
          );
        }
        Object.defineProperty(f, "__esModule", {
          value: !0,
        }),
          (f.readFile = b),
          (f.readFileSync = A);
        var O = h(J()),
          p = h(T()),
          v = q(Y()),
          y = q(k()),
          _ = h(B());
        function F(e) {
          if (typeof WeakMap != "function") return null;
          var r = /* @__PURE__ */ new WeakMap(),
            t = /* @__PURE__ */ new WeakMap();
          return (F = function (a) {
            return a ? t : r;
          })(e);
        }
        function q(e, r) {
          if (!r && e && e.__esModule) return e;
          if (e === null || (l(e) !== "object" && typeof e != "function")) return { default: e };
          var t = F(r);
          if (t && t.has(e)) return t.get(e);
          var n = {},
            a = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var u in e)
            if (u !== "default" && Object.prototype.hasOwnProperty.call(e, u)) {
              var o = a ? Object.getOwnPropertyDescriptor(e, u) : null;
              o && (o.get || o.set) ? Object.defineProperty(n, u, o) : (n[u] = e[u]);
            }
          return (n.default = e), t && t.set(e, n), n;
        }
        function h(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var D = typeof Deno < "u",
          x = typeof p.default < "u" && p.default.load ? p.default : void 0,
          i = v ? v.default || v : void 0,
          S = y ? y.default || y : void 0,
          I = eval,
          M = function (r) {
            var t = i.readFileSync(r, "utf8"),
              n;
            try {
              n = i.statSync(r);
            } catch {}
            return {
              data: t,
              stat: n,
            };
          },
          R = function (r) {
            return new Promise(function (t, n) {
              i.readFile(r, "utf8", function (a, u) {
                if (a) return n(a);
                i.stat(r, function (o, d) {
                  return t(
                    o
                      ? {
                          data: u,
                        }
                      : {
                          data: u,
                          stat: d,
                        }
                  );
                });
              });
            });
          },
          N = function (r) {
            var t = new TextDecoder("utf-8"),
              n = Deno.readFileSync(r),
              a = t.decode(n),
              u;
            try {
              u = Deno.statSync(r);
            } catch {}
            return {
              data: a,
              stat: u,
            };
          },
          W = function (r) {
            return new Promise(function (t, n) {
              var a = new TextDecoder("utf-8");
              Deno.readFile(r)
                .then(function (u) {
                  var o = a.decode(u);
                  Deno.stat(r)
                    .then(function (d) {
                      return t({
                        data: o,
                        stat: d,
                      });
                    })
                    .catch(function () {
                      return t({
                        data: o,
                      });
                    });
                })
                .catch(n);
            });
          },
          w = function (r, t, n) {
            t = t.replace(/^\uFEFF/, "");
            var a = {};
            switch (r) {
              case ".js":
              case ".ts":
                a = I(t);
                break;
              case ".json5":
                a = O.default.parse(t);
                break;
              case ".yml":
              case ".yaml":
                a = x.load(t);
                break;
              default:
                a = n.parse(t);
            }
            return a;
          },
          P = function (r) {
            return !S.isAbsolute(r) && typeof process < "u" && process.cwd && !i.existsSync(r)
              ? S.join(process.cwd(), r)
              : r;
          };
        function A(e, r) {
          var t = (0, _.default)(e);
          if ([".js", ".ts"].indexOf(t) > -1 && typeof c < "u") return c(P(e));
          var n, a;
          if (D) {
            var u = N(e);
            (n = u.data), (a = u.stat);
          } else {
            var o = M(e);
            (n = o.data), (a = o.stat);
          }
          return {
            data: w(t, n, r),
            stat: a,
          };
        }
        function b(e) {
          var r =
              arguments.length > 1 && arguments[1] !== void 0
                ? arguments[1]
                : {
                    parse: JSON.parse,
                  },
            t = (0, _.default)(e);
          if ([".js", ".ts"].indexOf(t) > -1 && typeof c < "u")
            return new Promise(function (a, u) {
              try {
                a({
                  data: c(P(e)),
                });
              } catch (o) {
                u(o);
              }
            });
          var n = D ? W : R;
          return new Promise(function (a, u) {
            n(e)
              .then(function (o) {
                var d = o.data,
                  C = o.stat;
                try {
                  var E = w(t, d, r);
                  a({
                    data: E,
                    stat: C,
                  });
                } catch (m) {
                  (m.message = "error parsing " + e + ": " + m.message), u(m);
                }
              })
              .catch(u);
          });
        }
      })(s, s.exports),
      s.exports);
}
export { X as __require };
