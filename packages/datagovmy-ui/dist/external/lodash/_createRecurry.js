import { _ as G } from "./_isLaziable.js";
import { _ as v } from "./_setData.js";
import { _ as D } from "./_setWrapToString.js";
var F = G,
  w = v,
  I = D,
  T = 1,
  c = 2,
  g = 4,
  y = 8,
  i = 32,
  t = 64;
function B(_, e, d, o, L, n, R, P, f, u) {
  var r = e & y,
    l = r ? R : void 0,
    p = r ? void 0 : R,
    s = r ? n : void 0,
    W = r ? void 0 : n;
  (e |= r ? i : t), (e &= ~(r ? t : i)), e & g || (e &= ~(T | c));
  var A = [_, e, L, s, l, W, p, P, f, u],
    a = d.apply(void 0, A);
  return F(_) && w(a, A), (a.placeholder = o), I(a, _, e);
}
var U = B;
export { U as _ };
