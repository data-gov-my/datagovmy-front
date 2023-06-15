import { _ } from "./_castPath.js";
import { i as f } from "./isArguments.js";
import { i as l } from "./isArray.js";
import { _ as e } from "./_isIndex.js";
import { i as h } from "./isLength.js";
import { _ as o } from "./_toKey.js";
var u = _,
  g = f,
  p = l,
  v = e,
  x = h,
  A = o;
function P(r, i, m) {
  i = u(i, r);
  for (var a = -1, s = i.length, n = !1; ++a < s; ) {
    var t = A(i[a]);
    if (!(n = r != null && m(r, t))) break;
    r = r[t];
  }
  return n || ++a != s
    ? n
    : ((s = r == null ? 0 : r.length), !!s && x(s) && v(t, s) && (p(r) || g(r)));
}
var q = P;
export { q as _ };
