import { __module as d } from "../../../_virtual/writeFile.js";
import { __require as A } from "./formats/json5.js";
import { __require as E } from "./formats/yaml.js";
import { __require as b } from "./fs.js";
import { __require as J } from "./extname.js";
var g;
function H() {
  return g
    ? d.exports
    : ((g = 1),
      (function (T, c) {
        function s(e) {
          "@babel/helpers - typeof";
          return (
            (s =
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
            s(e)
          );
        }
        Object.defineProperty(c, "__esModule", {
          value: !0,
        }),
          (c.removeFile = C),
          (c.removeFileSync = R),
          (c.writeFile = x),
          (c.writeFileSync = W);
        var _ = m(A()),
          v = m(E()),
          y = h(b()),
          F = m(J());
        function w(e) {
          if (typeof WeakMap != "function") return null;
          var r = /* @__PURE__ */ new WeakMap(),
            t = /* @__PURE__ */ new WeakMap();
          return (w = function (i) {
            return i ? t : r;
          })(e);
        }
        function h(e, r) {
          if (!r && e && e.__esModule) return e;
          if (e === null || (s(e) !== "object" && typeof e != "function")) return { default: e };
          var t = w(r);
          if (t && t.has(e)) return t.get(e);
          var n = {},
            i = Object.defineProperty && Object.getOwnPropertyDescriptor;
          for (var u in e)
            if (u !== "default" && Object.prototype.hasOwnProperty.call(e, u)) {
              var o = i ? Object.getOwnPropertyDescriptor(e, u) : null;
              o && (o.get || o.set) ? Object.defineProperty(n, u, o) : (n[u] = e[u]);
            }
          return (n.default = e), t && t.set(e, n), n;
        }
        function m(e) {
          return e && e.__esModule ? e : { default: e };
        }
        var f = typeof Deno < "u",
          S = typeof v.default < "u" && v.default.load ? v.default : void 0,
          a = y ? y.default || y : void 0;
        function l(e) {
          if (e.length === 0) return ".";
          for (var r = e.charCodeAt(0), t = r === 47, n = -1, i = !0, u = e.length - 1; u >= 1; --u)
            if (((r = e.charCodeAt(u)), r === 47)) {
              if (!i) {
                n = u;
                break;
              }
            } else i = !1;
          return n === -1 ? (t ? "/" : ".") : t && n === 1 ? "//" : e.slice(0, n);
        }
        var D = function (r, t) {
            try {
              a.mkdirSync(l(r), {
                recursive: !0,
              });
            } catch {}
            return a.writeFileSync(r, t, "utf8");
          },
          I = function (r, t) {
            return new Promise(function (n, i) {
              a.mkdir(
                l(r),
                {
                  recursive: !0,
                },
                function () {
                  a.writeFile(r, t, "utf8", function (u, o) {
                    return u ? i(u) : n(o);
                  });
                }
              );
            });
          },
          q = function (r) {
            return a.unlinkSync(r);
          },
          O = function (r) {
            return new Promise(function (t, n) {
              return a.unlink(r, function (i) {
                return i ? n(i) : t();
              });
            });
          },
          N = function (r, t) {
            var n = new TextEncoder(),
              i = n.encode(t);
            try {
              Deno.mkdirSync(l(r), {
                recursive: !0,
              });
            } catch {}
            Deno.writeFileSync(r, i);
          },
          P = function (r, t) {
            var n = new TextEncoder(),
              i = n.encode(t);
            return new Promise(function (u, o) {
              Deno.mkdir(l(r), {
                recursive: !0,
              })
                .then(function () {
                  Deno.writeFile(r, i).then(u, o);
                })
                .catch(function () {
                  Deno.writeFile(r, i).then(u, o);
                });
            });
          },
          k = function (r) {
            Deno.removeSync(r);
          },
          M = function (r) {
            return Deno.remove(r);
          },
          p = function (r, t, n) {
            var i = "";
            switch (r) {
              case ".js":
              case ".ts":
                i = "module.exports = ".concat(n.stringify(t, null, n.ident));
                break;
              case ".json5":
                i = _.default.stringify(t, null, n.ident);
                break;
              case ".yml":
              case ".yaml":
                i = S.dump(t, {
                  ident: n.indent,
                });
                break;
              default:
                i = n.stringify(t, null, n.ident);
            }
            return i;
          };
        function W(e, r, t) {
          var n = (0, F.default)(e),
            i;
          try {
            i = p(n, r, t);
          } catch (u) {
            throw ((u.message = "error stringifying " + e + ": " + u.message), u);
          }
          return f ? N(e, i) : D(e, i);
        }
        function x(e, r) {
          var t =
              arguments.length > 2 && arguments[2] !== void 0
                ? arguments[2]
                : {
                    stringify: JSON.stringify,
                    ident: 2,
                  },
            n = (0, F.default)(e),
            i;
          try {
            i = p(n, r, t);
          } catch (o) {
            throw ((o.message = "error stringifying " + e + ": " + o.message), o);
          }
          var u = f ? P : I;
          return u(e, i);
        }
        function R(e) {
          return f ? k(e) : q(e);
        }
        function C(e) {
          var r = f ? M : O;
          return r(e);
        }
      })(d, d.exports),
      d.exports);
}
export { H as __require };
