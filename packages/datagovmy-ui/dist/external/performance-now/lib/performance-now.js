import { commonjsGlobal as p } from "../../../_virtual/_commonjsHelpers.js";
import { __module as r } from "../../../_virtual/performance-now.js";
(function () {
  var o, t, e;
  typeof performance < "u" && performance !== null && performance.now
    ? (r.exports = function () {
        return performance.now();
      })
    : typeof process < "u" && process !== null && process.hrtime
    ? ((r.exports = function () {
        return (o() - e) / 1e6;
      }),
      (t = process.hrtime),
      (o = function () {
        var n;
        return (n = t()), n[0] * 1e9 + n[1];
      }),
      (e = o()))
    : Date.now
    ? ((r.exports = function () {
        return Date.now() - e;
      }),
      (e = Date.now()))
    : ((r.exports = function () {
        return /* @__PURE__ */ new Date().getTime() - e;
      }),
      (e = /* @__PURE__ */ new Date().getTime()));
}).call(p);
var a = r.exports;
export { a as p };
