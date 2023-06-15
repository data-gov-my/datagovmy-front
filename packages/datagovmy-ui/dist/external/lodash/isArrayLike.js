import { i as r } from "./isFunction.js";
import { i as n } from "./isLength.js";
var t = r,
  s = n;
function o(i) {
  return i != null && s(i.length) && !t(i);
}
var m = o;
export { m as i };
