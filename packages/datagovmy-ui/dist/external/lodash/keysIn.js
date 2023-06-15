import { _ as a } from "./_arrayLikeKeys.js";
import { _ as s } from "./_baseKeysIn.js";
import { i as e } from "./isArrayLike.js";
var i = a,
  y = s,
  k = e;
function n(r) {
  return k(r) ? i(r, !0) : y(r);
}
var t = n;
export { t as k };
