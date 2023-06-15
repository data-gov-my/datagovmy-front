import { i as o } from "./is-callable.js";
var a = o,
  t = String,
  e = TypeError,
  p = function (r) {
    if (typeof r == "object" || a(r)) return r;
    throw e("Can't set " + t(r) + " as a prototype");
  };
export { p as a };
