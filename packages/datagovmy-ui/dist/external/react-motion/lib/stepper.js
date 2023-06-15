import { __module as p } from "../../../_virtual/stepper.js";
(function (v, a) {
  (a.__esModule = !0), (a.default = l);
  var r = [0, 0];
  function l(u, s, n, e, _, d, o) {
    var i = -_ * (s - e),
      m = -d * n,
      M = i + m,
      t = n + M * u,
      f = s + t * u;
    return Math.abs(t) < o && Math.abs(f - e) < o
      ? ((r[0] = e), (r[1] = 0), r)
      : ((r[0] = f), (r[1] = t), r);
  }
  v.exports = a.default;
})(p, p.exports);
var h = p.exports;
export { h as s };
