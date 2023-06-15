import { _ as a } from "./_arrayLikeKeys.js";
import { _ as s } from "./_baseKeys.js";
import { i as e } from "./isArrayLike.js";
var i = a,
  y = s,
  k = e;
function m(r) {
  return k(r) ? i(r) : y(r);
}
var p = m;
export { p as k };
