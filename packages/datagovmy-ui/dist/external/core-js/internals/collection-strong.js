import { o as K } from "./object-create.js";
import { d as _ } from "./define-built-in-accessor.js";
import { d as G } from "./define-built-ins.js";
import { f as C } from "./function-bind-context.js";
import { a as H } from "./an-instance.js";
import { __require as J } from "./is-null-or-undefined.js";
import { i as L } from "./iterate.js";
import { i as P } from "./iterator-define.js";
import { c as Q } from "./create-iter-result-object.js";
import { __require as R } from "./set-species.js";
import { d as V } from "./descriptors.js";
import { i as W } from "./internal-metadata.js";
import { i as X } from "./internal-state.js";
var h, b;
function ae() {
  if (b) return h;
  b = 1;
  var k = K,
    B = _,
    y = G,
    E = C,
    F = H,
    $ = J(),
    w = L,
    j = P,
    c = Q,
    D = R(),
    v = V,
    S = W.fastKey,
    z = X,
    q = z.set,
    g = z.getterFor;
  return (
    (h = {
      getConstructor: function (x, f, l, m) {
        var p = x(function (n, t) {
            F(n, d),
              q(n, {
                type: f,
                index: k(null),
                first: void 0,
                last: void 0,
                size: 0,
              }),
              v || (n.size = 0),
              $(t) || w(t, n[m], { that: n, AS_ENTRIES: l });
          }),
          d = p.prototype,
          a = g(f),
          u = function (n, t, r) {
            var i = a(n),
              e = s(n, t),
              o,
              I;
            return (
              e
                ? (e.value = r)
                : ((i.last = e =
                    {
                      index: (I = S(t, !0)),
                      key: t,
                      value: r,
                      previous: (o = i.last),
                      next: void 0,
                      removed: !1,
                    }),
                  i.first || (i.first = e),
                  o && (o.next = e),
                  v ? i.size++ : n.size++,
                  I !== "F" && (i.index[I] = e)),
              n
            );
          },
          s = function (n, t) {
            var r = a(n),
              i = S(t),
              e;
            if (i !== "F") return r.index[i];
            for (e = r.first; e; e = e.next) if (e.key == t) return e;
          };
        return (
          y(d, {
            // `{ Map, Set }.prototype.clear()` methods
            // https://tc39.es/ecma262/#sec-map.prototype.clear
            // https://tc39.es/ecma262/#sec-set.prototype.clear
            clear: function () {
              for (var t = this, r = a(t), i = r.index, e = r.first; e; )
                (e.removed = !0),
                  e.previous && (e.previous = e.previous.next = void 0),
                  delete i[e.index],
                  (e = e.next);
              (r.first = r.last = void 0), v ? (r.size = 0) : (t.size = 0);
            },
            // `{ Map, Set }.prototype.delete(key)` methods
            // https://tc39.es/ecma262/#sec-map.prototype.delete
            // https://tc39.es/ecma262/#sec-set.prototype.delete
            delete: function (n) {
              var t = this,
                r = a(t),
                i = s(t, n);
              if (i) {
                var e = i.next,
                  o = i.previous;
                delete r.index[i.index],
                  (i.removed = !0),
                  o && (o.next = e),
                  e && (e.previous = o),
                  r.first == i && (r.first = e),
                  r.last == i && (r.last = o),
                  v ? r.size-- : t.size--;
              }
              return !!i;
            },
            // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
            // https://tc39.es/ecma262/#sec-map.prototype.foreach
            // https://tc39.es/ecma262/#sec-set.prototype.foreach
            forEach: function (t) {
              for (
                var r = a(this), i = E(t, arguments.length > 1 ? arguments[1] : void 0), e;
                (e = e ? e.next : r.first);

              )
                for (i(e.value, e.key, this); e && e.removed; ) e = e.previous;
            },
            // `{ Map, Set}.prototype.has(key)` methods
            // https://tc39.es/ecma262/#sec-map.prototype.has
            // https://tc39.es/ecma262/#sec-set.prototype.has
            has: function (t) {
              return !!s(this, t);
            },
          }),
          y(
            d,
            l
              ? {
                  // `Map.prototype.get(key)` method
                  // https://tc39.es/ecma262/#sec-map.prototype.get
                  get: function (t) {
                    var r = s(this, t);
                    return r && r.value;
                  },
                  // `Map.prototype.set(key, value)` method
                  // https://tc39.es/ecma262/#sec-map.prototype.set
                  set: function (t, r) {
                    return u(this, t === 0 ? 0 : t, r);
                  },
                }
              : {
                  // `Set.prototype.add(value)` method
                  // https://tc39.es/ecma262/#sec-set.prototype.add
                  add: function (t) {
                    return u(this, (t = t === 0 ? 0 : t), t);
                  },
                }
          ),
          v &&
            B(d, "size", {
              configurable: !0,
              get: function () {
                return a(this).size;
              },
            }),
          p
        );
      },
      setStrong: function (x, f, l) {
        var m = f + " Iterator",
          p = g(f),
          d = g(m);
        j(
          x,
          f,
          function (a, u) {
            q(this, {
              type: m,
              target: a,
              state: p(a),
              kind: u,
              last: void 0,
            });
          },
          function () {
            for (var a = d(this), u = a.kind, s = a.last; s && s.removed; ) s = s.previous;
            return !a.target || !(a.last = s = s ? s.next : a.state.first)
              ? ((a.target = void 0), c(void 0, !0))
              : u == "keys"
              ? c(s.key, !1)
              : u == "values"
              ? c(s.value, !1)
              : c([s.key, s.value], !1);
          },
          l ? "entries" : "values",
          !l,
          !0
        ),
          D(f);
      },
    }),
    h
  );
}
export { ae as __require };
