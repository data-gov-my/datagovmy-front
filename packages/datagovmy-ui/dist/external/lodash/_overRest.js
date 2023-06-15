import { _ as g } from "./_apply.js";
var p = g,
  v = Math.max;
function u(i, e, l) {
  return (
    (e = v(e === void 0 ? i.length - 1 : e, 0)),
    function () {
      for (var n = arguments, r = -1, h = v(n.length - e, 0), o = Array(h); ++r < h; )
        o[r] = n[e + r];
      r = -1;
      for (var a = Array(e + 1); ++r < e; ) a[r] = n[r];
      return (a[e] = l(o)), p(i, this, a);
    }
  );
}
var m = u;
export { m as _ };
