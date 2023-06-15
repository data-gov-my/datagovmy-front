import { i as t } from "./isArray.js";
import { i as o } from "./isSymbol.js";
var e = t,
  n = o,
  y = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  m = /^\w*$/;
function p(r, s) {
  if (e(r)) return !1;
  var i = typeof r;
  return i == "number" || i == "symbol" || i == "boolean" || r == null || n(r)
    ? !0
    : m.test(r) || !y.test(r) || (s != null && r in Object(s));
}
var b = p;
export { b as _ };
