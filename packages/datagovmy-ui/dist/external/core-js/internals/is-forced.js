import { f as i } from "./fails.js";
import { i as o } from "./is-callable.js";
var s = i,
  t = o,
  v = /#|\.prototype\./,
  a = function (r, e) {
    var l = n[f(r)];
    return l == p ? !0 : l == m ? !1 : t(e) ? s(e) : !!e;
  },
  f = (a.normalize = function (r) {
    return String(r).replace(v, ".").toLowerCase();
  }),
  n = (a.data = {}),
  m = (a.NATIVE = "N"),
  p = (a.POLYFILL = "P"),
  c = a;
export { c as i };
