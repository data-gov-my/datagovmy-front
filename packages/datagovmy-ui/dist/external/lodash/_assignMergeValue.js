import { _ as n } from "./_baseAssignValue.js";
import { e as a } from "./eq.js";
var r = n,
  f = a;
function g(e, i, s) {
  ((s !== void 0 && !f(e[i], s)) || (s === void 0 && !(i in e))) && r(e, i, s);
}
var m = g;
export { m as _ };
