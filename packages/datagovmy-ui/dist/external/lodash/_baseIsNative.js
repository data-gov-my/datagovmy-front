import { i as o } from "./isFunction.js";
import { _ as e } from "./_isMasked.js";
import { i as a } from "./isObject.js";
import { _ as s } from "./_toSource.js";
var i = o,
  n = e,
  c = a,
  p = s,
  f = /[\\^$.*+?()[\]{}|]/g,
  u = /^\[object .+?Constructor\]$/,
  v = Function.prototype,
  m = Object.prototype,
  _ = v.toString,
  b = m.hasOwnProperty,
  g = RegExp(
    "^" +
      _.call(b)
        .replace(f, "\\$&")
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
      "$"
  );
function O(r) {
  if (!c(r) || n(r)) return !1;
  var t = i(r) ? g : u;
  return t.test(p(r));
}
var h = O;
export { h as _ };
