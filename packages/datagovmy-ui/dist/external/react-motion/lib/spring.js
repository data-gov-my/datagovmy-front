import { __module as a } from "../../../_virtual/spring.js";
import { p as d } from "./presets.js";
(function (p, t) {
  t.__esModule = !0;
  var o =
    Object.assign ||
    function (r) {
      for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (r[s] = n[s]);
      }
      return r;
    };
  t.default = _;
  function u(r) {
    return r && r.__esModule ? r : { default: r };
  }
  var f = d,
    i = u(f),
    l = o({}, i.default.noWobble, {
      precision: 0.01,
    });
  function _(r, e) {
    return o({}, l, e, { val: r });
  }
  p.exports = t.default;
})(a, a.exports);
var m = a.exports;
export { m as s };
