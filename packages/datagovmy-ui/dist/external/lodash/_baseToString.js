import { _ as a } from "./_Symbol.js";
import { _ as m } from "./_arrayMap.js";
import { i as y } from "./isArray.js";
import { i as f } from "./isSymbol.js";
var i = a,
  p = m,
  b = y,
  S = f,
  _ = 1 / 0,
  t = i ? i.prototype : void 0,
  n = t ? t.toString : void 0;
function s(r) {
  if (typeof r == "string") return r;
  if (b(r)) return p(r, s) + "";
  if (S(r)) return n ? n.call(r) : "";
  var o = r + "";
  return o == "0" && 1 / r == -_ ? "-0" : o;
}
var I = s;
export { I as _ };
