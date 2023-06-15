import { _ as i } from "./_baseGetTag.js";
import { i as s } from "./isObjectLike.js";
var t = i,
  b = s,
  e = "[object Symbol]";
function r(o) {
  return typeof o == "symbol" || (b(o) && t(o) == e);
}
var y = r;
export { y as i };
