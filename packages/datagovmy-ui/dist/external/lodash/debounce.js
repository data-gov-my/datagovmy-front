import { getDefaultExportFromCjs as M } from "../../_virtual/_commonjsHelpers.js";
import { i as S } from "./isObject.js";
import { n as j } from "./now.js";
import { t as y } from "./toNumber.js";
var F = S,
  x = j,
  I = y,
  N = "Expected a function",
  O = Math.max,
  R = Math.min;
function A(h, i, a) {
  var u,
    o,
    l,
    f,
    n,
    r,
    d = 0,
    b = !1,
    m = !1,
    g = !0;
  if (typeof h != "function") throw new TypeError(N);
  (i = I(i) || 0),
    F(a) &&
      ((b = !!a.leading),
      (m = "maxWait" in a),
      (l = m ? O(I(a.maxWait) || 0, i) : l),
      (g = "trailing" in a ? !!a.trailing : g));
  function v(e) {
    var t = u,
      c = o;
    return (u = o = void 0), (d = e), (f = h.apply(c, t)), f;
  }
  function _(e) {
    return (d = e), (n = setTimeout(s, i)), b ? v(e) : f;
  }
  function C(e) {
    var t = e - r,
      c = e - d,
      k = i - t;
    return m ? R(k, l - c) : k;
  }
  function E(e) {
    var t = e - r,
      c = e - d;
    return r === void 0 || t >= i || t < 0 || (m && c >= l);
  }
  function s() {
    var e = x();
    if (E(e)) return p(e);
    n = setTimeout(s, C(e));
  }
  function p(e) {
    return (n = void 0), g && u ? v(e) : ((u = o = void 0), f);
  }
  function W() {
    n !== void 0 && clearTimeout(n), (d = 0), (u = r = o = n = void 0);
  }
  function L() {
    return n === void 0 ? f : p(x());
  }
  function T() {
    var e = x(),
      t = E(e);
    if (((u = arguments), (o = this), (r = e), t)) {
      if (n === void 0) return _(r);
      if (m) return clearTimeout(n), (n = setTimeout(s, i)), v(r);
    }
    return n === void 0 && (n = setTimeout(s, i)), f;
  }
  return (T.cancel = W), (T.flush = L), T;
}
var D = A;
const z = /* @__PURE__ */ M(D);
export { D as d, z as default };
