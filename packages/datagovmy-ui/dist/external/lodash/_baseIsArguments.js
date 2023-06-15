import { _ as s } from "./_baseGetTag.js";
import { i as r } from "./isObjectLike.js";
var a = s,
  t = r,
  i = "[object Arguments]";
function b(e) {
  return t(e) && a(e) == i;
}
var o = b;
export { o as _ };
