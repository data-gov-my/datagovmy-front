import { _ as o } from "./_baseCreate.js";
import { _ as r } from "./_getPrototype.js";
import { _ as e } from "./_isPrototype.js";
var i = o,
  a = r,
  n = e;
function p(t) {
  return typeof t.constructor == "function" && !n(t) ? i(a(t)) : {};
}
var m = p;
export { m as _ };
