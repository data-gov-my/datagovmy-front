import { _ as o } from "./_baseAssignValue.js";
import { e } from "./eq.js";
var i = o,
  t = e,
  p = Object.prototype,
  f = p.hasOwnProperty;
function l(a, r, s) {
  var n = a[r];
  (!(f.call(a, r) && t(n, s)) || (s === void 0 && !(r in a))) && i(a, r, s);
}
var _ = l;
export { _ };
