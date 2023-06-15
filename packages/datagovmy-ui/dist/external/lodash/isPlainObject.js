import { getDefaultExportFromCjs as a } from "../../_virtual/_commonjsHelpers.js";
import { _ as c } from "./_baseGetTag.js";
import { _ as n } from "./_getPrototype.js";
import { i } from "./isObjectLike.js";
var s = c,
  p = n,
  f = i,
  b = "[object Object]",
  j = Function.prototype,
  u = Object.prototype,
  e = j.toString,
  l = u.hasOwnProperty,
  g = e.call(Object);
function m(r) {
  if (!f(r) || s(r) != b) return !1;
  var o = p(r);
  if (o === null) return !0;
  var t = l.call(o, "constructor") && o.constructor;
  return typeof t == "function" && t instanceof t && e.call(t) == g;
}
var O = m;
const T = /* @__PURE__ */ a(O);
export { T as default, O as i };
