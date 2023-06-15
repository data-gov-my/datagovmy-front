import { t as n } from "./toFinite.js";
var o = n;
function i(e) {
  var t = o(e),
    r = t % 1;
  return t === t ? (r ? t - r : t) : 0;
}
var m = i;
export { m as t };
