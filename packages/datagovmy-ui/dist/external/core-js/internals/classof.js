import { __require as o } from "./to-string-tag-support.js";
import { i as l } from "./is-callable.js";
import { c as s } from "./classof-raw.js";
import { w as u } from "./well-known-symbol.js";
var i = o(),
  c = l,
  e = s,
  f = u,
  m = f("toStringTag"),
  T = Object,
  v =
    e(
      (function () {
        return arguments;
      })()
    ) == "Arguments",
  g = function (a, r) {
    try {
      return a[r];
    } catch {}
  },
  _ = i
    ? e
    : function (a) {
        var r, t, n;
        return a === void 0
          ? "Undefined"
          : a === null
          ? "Null"
          : typeof (t = g((r = T(a)), m)) == "string"
          ? t
          : v
          ? e(r)
          : (n = e(r)) == "Object" && c(r.callee)
          ? "Arguments"
          : n;
      };
export { _ as c };
