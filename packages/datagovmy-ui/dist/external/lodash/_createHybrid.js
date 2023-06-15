import { _ as y } from "./_composeArgs.js";
import { _ as B } from "./_composeArgsRight.js";
import { _ as P } from "./_countHolders.js";
import { _ as I } from "./_createCtor.js";
import { _ as Y } from "./_createRecurry.js";
import { _ as w } from "./_getHolder.js";
import { _ as x } from "./_reorder.js";
import { _ as D } from "./_replaceHolders.js";
import { _ as K } from "./_root.js";
var N = y,
  U = B,
  E = P,
  g = I,
  T = Y,
  j = w,
  q = x,
  z = D,
  J = K,
  M = 1,
  O = 2,
  Q = 8,
  S = 16,
  V = 128,
  X = 512;
function h(t, o, m, p, u, A, v, s, n, d) {
  var H = o & V,
    F = o & M,
    c = o & O,
    _ = o & (Q | S),
    G = o & X,
    L = c ? void 0 : g(t);
  function i() {
    for (var e = arguments.length, r = Array(e), a = e; a--; ) r[a] = arguments[a];
    if (_)
      var R = j(i),
        C = E(r, R);
    if ((p && (r = N(r, p, u, _)), A && (r = U(r, A, v, _)), (e -= C), _ && e < d)) {
      var W = z(r, R);
      return T(t, o, h, i.placeholder, m, r, W, s, n, d - e);
    }
    var l = F ? m : this,
      f = c ? l[t] : t;
    return (
      (e = r.length),
      s ? (r = q(r, s)) : G && e > 1 && r.reverse(),
      H && n < e && (r.length = n),
      this && this !== J && this instanceof i && (f = L || g(f)),
      f.apply(l, r)
    );
  }
  return i;
}
var ir = h;
export { ir as _ };
