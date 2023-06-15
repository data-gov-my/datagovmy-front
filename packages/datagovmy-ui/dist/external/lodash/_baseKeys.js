import { _ as a } from "./_isPrototype.js";
import { _ as s } from "./_nativeKeys.js";
var e = a,
  i = s,
  n = Object.prototype,
  p = n.hasOwnProperty;
function v(r) {
  if (!e(r)) return i(r);
  var o = [];
  for (var t in Object(r)) p.call(r, t) && t != "constructor" && o.push(t);
  return o;
}
var u = v;
export { u as _ };
