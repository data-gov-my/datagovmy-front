import { d as t } from "./document-all.js";
var o = t,
  l = o.all,
  e = o.IS_HTMLDDA
    ? function (n) {
        return typeof n == "function" || n === l;
      }
    : function (n) {
        return typeof n == "function";
      };
export { e as i };
