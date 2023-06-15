import { _ as r } from "./_baseIsNative.js";
import { _ as i } from "./_getValue.js";
var v = r,
  s = i;
function o(a, t) {
  var e = s(a, t);
  return v(e) ? e : void 0;
}
var n = o;
export { n as _ };
