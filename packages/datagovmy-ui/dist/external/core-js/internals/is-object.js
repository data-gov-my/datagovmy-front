import { i as r } from "./is-callable.js";
import { d as a } from "./document-all.js";
var o = r,
  e = a,
  n = e.all,
  c = e.IS_HTMLDDA
    ? function (l) {
        return typeof l == "object" ? l !== null : o(l) || l === n;
      }
    : function (l) {
        return typeof l == "object" ? l !== null : o(l);
      };
export { c as i };
