import { i as a } from "./isObject.js";
import { _ as e } from "./_isPrototype.js";
import { _ as i } from "./_nativeKeysIn.js";
var n = a,
  p = e,
  v = i,
  f = Object.prototype,
  y = f.hasOwnProperty;
function _(r) {
  if (!n(r)) return v(r);
  var s = p(r),
    o = [];
  for (var t in r) (t == "constructor" && (s || !y.call(r, t))) || o.push(t);
  return o;
}
var O = _;
export { O as _ };
