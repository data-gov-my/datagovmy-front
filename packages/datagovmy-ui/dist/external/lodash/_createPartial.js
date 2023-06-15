import { _ as f } from "./_apply.js";
import { _ as m } from "./_createCtor.js";
import { _ as c } from "./_root.js";
var u = f,
  v = m,
  d = c,
  w = 1;
function x(a, s, h, e) {
  var _ = s & w,
    g = v(a);
  function n() {
    for (
      var l = -1,
        o = arguments.length,
        r = -1,
        i = e.length,
        t = Array(i + o),
        p = this && this !== d && this instanceof n ? g : a;
      ++r < i;

    )
      t[r] = e[r];
    for (; o--; ) t[r++] = arguments[++l];
    return u(p, _ ? h : this, t);
  }
  return n;
}
var I = x;
export { I as _ };
