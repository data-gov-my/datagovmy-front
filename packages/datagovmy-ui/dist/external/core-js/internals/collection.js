import { _ as j } from "./export.js";
import { g as D } from "./global.js";
import { f as F } from "./function-uncurry-this.js";
import { i as W } from "./is-forced.js";
import { d as B } from "./define-built-in.js";
import { i as L } from "./internal-metadata.js";
import { i as z } from "./iterate.js";
import { a as H } from "./an-instance.js";
import { i as J } from "./is-callable.js";
import { __require as Q } from "./is-null-or-undefined.js";
import { i as V } from "./is-object.js";
import { f as X } from "./fails.js";
import { c as M } from "./check-correctness-of-iteration.js";
import { s as S } from "./set-to-string-tag.js";
import { i as Z } from "./inherit-if-required.js";
var _ = j,
  G = D,
  y = F,
  $ = W,
  A = B,
  k = L,
  K = z,
  E = H,
  U = J,
  Y = Q(),
  d = V,
  m = X,
  C = M,
  O = S,
  T = Z,
  dr = function (n, h, p) {
    var u = n.indexOf("Map") !== -1,
      s = n.indexOf("Weak") !== -1,
      c = u ? "set" : "add",
      o = G[n],
      f = o && o.prototype,
      a = o,
      g = {},
      v = function (r) {
        var e = y(f[r]);
        A(
          f,
          r,
          r == "add"
            ? function (t) {
                return e(this, t === 0 ? 0 : t), this;
              }
            : r == "delete"
            ? function (i) {
                return s && !d(i) ? !1 : e(this, i === 0 ? 0 : i);
              }
            : r == "get"
            ? function (t) {
                return s && !d(t) ? void 0 : e(this, t === 0 ? 0 : t);
              }
            : r == "has"
            ? function (t) {
                return s && !d(t) ? !1 : e(this, t === 0 ? 0 : t);
              }
            : function (t, P) {
                return e(this, t === 0 ? 0 : t, P), this;
              }
        );
      },
      x = $(
        n,
        !U(o) ||
          !(
            s ||
            (f.forEach &&
              !m(function () {
                new o().entries().next();
              }))
          )
      );
    if (x) (a = p.getConstructor(h, n, u, c)), k.enable();
    else if ($(n, !0)) {
      var l = new a(),
        b = l[c](s ? {} : -0, 1) != l,
        w = m(function () {
          l.has(1);
        }),
        q = C(function (r) {
          new o(r);
        }),
        I =
          !s &&
          m(function () {
            for (var r = new o(), e = 5; e--; ) r[c](e, e);
            return !r.has(-0);
          });
      q ||
        ((a = h(function (r, e) {
          E(r, f);
          var i = T(new o(), r, a);
          return Y(e) || K(e, i[c], { that: i, AS_ENTRIES: u }), i;
        })),
        (a.prototype = f),
        (f.constructor = a)),
        (w || I) && (v("delete"), v("has"), u && v("get")),
        (I || b) && v(c),
        s && f.clear && delete f.clear;
    }
    return (
      (g[n] = a),
      _({ global: !0, constructor: !0, forced: a != o }, g),
      O(a, n),
      s || p.setStrong(a, n, u),
      a
    );
  };
export { dr as c };
