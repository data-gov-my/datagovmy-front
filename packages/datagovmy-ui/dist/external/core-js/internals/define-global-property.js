import { g as o } from "./global.js";
var t = o,
  a = Object.defineProperty,
  n = function (e, r) {
    try {
      a(t, e, { value: r, configurable: !0, writable: !0 });
    } catch {
      t[e] = r;
    }
    return r;
  };
export { n as d };
