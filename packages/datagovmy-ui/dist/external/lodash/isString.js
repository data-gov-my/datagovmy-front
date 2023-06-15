import { getDefaultExportFromCjs as t } from "../../_virtual/_commonjsHelpers.js";
import { _ as i } from "./_baseGetTag.js";
import { i as s } from "./isArray.js";
import { i as o } from "./isObjectLike.js";
var a = i,
  e = s,
  g = o,
  m = "[object String]";
function n(r) {
  return typeof r == "string" || (!e(r) && g(r) && a(r) == m);
}
var f = n;
const j = /* @__PURE__ */ t(f);
export { j as default };
