import { __module as I } from "../../../../_virtual/regeneratorRuntime.js";
import { _ as H } from "./typeof.js";
var D;
function Q() {
  return D
    ? I.exports
    : ((D = 1),
      (function (p) {
        var W = H.default;
        function A() {
          (p.exports = A =
            function () {
              return h;
            }),
            (p.exports.__esModule = !0),
            (p.exports.default = p.exports);
          var h = {},
            x = Object.prototype,
            d = x.hasOwnProperty,
            w =
              Object.defineProperty ||
              function (e, t, r) {
                e[t] = r.value;
              },
            O = typeof Symbol == "function" ? Symbol : {},
            _ = O.iterator || "@@iterator",
            $ = O.asyncIterator || "@@asyncIterator",
            G = O.toStringTag || "@@toStringTag";
          function c(e, t, r) {
            return (
              Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              }),
              e[t]
            );
          }
          try {
            c({}, "");
          } catch {
            c = function (r, n, i) {
              return (r[n] = i);
            };
          }
          function M(e, t, r, n) {
            var i = t && t.prototype instanceof k ? t : k,
              o = Object.create(i.prototype),
              a = new R(n || []);
            return (
              w(o, "_invoke", {
                value: z(e, r, a),
              }),
              o
            );
          }
          function S(e, t, r) {
            try {
              return {
                type: "normal",
                arg: e.call(t, r),
              };
            } catch (n) {
              return {
                type: "throw",
                arg: n,
              };
            }
          }
          h.wrap = M;
          var s = {};
          function k() {}
          function L() {}
          function v() {}
          var j = {};
          c(j, _, function () {
            return this;
          });
          var N = Object.getPrototypeOf,
            b = N && N(N(T([])));
          b && b !== x && d.call(b, _) && (j = b);
          var m = (v.prototype = k.prototype = Object.create(j));
          function q(e) {
            ["next", "throw", "return"].forEach(function (t) {
              c(e, t, function (r) {
                return this._invoke(t, r);
              });
            });
          }
          function E(e, t) {
            function r(i, o, a, u) {
              var f = S(e[i], e, o);
              if (f.type !== "throw") {
                var y = f.arg,
                  l = y.value;
                return l && W(l) == "object" && d.call(l, "__await")
                  ? t.resolve(l.__await).then(
                      function (g) {
                        r("next", g, a, u);
                      },
                      function (g) {
                        r("throw", g, a, u);
                      }
                    )
                  : t.resolve(l).then(
                      function (g) {
                        (y.value = g), a(y);
                      },
                      function (g) {
                        return r("throw", g, a, u);
                      }
                    );
              }
              u(f.arg);
            }
            var n;
            w(this, "_invoke", {
              value: function (o, a) {
                function u() {
                  return new t(function (f, y) {
                    r(o, a, f, y);
                  });
                }
                return (n = n ? n.then(u, u) : u());
              },
            });
          }
          function z(e, t, r) {
            var n = "suspendedStart";
            return function (i, o) {
              if (n === "executing") throw new Error("Generator is already running");
              if (n === "completed") {
                if (i === "throw") throw o;
                return C();
              }
              for (r.method = i, r.arg = o; ; ) {
                var a = r.delegate;
                if (a) {
                  var u = Y(a, r);
                  if (u) {
                    if (u === s) continue;
                    return u;
                  }
                }
                if (r.method === "next") r.sent = r._sent = r.arg;
                else if (r.method === "throw") {
                  if (n === "suspendedStart") throw ((n = "completed"), r.arg);
                  r.dispatchException(r.arg);
                } else r.method === "return" && r.abrupt("return", r.arg);
                n = "executing";
                var f = S(e, t, r);
                if (f.type === "normal") {
                  if (((n = r.done ? "completed" : "suspendedYield"), f.arg === s)) continue;
                  return {
                    value: f.arg,
                    done: r.done,
                  };
                }
                f.type === "throw" && ((n = "completed"), (r.method = "throw"), (r.arg = f.arg));
              }
            };
          }
          function Y(e, t) {
            var r = t.method,
              n = e.iterator[r];
            if (n === void 0)
              return (
                (t.delegate = null),
                (r === "throw" &&
                  e.iterator.return &&
                  ((t.method = "return"), (t.arg = void 0), Y(e, t), t.method === "throw")) ||
                  (r !== "return" &&
                    ((t.method = "throw"),
                    (t.arg = new TypeError("The iterator does not provide a '" + r + "' method")))),
                s
              );
            var i = S(n, e.iterator, t.arg);
            if (i.type === "throw")
              return (t.method = "throw"), (t.arg = i.arg), (t.delegate = null), s;
            var o = i.arg;
            return o
              ? o.done
                ? ((t[e.resultName] = o.value),
                  (t.next = e.nextLoc),
                  t.method !== "return" && ((t.method = "next"), (t.arg = void 0)),
                  (t.delegate = null),
                  s)
                : o
              : ((t.method = "throw"),
                (t.arg = new TypeError("iterator result is not an object")),
                (t.delegate = null),
                s);
          }
          function B(e) {
            var t = {
              tryLoc: e[0],
            };
            1 in e && (t.catchLoc = e[1]),
              2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
              this.tryEntries.push(t);
          }
          function P(e) {
            var t = e.completion || {};
            (t.type = "normal"), delete t.arg, (e.completion = t);
          }
          function R(e) {
            (this.tryEntries = [
              {
                tryLoc: "root",
              },
            ]),
              e.forEach(B, this),
              this.reset(!0);
          }
          function T(e) {
            if (e) {
              var t = e[_];
              if (t) return t.call(e);
              if (typeof e.next == "function") return e;
              if (!isNaN(e.length)) {
                var r = -1,
                  n = function i() {
                    for (; ++r < e.length; )
                      if (d.call(e, r)) return (i.value = e[r]), (i.done = !1), i;
                    return (i.value = void 0), (i.done = !0), i;
                  };
                return (n.next = n);
              }
            }
            return {
              next: C,
            };
          }
          function C() {
            return {
              value: void 0,
              done: !0,
            };
          }
          return (
            (L.prototype = v),
            w(m, "constructor", {
              value: v,
              configurable: !0,
            }),
            w(v, "constructor", {
              value: L,
              configurable: !0,
            }),
            (L.displayName = c(v, G, "GeneratorFunction")),
            (h.isGeneratorFunction = function (e) {
              var t = typeof e == "function" && e.constructor;
              return !!t && (t === L || (t.displayName || t.name) === "GeneratorFunction");
            }),
            (h.mark = function (e) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(e, v)
                  : ((e.__proto__ = v), c(e, G, "GeneratorFunction")),
                (e.prototype = Object.create(m)),
                e
              );
            }),
            (h.awrap = function (e) {
              return {
                __await: e,
              };
            }),
            q(E.prototype),
            c(E.prototype, $, function () {
              return this;
            }),
            (h.AsyncIterator = E),
            (h.async = function (e, t, r, n, i) {
              i === void 0 && (i = Promise);
              var o = new E(M(e, t, r, n), i);
              return h.isGeneratorFunction(t)
                ? o
                : o.next().then(function (a) {
                    return a.done ? a.value : o.next();
                  });
            }),
            q(m),
            c(m, G, "Generator"),
            c(m, _, function () {
              return this;
            }),
            c(m, "toString", function () {
              return "[object Generator]";
            }),
            (h.keys = function (e) {
              var t = Object(e),
                r = [];
              for (var n in t) r.push(n);
              return (
                r.reverse(),
                function i() {
                  for (; r.length; ) {
                    var o = r.pop();
                    if (o in t) return (i.value = o), (i.done = !1), i;
                  }
                  return (i.done = !0), i;
                }
              );
            }),
            (h.values = T),
            (R.prototype = {
              constructor: R,
              reset: function (t) {
                if (
                  ((this.prev = 0),
                  (this.next = 0),
                  (this.sent = this._sent = void 0),
                  (this.done = !1),
                  (this.delegate = null),
                  (this.method = "next"),
                  (this.arg = void 0),
                  this.tryEntries.forEach(P),
                  !t)
                )
                  for (var r in this)
                    r.charAt(0) === "t" &&
                      d.call(this, r) &&
                      !isNaN(+r.slice(1)) &&
                      (this[r] = void 0);
              },
              stop: function () {
                this.done = !0;
                var t = this.tryEntries[0].completion;
                if (t.type === "throw") throw t.arg;
                return this.rval;
              },
              dispatchException: function (t) {
                if (this.done) throw t;
                var r = this;
                function n(y, l) {
                  return (
                    (a.type = "throw"),
                    (a.arg = t),
                    (r.next = y),
                    l && ((r.method = "next"), (r.arg = void 0)),
                    !!l
                  );
                }
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var o = this.tryEntries[i],
                    a = o.completion;
                  if (o.tryLoc === "root") return n("end");
                  if (o.tryLoc <= this.prev) {
                    var u = d.call(o, "catchLoc"),
                      f = d.call(o, "finallyLoc");
                    if (u && f) {
                      if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                      if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                    } else if (u) {
                      if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                    } else {
                      if (!f) throw new Error("try statement without catch or finally");
                      if (this.prev < o.finallyLoc) return n(o.finallyLoc);
                    }
                  }
                }
              },
              abrupt: function (t, r) {
                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                  var i = this.tryEntries[n];
                  if (
                    i.tryLoc <= this.prev &&
                    d.call(i, "finallyLoc") &&
                    this.prev < i.finallyLoc
                  ) {
                    var o = i;
                    break;
                  }
                }
                o &&
                  (t === "break" || t === "continue") &&
                  o.tryLoc <= r &&
                  r <= o.finallyLoc &&
                  (o = null);
                var a = o ? o.completion : {};
                return (
                  (a.type = t),
                  (a.arg = r),
                  o ? ((this.method = "next"), (this.next = o.finallyLoc), s) : this.complete(a)
                );
              },
              complete: function (t, r) {
                if (t.type === "throw") throw t.arg;
                return (
                  t.type === "break" || t.type === "continue"
                    ? (this.next = t.arg)
                    : t.type === "return"
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = "return"),
                      (this.next = "end"))
                    : t.type === "normal" && r && (this.next = r),
                  s
                );
              },
              finish: function (t) {
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                  var n = this.tryEntries[r];
                  if (n.finallyLoc === t) return this.complete(n.completion, n.afterLoc), P(n), s;
                }
              },
              catch: function (t) {
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                  var n = this.tryEntries[r];
                  if (n.tryLoc === t) {
                    var i = n.completion;
                    if (i.type === "throw") {
                      var o = i.arg;
                      P(n);
                    }
                    return o;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (t, r, n) {
                return (
                  (this.delegate = {
                    iterator: T(t),
                    resultName: r,
                    nextLoc: n,
                  }),
                  this.method === "next" && (this.arg = void 0),
                  s
                );
              },
            }),
            h
          );
        }
        (p.exports = A), (p.exports.__esModule = !0), (p.exports.default = p.exports);
      })(I),
      I.exports);
}
export { Q as __require };
