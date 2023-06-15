import { e as s } from "./eq.js";
import { i as t } from "./isArrayLike.js";
import { _ as f } from "./_isIndex.js";
import { i as m } from "./isObject.js";
var n = s,
  l = t,
  o = f,
  p = m;
function _(a, e, r) {
  if (!p(r)) return !1;
  var i = typeof e;
  return (i == "number" ? l(r) && o(e, r.length) : i == "string" && e in r) ? n(r[e], a) : !1;
}
var g = _;
export { g as _ };
