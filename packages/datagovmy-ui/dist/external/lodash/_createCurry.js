import { _ as m } from "./_apply.js";
import { _ } from "./_createCtor.js";
import { _ as c } from "./_createHybrid.js";
import { _ as f } from "./_createRecurry.js";
import { _ as u } from "./_getHolder.js";
import { _ as h } from "./_replaceHolders.js";
import { _ as g } from "./_root.js";
var y = m,
  v = _,
  H = c,
  C = f,
  b = u,
  w = h,
  x = g;
function R(a, p, n) {
  var l = v(a);
  function t() {
    for (var r = arguments.length, e = Array(r), o = r, i = b(t); o--; ) e[o] = arguments[o];
    var s = r < 3 && e[0] !== i && e[r - 1] !== i ? [] : w(e, i);
    if (((r -= s.length), r < n))
      return C(a, p, H, t.placeholder, void 0, e, s, void 0, void 0, n - r);
    var d = this && this !== x && this instanceof t ? l : a;
    return y(d, this, e);
  }
  return t;
}
var E = R;
export { E as _ };
