import { _ as r } from "./_SetCache.js";
import { _ as w } from "./_arraySome.js";
import { _ as D } from "./_cacheHas.js";
var G = r,
  H = w,
  M = D,
  q = 1,
  x = 2;
function F(n, e, A, _, R, f) {
  var l = A & q,
    S = n.length,
    p = e.length;
  if (S != p && !(l && p > S)) return !1;
  var C = f.get(n),
    E = f.get(e);
  if (C && E) return C == e && E == n;
  var v = -1,
    d = !0,
    L = A & x ? new G() : void 0;
  for (f.set(n, e), f.set(e, n); ++v < S; ) {
    var i = n[v],
      g = e[v];
    if (_) var P = l ? _(g, i, v, e, n, f) : _(i, g, v, n, e, f);
    if (P !== void 0) {
      if (P) continue;
      d = !1;
      break;
    }
    if (L) {
      if (
        !H(e, function (s, O) {
          if (!M(L, O) && (i === s || R(i, s, A, _, f))) return L.push(O);
        })
      ) {
        d = !1;
        break;
      }
    } else if (!(i === g || R(i, g, A, _, f))) {
      d = !1;
      break;
    }
  }
  return f.delete(n), f.delete(e), d;
}
var b = F;
export { b as _ };
