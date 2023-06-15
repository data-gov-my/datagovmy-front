import { _ as i } from "./_basePickBy.js";
import { h as n } from "./hasIn.js";
var e = i,
  o = n;
function t(a, r) {
  return e(a, r, function (c, s) {
    return o(a, s);
  });
}
var f = t;
export { f as _ };
