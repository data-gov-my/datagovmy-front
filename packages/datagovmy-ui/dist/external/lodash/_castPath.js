import { i } from "./isArray.js";
import { _ as o } from "./_isKey.js";
import { _ as s } from "./_stringToPath.js";
import { t as a } from "./toString.js";
var m = i,
  n = o,
  _ = s,
  f = a;
function p(r, t) {
  return m(r) ? r : n(r, t) ? [r] : _(f(r));
}
var c = p;
export { c as _ };
