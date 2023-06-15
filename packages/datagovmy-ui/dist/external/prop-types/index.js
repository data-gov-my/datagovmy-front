import { getDefaultExportFromCjs as e } from "../../_virtual/_commonjsHelpers.js";
import { __module as r } from "../../_virtual/index2.js";
import { __require as o } from "../react-is/index.js";
import { __require as t } from "./factoryWithTypeCheckers.js";
import { __require as p } from "./factoryWithThrowingShims.js";
if (process.env.NODE_ENV !== "production") {
  var s = o(),
    i = !0;
  r.exports = t()(s.isElement, i);
} else r.exports = p()();
var a = r.exports;
const q = /* @__PURE__ */ e(a);
export { q as default, a as p };
