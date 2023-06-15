import { _ as p } from "./_Symbol.js";
import { _ as A } from "./_Uint8Array.js";
import { e as o } from "./eq.js";
import { _ as b } from "./_equalArrays.js";
import { _ as v } from "./_mapToArray.js";
import { _ as L } from "./_setToArray.js";
var y = p,
  g = A,
  O = o,
  d = b,
  E = v,
  R = L,
  q = 1,
  w = 2,
  B = "[object Boolean]",
  S = "[object Date]",
  D = "[object Error]",
  P = "[object Map]",
  c = "[object Number]",
  x = "[object RegExp]",
  M = "[object Set]",
  U = "[object String]",
  V = "[object Symbol]",
  z = "[object ArrayBuffer]",
  C = "[object DataView]",
  t = y ? y.prototype : void 0,
  n = t ? t.valueOf : void 0;
function G(a, r, l, f, i, m, e) {
  switch (l) {
    case C:
      if (a.byteLength != r.byteLength || a.byteOffset != r.byteOffset) return !1;
      (a = a.buffer), (r = r.buffer);
    case z:
      return !(a.byteLength != r.byteLength || !m(new g(a), new g(r)));
    case B:
    case S:
    case c:
      return O(+a, +r);
    case D:
      return a.name == r.name && a.message == r.message;
    case x:
    case U:
      return a == r + "";
    case P:
      var s = E;
    case M:
      var T = f & q;
      if ((s || (s = R), a.size != r.size && !T)) return !1;
      var u = e.get(a);
      if (u) return u == r;
      (f |= w), e.set(a, r);
      var _ = d(s(a), s(r), f, i, m, e);
      return e.delete(a), _;
    case V:
      if (n) return n.call(a) == n.call(r);
  }
  return !1;
}
var K = G;
export { K as _ };
