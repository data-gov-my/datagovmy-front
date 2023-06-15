import { _ as c } from "./_baseSetData.js";
import { _ as i } from "./_createBind.js";
import { _ as B } from "./_createCurry.js";
import { _ as C } from "./_createHybrid.js";
import { _ as E } from "./_createPartial.js";
import { _ as x } from "./_getData.js";
import { _ as H } from "./_mergeData.js";
import { _ as S } from "./_setData.js";
import { _ as w } from "./_setWrapToString.js";
import { t as N } from "./toInteger.js";
var U = c,
  Y = i,
  u = B,
  K = C,
  M = E,
  O = x,
  X = H,
  j = S,
  q = w,
  P = N,
  z = "Expected a function",
  W = 1,
  J = 2,
  A = 8,
  D = 16,
  g = 32,
  T = 64,
  G = Math.max;
function Q(r, e, f, a, n, I, o, t) {
  var d = e & J;
  if (!d && typeof r != "function") throw new TypeError(z);
  var p = a ? a.length : 0;
  if (
    (p || ((e &= ~(g | T)), (a = n = void 0)),
    (o = o === void 0 ? o : G(P(o), 0)),
    (t = t === void 0 ? t : P(t)),
    (p -= n ? n.length : 0),
    e & T)
  ) {
    var L = a,
      m = n;
    a = n = void 0;
  }
  var v = d ? void 0 : O(r),
    _ = [r, e, f, a, n, L, m, I, o, t];
  if (
    (v && X(_, v),
    (r = _[0]),
    (e = _[1]),
    (f = _[2]),
    (a = _[3]),
    (n = _[4]),
    (t = _[9] = _[9] === void 0 ? (d ? 0 : r.length) : G(_[9] - p, 0)),
    !t && e & (A | D) && (e &= ~(A | D)),
    !e || e == W)
  )
    var R = Y(r, e, f);
  else
    e == A || e == D
      ? (R = u(r, e, t))
      : (e == g || e == (W | g)) && !n.length
      ? (R = M(r, e, f, a))
      : (R = K.apply(void 0, _));
  var F = v ? U : j;
  return q(F(R, _), r, e);
}
var _e = Q;
export { _e as _ };
