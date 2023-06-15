import { f as W } from "../internals/freezing.js";
import { g as w } from "../internals/global.js";
import { f as S } from "../internals/function-uncurry-this.js";
import { d as $ } from "../internals/define-built-ins.js";
import { i as O } from "../internals/internal-metadata.js";
import { c as j } from "../internals/collection.js";
import { c as F } from "../internals/collection-weak.js";
import { i as B } from "../internals/is-object.js";
import { i as x } from "../internals/internal-state.js";
import { f as N } from "../internals/fails.js";
import { w as T } from "../internals/weak-map-basic-detection.js";
var _ = W,
  h = w,
  v = S,
  m = $,
  L = O,
  P = j,
  E = F,
  f = B,
  s = x.enforce,
  R = N,
  X = T,
  o = Object,
  Z = Array.isArray,
  c = o.isExtensible,
  M = o.isFrozen,
  C = o.isSealed,
  b = o.freeze,
  D = o.seal,
  p = {},
  z = {},
  K = !h.ActiveXObject && "ActiveXObject" in h,
  a,
  A = function (e) {
    return function () {
      return e(this, arguments.length ? arguments[0] : void 0);
    };
  },
  I = P("WeakMap", A, E),
  n = I.prototype,
  u = v(n.set),
  U = function () {
    return (
      _ &&
      R(function () {
        var e = b([]);
        return u(new I(), e, 1), !M(e);
      })
    );
  };
if (X)
  if (K) {
    (a = E.getConstructor(A, "WeakMap", !0)), L.enable();
    var g = v(n.delete),
      l = v(n.has),
      d = v(n.get);
    m(n, {
      delete: function (e) {
        if (f(e) && !c(e)) {
          var r = s(this);
          return r.frozen || (r.frozen = new a()), g(this, e) || r.frozen.delete(e);
        }
        return g(this, e);
      },
      has: function (r) {
        if (f(r) && !c(r)) {
          var i = s(this);
          return i.frozen || (i.frozen = new a()), l(this, r) || i.frozen.has(r);
        }
        return l(this, r);
      },
      get: function (r) {
        if (f(r) && !c(r)) {
          var i = s(this);
          return i.frozen || (i.frozen = new a()), l(this, r) ? d(this, r) : i.frozen.get(r);
        }
        return d(this, r);
      },
      set: function (r, i) {
        if (f(r) && !c(r)) {
          var t = s(this);
          t.frozen || (t.frozen = new a()), l(this, r) ? u(this, r, i) : t.frozen.set(r, i);
        } else u(this, r, i);
        return this;
      },
    });
  } else
    U() &&
      m(n, {
        set: function (r, i) {
          var t;
          return (
            Z(r) && (M(r) ? (t = p) : C(r) && (t = z)),
            u(this, r, i),
            t == p && b(r),
            t == z && D(r),
            this
          );
        },
      });
