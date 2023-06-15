import { _ as g } from "./export.js";
import { f as N } from "./function-call.js";
import { f as A } from "./function-name.js";
import { i as B } from "./is-callable.js";
import { i as $ } from "./iterator-create-constructor.js";
import { o as Y } from "./object-get-prototype-of.js";
import { o as j } from "./object-set-prototype-of.js";
import { s as k } from "./set-to-string-tag.js";
import { c as x } from "./create-non-enumerable-property.js";
import { d as U } from "./define-built-in.js";
import { w as V } from "./well-known-symbol.js";
import { i as F } from "./iterators.js";
import { i as q } from "./iterators-core.js";
var z = g,
  H = N,
  C = A,
  J = B,
  M = $,
  P = Y,
  S = j,
  Q = k,
  W = x,
  y = U,
  X = V,
  Z = F,
  h = q,
  K = C.PROPER,
  L = C.CONFIGURABLE,
  _ = h.IteratorPrototype,
  p = h.BUGGY_SAFARI_ITERATORS,
  v = X("iterator"),
  T = "keys",
  m = "values",
  w = "entries",
  D = function () {
    return this;
  },
  pr = function (R, n, f, b, a, E, G) {
    M(f, n, b);
    var u = function (e) {
        if (e === a && o) return o;
        if (!p && e in r) return r[e];
        switch (e) {
          case T:
            return function () {
              return new f(this, e);
            };
          case m:
            return function () {
              return new f(this, e);
            };
          case w:
            return function () {
              return new f(this, e);
            };
        }
        return function () {
          return new f(this);
        };
      },
      d = n + " Iterator",
      c = !1,
      r = R.prototype,
      i = r[v] || r["@@iterator"] || (a && r[a]),
      o = (!p && i) || u(a),
      O = (n == "Array" && r.entries) || i,
      t,
      s,
      l;
    if (
      (O &&
        ((t = P(O.call(new R()))),
        t !== Object.prototype &&
          t.next &&
          (P(t) !== _ && (S ? S(t, _) : J(t[v]) || y(t, v, D)), Q(t, d, !0))),
      K &&
        a == m &&
        i &&
        i.name !== m &&
        (L
          ? W(r, "name", m)
          : ((c = !0),
            (o = function () {
              return H(i, this);
            }))),
      a)
    )
      if (
        ((s = {
          values: u(m),
          keys: E ? o : u(T),
          entries: u(w),
        }),
        G)
      )
        for (l in s) (p || c || !(l in r)) && y(r, l, s[l]);
      else z({ target: n, proto: !0, forced: p || c }, s);
    return r[v] !== o && y(r, v, o, { name: a }), (Z[n] = o), s;
  };
export { pr as i };
