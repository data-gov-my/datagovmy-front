import { _ as e } from "./_Symbol.js";
import { _ as o } from "./_getRawTag.js";
import { _ as a } from "./_objectToString.js";
var n = e,
  g = o,
  i = a,
  T = "[object Null]",
  b = "[object Undefined]",
  r = n ? n.toStringTag : void 0;
function f(t) {
  return t == null ? (t === void 0 ? b : T) : r && r in Object(t) ? g(t) : i(t);
}
var s = f;
export { s as _ };
