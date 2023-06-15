import { _ as d } from "./_assignMergeValue.js";
import { _ as g } from "./_cloneBuffer.js";
import { _ as j } from "./_cloneTypedArray.js";
import { _ as v } from "./_copyArray.js";
import { _ as V } from "./_initCloneObject.js";
import { i as M } from "./isArguments.js";
import { i as P } from "./isArray.js";
import { i as x } from "./isArrayLikeObject.js";
import { i as C } from "./isBuffer.js";
import { i as T } from "./isFunction.js";
import { i as B } from "./isObject.js";
import { i as D } from "./isPlainObject.js";
import { i as E } from "./isTypedArray.js";
import { _ as F } from "./_safeGet.js";
import { t as G } from "./toPlainObject.js";
var u = d,
  L = g,
  w = j,
  h = v,
  q = V,
  c = M,
  y = P,
  H = x,
  I = C,
  J = T,
  K = B,
  N = D,
  Q = E,
  b = F,
  R = G;
function S(f, l, a, A, O, t, s) {
  var i = b(f, a),
    e = b(l, a),
    p = s.get(e);
  if (p) {
    u(f, a, p);
    return;
  }
  var r = t ? t(i, e, a + "", f, l, s) : void 0,
    o = r === void 0;
  if (o) {
    var m = y(e),
      n = !m && I(e),
      _ = !m && !n && Q(e);
    (r = e),
      m || n || _
        ? y(i)
          ? (r = i)
          : H(i)
          ? (r = h(i))
          : n
          ? ((o = !1), (r = L(e, !0)))
          : _
          ? ((o = !1), (r = w(e, !0)))
          : (r = [])
        : N(e) || c(e)
        ? ((r = i), c(i) ? (r = R(i)) : (!K(i) || J(i)) && (r = q(e)))
        : (o = !1);
  }
  o && (s.set(e, r), O(r, e, A, t, s), s.delete(e)), u(f, a, r);
}
var te = S;
export { te as _ };
