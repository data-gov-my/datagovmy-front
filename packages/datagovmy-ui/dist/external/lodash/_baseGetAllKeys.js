import { _ as i } from "./_arrayPush.js";
import { i as t } from "./isArray.js";
var y = i,
  l = t;
function u(r, s, e) {
  var a = s(r);
  return l(r) ? a : y(a, e(r));
}
var o = u;
export { o as _ };
