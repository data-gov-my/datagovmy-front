import c, { hue as a } from "./color.js";
import m from "../node_modules/d3-color/src/cubehelix.js";
function n(l) {
  return (function p(e) {
    e = +e;
    function h(o, i) {
      var f = l((o = m(o)).h, (i = m(i)).h),
        r = c(o.s, i.s),
        x = c(o.l, i.l),
        b = c(o.opacity, i.opacity);
      return function (u) {
        return (o.h = f(u)), (o.s = r(u)), (o.l = x(Math.pow(u, e))), (o.opacity = b(u)), o + "";
      };
    }
    return (h.gamma = p), h;
  })(1);
}
n(a);
var y = n(c);
export { y as cubehelixLong };
