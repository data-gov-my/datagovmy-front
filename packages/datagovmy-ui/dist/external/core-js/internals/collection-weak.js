import { f as x } from "./function-uncurry-this.js";
import { d as F } from "./define-built-ins.js";
import { i as $ } from "./internal-metadata.js";
import { a as j } from "./an-instance.js";
import { a as U } from "./an-object.js";
import { __require as b } from "./is-null-or-undefined.js";
import { i as w } from "./is-object.js";
import { i as y } from "./iterate.js";
import { a as W } from "./array-iteration.js";
import { h as q } from "./has-own-property.js";
import { i as B } from "./internal-state.js";
var D = x,
  m = F,
  u = $.getWeakData,
  E = j,
  _ = U,
  G = b(),
  c = w,
  M = y,
  I = W,
  g = q,
  S = B,
  N = S.set,
  P = S.getterFor,
  T = I.find,
  A = I.findIndex,
  C = D([].splice),
  H = 0,
  f = function (t) {
    return t.frozen || (t.frozen = new z());
  },
  z = function () {
    this.entries = [];
  },
  v = function (t, i) {
    return T(t.entries, function (o) {
      return o[0] === i;
    });
  };
z.prototype = {
  get: function (t) {
    var i = v(this, t);
    if (i) return i[1];
  },
  has: function (t) {
    return !!v(this, t);
  },
  set: function (t, i) {
    var o = v(this, t);
    o ? (o[1] = i) : this.entries.push([t, i]);
  },
  delete: function (t) {
    var i = A(this.entries, function (o) {
      return o[0] === t;
    });
    return ~i && C(this.entries, i, 1), !!~i;
  },
};
var tr = {
  getConstructor: function (t, i, o, O) {
    var l = t(function (e, r) {
        E(e, d),
          N(e, {
            type: i,
            id: H++,
            frozen: void 0,
          }),
          G(r) || M(r, e[O], { that: e, AS_ENTRIES: o });
      }),
      d = l.prototype,
      s = P(i),
      p = function (e, r, n) {
        var a = s(e),
          h = u(_(r), !0);
        return h === !0 ? f(a).set(r, n) : (h[a.id] = n), e;
      };
    return (
      m(d, {
        // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
        // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
        // https://tc39.es/ecma262/#sec-weakset.prototype.delete
        delete: function (e) {
          var r = s(this);
          if (!c(e)) return !1;
          var n = u(e);
          return n === !0 ? f(r).delete(e) : n && g(n, r.id) && delete n[r.id];
        },
        // `{ WeakMap, WeakSet }.prototype.has(key)` methods
        // https://tc39.es/ecma262/#sec-weakmap.prototype.has
        // https://tc39.es/ecma262/#sec-weakset.prototype.has
        has: function (r) {
          var n = s(this);
          if (!c(r)) return !1;
          var a = u(r);
          return a === !0 ? f(n).has(r) : a && g(a, n.id);
        },
      }),
      m(
        d,
        o
          ? {
              // `WeakMap.prototype.get(key)` method
              // https://tc39.es/ecma262/#sec-weakmap.prototype.get
              get: function (r) {
                var n = s(this);
                if (c(r)) {
                  var a = u(r);
                  return a === !0 ? f(n).get(r) : a ? a[n.id] : void 0;
                }
              },
              // `WeakMap.prototype.set(key, value)` method
              // https://tc39.es/ecma262/#sec-weakmap.prototype.set
              set: function (r, n) {
                return p(this, r, n);
              },
            }
          : {
              // `WeakSet.prototype.add(value)` method
              // https://tc39.es/ecma262/#sec-weakset.prototype.add
              add: function (r) {
                return p(this, r, !0);
              },
            }
      ),
      l
    );
  },
};
export { tr as c };
