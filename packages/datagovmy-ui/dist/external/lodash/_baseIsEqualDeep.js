import { _ as B } from "./_Stack.js";
import { _ as E } from "./_equalArrays.js";
import { _ as S } from "./_equalByTag.js";
import { _ as b } from "./_equalObjects.js";
import { _ as d } from "./_getTag.js";
import { i as x } from "./isArray.js";
import { i as D } from "./isBuffer.js";
import { i as L } from "./isTypedArray.js";
var A = B,
  R = E,
  C = S,
  G = b,
  m = d,
  u = x,
  n = D,
  M = L,
  H = 1,
  O = "[object Arguments]",
  w = "[object Array]",
  y = "[object Object]",
  J = Object.prototype,
  q = J.hasOwnProperty;
function K(r, e, f, p, s, a) {
  var g = u(r),
    t = u(e),
    _ = g ? w : m(r),
    i = t ? w : m(e);
  (_ = _ == O ? y : _), (i = i == O ? y : i);
  var l = _ == y,
    I = i == y,
    o = _ == i;
  if (o && n(r)) {
    if (!n(e)) return !1;
    (g = !0), (l = !1);
  }
  if (o && !l) return a || (a = new A()), g || M(r) ? R(r, e, f, p, s, a) : C(r, e, _, f, p, s, a);
  if (!(f & H)) {
    var T = l && q.call(r, "__wrapped__"),
      v = I && q.call(e, "__wrapped__");
    if (T || v) {
      var P = T ? r.value() : r,
        j = v ? e.value() : e;
      return a || (a = new A()), s(P, j, f, p, a);
    }
  }
  return o ? (a || (a = new A()), G(r, e, f, p, s, a)) : !1;
}
var F = K;
export { F as _ };
