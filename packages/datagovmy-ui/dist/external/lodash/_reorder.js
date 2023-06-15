import { _ as i } from "./_copyArray.js";
import { _ as h } from "./_isIndex.js";
var v = i,
  _ = h,
  d = Math.min;
function l(r, n) {
  for (var o = r.length, e = d(n.length, o), a = v(r); e--; ) {
    var t = n[e];
    r[e] = _(t, o) ? a[t] : void 0;
  }
  return r;
}
var f = l;
export { f as _ };
