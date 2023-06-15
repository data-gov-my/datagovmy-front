import { i as o } from "./isSymbol.js";
var i = o,
  s = 1 / 0;
function n(r) {
  if (typeof r == "string" || i(r)) return r;
  var t = r + "";
  return t == "0" && 1 / r == -s ? "-0" : t;
}
var f = n;
export { f as _ };
