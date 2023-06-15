import { _ as u } from "./_baseIsEqualDeep.js";
import { i as f } from "./isObjectLike.js";
var p = u,
  r = f;
function a(s, i, e, n, b) {
  return s === i
    ? !0
    : s == null || i == null || (!r(s) && !r(i))
    ? s !== s && i !== i
    : p(s, i, e, n, a, b);
}
var m = a;
export { m as _ };
