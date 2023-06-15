import { _ as R } from "./_getAllKeys.js";
var L = R,
  S = 1,
  E = Object.prototype,
  F = E.hasOwnProperty;
function G(r, n, A, a, q, f) {
  var v = A & S,
    P = L(r),
    t = P.length,
    x = L(n),
    K = x.length;
  if (t != K && !v) return !1;
  for (var l = t; l--; ) {
    var i = P[l];
    if (!(v ? i in n : F.call(n, i))) return !1;
  }
  var O = f.get(r),
    _ = f.get(n);
  if (O && _) return O == n && _ == r;
  var s = !0;
  f.set(r, n), f.set(n, r);
  for (var d = v; ++l < t; ) {
    i = P[l];
    var e = r[i],
      p = n[i];
    if (a) var w = v ? a(p, e, i, n, r, f) : a(e, p, i, r, n, f);
    if (!(w === void 0 ? e === p || q(e, p, A, a, f) : w)) {
      s = !1;
      break;
    }
    d || (d = i == "constructor");
  }
  if (s && !d) {
    var g = r.constructor,
      u = n.constructor;
    g != u &&
      "constructor" in r &&
      "constructor" in n &&
      !(typeof g == "function" && g instanceof g && typeof u == "function" && u instanceof u) &&
      (s = !1);
  }
  return f.delete(r), f.delete(n), s;
}
var M = G;
export { M as _ };
