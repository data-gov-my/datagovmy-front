import { commonjsGlobal as e } from "../../../_virtual/_commonjsHelpers.js";
var o = function (t) {
    return t && t.Math == Math && t;
  },
  r =
    // eslint-disable-next-line es/no-global-this -- safe
    o(typeof globalThis == "object" && globalThis) ||
    o(typeof window == "object" && window) || // eslint-disable-next-line no-restricted-globals -- safe
    o(typeof self == "object" && self) ||
    o(typeof e == "object" && e) || // eslint-disable-next-line no-new-func -- fallback
    (function () {
      return this;
    })() ||
    e ||
    Function("return this")();
export { r as g };
