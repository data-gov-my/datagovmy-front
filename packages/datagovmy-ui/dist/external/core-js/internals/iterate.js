import { f as S } from "./function-bind-context.js";
import { f as d } from "./function-call.js";
import { a as A } from "./an-object.js";
import { t as $ } from "./try-to-string.js";
import { i as w } from "./is-array-iterator-method.js";
import { l as x } from "./length-of-array-like.js";
import { o as C } from "./object-is-prototype-of.js";
import { g as _ } from "./get-iterator.js";
import { g as P } from "./get-iterator-method.js";
import { i as j } from "./iterator-close.js";
var D = S,
  M = d,
  N = A,
  k = $,
  F = w,
  L = x,
  T = C,
  U = _,
  B = P,
  c = j,
  q = TypeError,
  s = function (t, m) {
    (this.stopped = t), (this.result = m);
  },
  u = s.prototype,
  Z = function (t, m, e) {
    var g = e && e.that,
      l = !!(e && e.AS_ENTRIES),
      v = !!(e && e.IS_RECORD),
      O = !!(e && e.IS_ITERATOR),
      I = !!(e && e.INTERRUPTED),
      f = D(m, g),
      o,
      n,
      i,
      R,
      a,
      h,
      p,
      y = function (r) {
        return o && c(o, "normal", r), new s(!0, r);
      },
      E = function (r) {
        return l ? (N(r), I ? f(r[0], r[1], y) : f(r[0], r[1])) : I ? f(r, y) : f(r);
      };
    if (v) o = t.iterator;
    else if (O) o = t;
    else {
      if (((n = B(t)), !n)) throw q(k(t) + " is not iterable");
      if (F(n)) {
        for (i = 0, R = L(t); R > i; i++) if (((a = E(t[i])), a && T(u, a))) return a;
        return new s(!1);
      }
      o = U(t, n);
    }
    for (h = v ? t.next : o.next; !(p = M(h, o)).done; ) {
      try {
        a = E(p.value);
      } catch (r) {
        c(o, "throw", r);
      }
      if (typeof a == "object" && a && T(u, a)) return a;
    }
    return new s(!1);
  };
export { Z as i };
