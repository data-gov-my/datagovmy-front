import { getDefaultExportFromCjs as n } from "../../_virtual/_commonjsHelpers.js";
import { d as l } from "./debounce.js";
import { i as o } from "./isObject.js";
var f = l,
  d = o,
  g = "Expected a function";
function u(i, a, t) {
  var r = !0,
    e = !0;
  if (typeof i != "function") throw new TypeError(g);
  return (
    d(t) && ((r = "leading" in t ? !!t.leading : r), (e = "trailing" in t ? !!t.trailing : e)),
    f(i, a, {
      leading: r,
      maxWait: a,
      trailing: e,
    })
  );
}
var c = u;
const b = /* @__PURE__ */ n(c);
export { b as default };
