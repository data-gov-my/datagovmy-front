import { __module as n } from "../../../_virtual/shouldStopAnimation.js";
(function (u, t) {
  (t.__esModule = !0), (t.default = a);
  function a(i, r, f) {
    for (var o in r)
      if (Object.prototype.hasOwnProperty.call(r, o)) {
        if (f[o] !== 0) return !1;
        var e = typeof r[o] == "number" ? r[o] : r[o].val;
        if (i[o] !== e) return !1;
      }
    return !0;
  }
  u.exports = t.default;
})(n, n.exports);
var l = n.exports;
export { l as s };
