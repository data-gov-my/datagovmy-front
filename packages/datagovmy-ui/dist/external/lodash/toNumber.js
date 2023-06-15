import { _ as o } from "./_baseTrim.js";
import { i as n } from "./isObject.js";
import { i as m } from "./isSymbol.js";
var b = o,
  s = n,
  e = m,
  f = 0 / 0,
  p = /^[-+]0x[0-9a-f]+$/i,
  y = /^0b[01]+$/i,
  a = /^0o[0-7]+$/i,
  c = parseInt;
function I(r) {
  if (typeof r == "number") return r;
  if (e(r)) return f;
  if (s(r)) {
    var t = typeof r.valueOf == "function" ? r.valueOf() : r;
    r = s(t) ? t + "" : t;
  }
  if (typeof r != "string") return r === 0 ? r : +r;
  r = b(r);
  var i = y.test(r);
  return i || a.test(r) ? c(r.slice(2), i ? 2 : 8) : p.test(r) ? f : +r;
}
var x = I;
export { x as t };
