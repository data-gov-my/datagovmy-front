import { f as o } from "./function-uncurry-this.js";
import { i as t } from "./is-callable.js";
import { s as n } from "./shared-store.js";
var e = o,
  s = t,
  r = n,
  a = e(Function.toString);
s(r.inspectSource) ||
  (r.inspectSource = function (i) {
    return a(i);
  });
var p = r.inspectSource;
export { p as i };
