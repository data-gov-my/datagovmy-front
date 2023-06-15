import { __exports as z } from "../../../_virtual/es.promise.constructor.js";
import { _ as hr } from "../internals/export.js";
import { __require as Pr } from "../internals/engine-is-node.js";
import { g as Nr } from "../internals/global.js";
import { f as Cr } from "../internals/function-call.js";
import { d as Ir } from "../internals/define-built-in.js";
import { o as Sr } from "../internals/object-set-prototype-of.js";
import { s as qr } from "../internals/set-to-string-tag.js";
import { __require as Tr } from "../internals/set-species.js";
import { a as yr } from "../internals/a-callable.js";
import { i as Or } from "../internals/is-callable.js";
import { i as Rr } from "../internals/is-object.js";
import { a as br } from "../internals/an-instance.js";
import { __require as jr } from "../internals/species-constructor.js";
import { __require as Dr } from "../internals/task.js";
import { __require as gr } from "../internals/microtask.js";
import { __require as wr } from "../internals/host-report-errors.js";
import { __require as Ur } from "../internals/perform.js";
import { __require as Ar } from "../internals/queue.js";
import { i as Lr } from "../internals/internal-state.js";
import { __require as Hr } from "../internals/promise-native-constructor.js";
import { __require as $r } from "../internals/promise-constructor-detection.js";
import { __require as kr } from "../internals/new-promise-capability.js";
var K;
function ue() {
  if (K) return z;
  K = 1;
  var X = hr,
    p = Pr(),
    a = Nr,
    s = Cr,
    b = Ir,
    j = Sr,
    Y = qr,
    Z = Tr(),
    rr = yr,
    d = Or,
    er = Rr,
    ir = br,
    or = jr(),
    D = Dr().set,
    C = gr(),
    tr = wr(),
    ar = Ur(),
    nr = Ar(),
    g = Lr,
    _ = Hr(),
    I = $r(),
    w = kr(),
    E = "Promise",
    U = I.CONSTRUCTOR,
    sr = I.REJECTION_EVENT,
    fr = I.SUBCLASSING,
    S = g.getterFor(E),
    ur = g.set,
    f = _ && _.prototype,
    n = _,
    h = f,
    A = a.TypeError,
    q = a.document,
    T = a.process,
    y = w.f,
    cr = y,
    vr = !!(q && q.createEvent && a.dispatchEvent),
    L = "unhandledrejection",
    lr = "rejectionhandled",
    H = 0,
    $ = 1,
    mr = 2,
    O = 1,
    k = 2,
    P,
    M,
    pr,
    x,
    J = function (r) {
      var e;
      return er(r) && d((e = r.then)) ? e : !1;
    },
    V = function (r, e) {
      var i = e.value,
        o = e.state == $,
        t = o ? r.ok : r.fail,
        v = r.resolve,
        N = r.reject,
        l = r.domain,
        m,
        Q,
        W;
      try {
        t
          ? (o || (e.rejection === k && _r(e), (e.rejection = O)),
            t === !0 ? (m = i) : (l && l.enter(), (m = t(i)), l && (l.exit(), (W = !0))),
            m === r.promise ? N(A("Promise-chain cycle")) : (Q = J(m)) ? s(Q, m, v, N) : v(m))
          : N(i);
      } catch (Er) {
        l && !W && l.exit(), N(Er);
      }
    },
    B = function (r, e) {
      r.notified ||
        ((r.notified = !0),
        C(function () {
          for (var i = r.reactions, o; (o = i.get()); ) V(o, r);
          (r.notified = !1), e && !r.rejection && dr(r);
        }));
    },
    G = function (r, e, i) {
      var o, t;
      vr
        ? ((o = q.createEvent("Event")),
          (o.promise = e),
          (o.reason = i),
          o.initEvent(r, !1, !0),
          a.dispatchEvent(o))
        : (o = { promise: e, reason: i }),
        !sr && (t = a["on" + r]) ? t(o) : r === L && tr("Unhandled promise rejection", i);
    },
    dr = function (r) {
      s(D, a, function () {
        var e = r.facade,
          i = r.value,
          o = F(r),
          t;
        if (
          o &&
          ((t = ar(function () {
            p ? T.emit("unhandledRejection", i, e) : G(L, e, i);
          })),
          (r.rejection = p || F(r) ? k : O),
          t.error)
        )
          throw t.value;
      });
    },
    F = function (r) {
      return r.rejection !== O && !r.parent;
    },
    _r = function (r) {
      s(D, a, function () {
        var e = r.facade;
        p ? T.emit("rejectionHandled", e) : G(lr, e, r.value);
      });
    },
    u = function (r, e, i) {
      return function (o) {
        r(e, o, i);
      };
    },
    c = function (r, e, i) {
      r.done || ((r.done = !0), i && (r = i), (r.value = e), (r.state = mr), B(r, !0));
    },
    R = function (r, e, i) {
      if (!r.done) {
        (r.done = !0), i && (r = i);
        try {
          if (r.facade === e) throw A("Promise can't be resolved itself");
          var o = J(e);
          o
            ? C(function () {
                var t = { done: !1 };
                try {
                  s(o, e, u(R, t, r), u(c, t, r));
                } catch (v) {
                  c(t, v, r);
                }
              })
            : ((r.value = e), (r.state = $), B(r, !1));
        } catch (t) {
          c({ done: !1 }, t, r);
        }
      }
    };
  if (
    U &&
    ((n = function (e) {
      ir(this, h), rr(e), s(P, this);
      var i = S(this);
      try {
        e(u(R, i), u(c, i));
      } catch (o) {
        c(i, o);
      }
    }),
    (h = n.prototype),
    (P = function (e) {
      ur(this, {
        type: E,
        done: !1,
        notified: !1,
        parent: !1,
        reactions: new nr(),
        rejection: !1,
        state: H,
        value: void 0,
      });
    }),
    (P.prototype = b(h, "then", function (e, i) {
      var o = S(this),
        t = y(or(this, n));
      return (
        (o.parent = !0),
        (t.ok = d(e) ? e : !0),
        (t.fail = d(i) && i),
        (t.domain = p ? T.domain : void 0),
        o.state == H
          ? o.reactions.add(t)
          : C(function () {
              V(t, o);
            }),
        t.promise
      );
    })),
    (M = function () {
      var r = new P(),
        e = S(r);
      (this.promise = r), (this.resolve = u(R, e)), (this.reject = u(c, e));
    }),
    (w.f = y =
      function (r) {
        return r === n || r === pr ? new M(r) : cr(r);
      }),
    d(_) && f !== Object.prototype)
  ) {
    (x = f.then),
      fr ||
        b(
          f,
          "then",
          function (e, i) {
            var o = this;
            return new n(function (t, v) {
              s(x, o, t, v);
            }).then(e, i);
          },
          { unsafe: !0 }
        );
    try {
      delete f.constructor;
    } catch {}
    j && j(f, h);
  }
  return (
    X(
      { global: !0, constructor: !0, wrap: !0, forced: U },
      {
        Promise: n,
      }
    ),
    Y(n, E, !1),
    Z(E),
    z
  );
}
export { ue as __require };
