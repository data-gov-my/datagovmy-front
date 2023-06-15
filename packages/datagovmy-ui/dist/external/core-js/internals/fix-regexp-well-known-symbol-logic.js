import { __require as R } from "../modules/es.regexp.exec.js";
import { f as T } from "./function-uncurry-this-clause.js";
import { d as O } from "./define-built-in.js";
import { __require as $ } from "./regexp-exec.js";
import { f as h } from "./fails.js";
import { w as B } from "./well-known-symbol.js";
import { c as C } from "./create-non-enumerable-property.js";
var u, x;
function F() {
  if (x) return u;
  (x = 1), R();
  var a = T,
    f = O,
    E = $(),
    l = h,
    c = B,
    y = C,
    S = c("species"),
    t = RegExp.prototype;
  return (
    (u = function (o, _, g, d) {
      var e = c(o),
        i = !l(function () {
          var n = {};
          return (
            (n[e] = function () {
              return 7;
            }),
            ""[o](n) != 7
          );
        }),
        w =
          i &&
          !l(function () {
            var n = !1,
              r = /a/;
            return (
              o === "split" &&
                ((r = {}),
                (r.constructor = {}),
                (r.constructor[S] = function () {
                  return r;
                }),
                (r.flags = ""),
                (r[e] = /./[e])),
              (r.exec = function () {
                return (n = !0), null;
              }),
              r[e](""),
              !n
            );
          });
      if (!i || !w || g) {
        var b = a(/./[e]),
          p = _(e, ""[o], function (n, r, v, s, q) {
            var L = a(n),
              m = r.exec;
            return m === E || m === t.exec
              ? i && !q
                ? { done: !0, value: b(r, v, s) }
                : { done: !0, value: L(v, r, s) }
              : { done: !1 };
          });
        f(String.prototype, o, p[0]), f(t, e, p[1]);
      }
      d && y(t[e], "sham", !0);
    }),
    u
  );
}
export { F as __require };
