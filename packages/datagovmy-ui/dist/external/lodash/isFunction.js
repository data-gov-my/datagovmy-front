import { getDefaultExportFromCjs as a } from "../../_virtual/_commonjsHelpers.js";
import { _ as r } from "./_baseGetTag.js";
import { i as e } from "./isObject.js";
var n = r,
  c = e,
  i = "[object AsyncFunction]",
  s = "[object Function]",
  u = "[object GeneratorFunction]",
  f = "[object Proxy]";
function g(o) {
  if (!c(o)) return !1;
  var t = n(o);
  return t == s || t == u || t == i || t == f;
}
var b = g;
const F = /* @__PURE__ */ a(b);
export { F as default, b as i };
