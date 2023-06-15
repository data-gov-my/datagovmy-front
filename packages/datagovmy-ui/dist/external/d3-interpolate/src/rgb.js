import y from "./basis.js";
import e, { gamma as v } from "./color.js";
import { rgb as f } from "../node_modules/d3-color/src/color.js";
(function a(c) {
  var i = v(c);
  function m(r, n) {
    var g = i((r = f(r)).r, (n = f(n)).r),
      o = i(r.g, n.g),
      b = i(r.b, n.b),
      p = e(r.opacity, n.opacity);
    return function (u) {
      return (r.r = g(u)), (r.g = o(u)), (r.b = b(u)), (r.opacity = p(u)), r + "";
    };
  }
  return (m.gamma = a), m;
})(1);
function w(a) {
  return function (c) {
    var i = c.length,
      m = new Array(i),
      r = new Array(i),
      n = new Array(i),
      g,
      o;
    for (g = 0; g < i; ++g) (o = f(c[g])), (m[g] = o.r || 0), (r[g] = o.g || 0), (n[g] = o.b || 0);
    return (
      (m = a(m)),
      (r = a(r)),
      (n = a(n)),
      (o.opacity = 1),
      function (b) {
        return (o.r = m(b)), (o.g = r(b)), (o.b = n(b)), o + "";
      }
    );
  };
}
var x = w(y);
export { x as rgbBasis };
