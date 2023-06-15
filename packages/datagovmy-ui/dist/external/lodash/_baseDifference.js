import { _ as y } from "./_SetCache.js";
import { _ as p } from "./_arrayIncludes.js";
import { _ as g } from "./_arrayIncludesWith.js";
import { _ as l } from "./_arrayMap.js";
import { _ as b } from "./_baseUnary.js";
import { _ as I } from "./_cacheHas.js";
var w = y,
  A = p,
  C = g,
  R = l,
  S = b,
  d = I,
  D = 200;
function E(h, r, i, s) {
  var t = -1,
    e = A,
    _ = !0,
    c = h.length,
    f = [],
    m = r.length;
  if (!c) return f;
  i && (r = R(r, S(i))),
    s ? ((e = C), (_ = !1)) : r.length >= D && ((e = d), (_ = !1), (r = new w(r)));
  r: for (; ++t < c; ) {
    var n = h[t],
      a = i == null ? n : i(n);
    if (((n = s || n !== 0 ? n : 0), _ && a === a)) {
      for (var o = m; o--; ) if (r[o] === a) continue r;
      f.push(n);
    } else e(r, a, s) || f.push(n);
  }
  return f;
}
var G = E;
export { G as _ };
