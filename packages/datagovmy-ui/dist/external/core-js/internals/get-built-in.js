import { g as a } from "./global.js";
import { i } from "./is-callable.js";
var l = a,
  n = i,
  o = function (r) {
    return n(r) ? r : void 0;
  },
  e = function (r, t) {
    return arguments.length < 2 ? o(l[r]) : l[r] && l[r][t];
  };
export { e as g };
