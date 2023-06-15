import m, {
  createContext as Y,
  useRef as v,
  useState as G,
  useEffect as F,
  useMemo as Z,
  Fragment as q,
  useContext as K,
} from "react";
import {
  Features as de,
  forwardRefWithAs as W,
  RenderStrategy as w,
  render as ee,
} from "../../utils/render.js";
import {
  OpenClosedProvider as fe,
  State as T,
  useOpenClosed as re,
} from "../../internal/open-closed.js";
import { match as N } from "../../utils/match.js";
import { useIsMounted as me } from "../../hooks/use-is-mounted.js";
import { useIsoMorphicEffect as ve } from "../../hooks/use-iso-morphic-effect.js";
import { useLatestValue as M } from "../../hooks/use-latest-value.js";
import { useServerHandoffComplete as te } from "../../hooks/use-server-handoff-complete.js";
import { useSyncRefs as ne } from "../../hooks/use-sync-refs.js";
import { useTransition as he } from "../../hooks/use-transition.js";
import { useEvent as P } from "../../hooks/use-event.js";
import { useDisposables as pe } from "../../hooks/use-disposables.js";
import { classNames as be } from "../../utils/class-names.js";
import { useFlags as ge } from "../../hooks/use-flags.js";
function C(r = "") {
  return r.split(" ").filter(t => t.trim().length > 1);
}
let A = Y(null);
A.displayName = "TransitionContext";
var Ee = (r => ((r.Visible = "visible"), (r.Hidden = "hidden"), r))(Ee || {});
function Te() {
  let r = K(A);
  if (r === null)
    throw new Error(
      "A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />."
    );
  return r;
}
function we() {
  let r = K(I);
  if (r === null)
    throw new Error(
      "A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />."
    );
  return r;
}
let I = Y(null);
I.displayName = "NestingContext";
function U(r) {
  return "children" in r
    ? U(r.children)
    : r.current.filter(({ el: t }) => t.current !== null).filter(({ state: t }) => t === "visible")
        .length > 0;
}
function ie(r, t) {
  let n = M(r),
    l = v([]),
    R = me(),
    L = pe(),
    h = P((a, e = w.Hidden) => {
      let o = l.current.findIndex(({ el: i }) => i === a);
      o !== -1 &&
        (N(e, {
          [w.Unmount]() {
            l.current.splice(o, 1);
          },
          [w.Hidden]() {
            l.current[o].state = "hidden";
          },
        }),
        L.microTask(() => {
          var i;
          !U(l) && R.current && ((i = n.current) == null || i.call(n));
        }));
    }),
    $ = P(a => {
      let e = l.current.find(({ el: o }) => o === a);
      return (
        e
          ? e.state !== "visible" && (e.state = "visible")
          : l.current.push({ el: a, state: "visible" }),
        () => h(a, w.Unmount)
      );
    }),
    p = v([]),
    b = v(Promise.resolve()),
    c = v({ enter: [], leave: [], idle: [] }),
    g = P((a, e, o) => {
      p.current.splice(0),
        t && (t.chains.current[e] = t.chains.current[e].filter(([i]) => i !== a)),
        t == null ||
          t.chains.current[e].push([
            a,
            new Promise(i => {
              p.current.push(i);
            }),
          ]),
        t == null ||
          t.chains.current[e].push([
            a,
            new Promise(i => {
              Promise.all(c.current[e].map(([s, S]) => S)).then(() => i());
            }),
          ]),
        e === "enter"
          ? (b.current = b.current
              .then(() => (t == null ? void 0 : t.wait.current))
              .then(() => o(e)))
          : o(e);
    }),
    f = P((a, e, o) => {
      Promise.all(c.current[e].splice(0).map(([i, s]) => s))
        .then(() => {
          var i;
          (i = p.current.shift()) == null || i();
        })
        .then(() => o(e));
    });
  return Z(
    () => ({ children: l, register: $, unregister: h, onStart: g, onStop: f, wait: b, chains: c }),
    [$, h, l, g, f, c, b]
  );
}
function Pe() {}
let Ce = ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave"];
function Q(r) {
  var t;
  let n = {};
  for (let l of Ce) n[l] = (t = r[l]) != null ? t : Pe;
  return n;
}
function $e(r) {
  let t = v(Q(r));
  return (
    F(() => {
      t.current = Q(r);
    }, [r]),
    t
  );
}
let Se = "div",
  le = de.RenderStrategy;
function Fe(r, t) {
  let {
      beforeEnter: n,
      afterEnter: l,
      beforeLeave: R,
      afterLeave: L,
      enter: h,
      enterFrom: $,
      enterTo: p,
      entered: b,
      leave: c,
      leaveFrom: g,
      leaveTo: f,
      ...a
    } = r,
    e = v(null),
    o = ne(e, t),
    i = a.unmount ? w.Unmount : w.Hidden,
    { show: s, appear: S, initial: d } = Te(),
    [u, j] = G(s ? "visible" : "hidden"),
    X = we(),
    { register: O, unregister: x } = X,
    V = v(null);
  F(() => O(e), [O, e]),
    F(() => {
      if (i === w.Hidden && e.current) {
        if (s && u !== "visible") {
          j("visible");
          return;
        }
        return N(u, { hidden: () => x(e), visible: () => O(e) });
      }
    }, [u, e, O, x, s, i]);
  let _ = M({
      enter: C(h),
      enterFrom: C($),
      enterTo: C(p),
      entered: C(b),
      leave: C(c),
      leaveFrom: C(g),
      leaveTo: C(f),
    }),
    y = $e({ beforeEnter: n, afterEnter: l, beforeLeave: R, afterLeave: L }),
    k = te();
  F(() => {
    if (k && u === "visible" && e.current === null)
      throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
  }, [e, u, k]);
  let B = d && !S,
    oe = (() => (!k || B || V.current === s ? "idle" : s ? "enter" : "leave"))(),
    H = ge(0),
    se = P(E =>
      N(E, {
        enter: () => {
          H.addFlag(T.Opening), y.current.beforeEnter();
        },
        leave: () => {
          H.addFlag(T.Closing), y.current.beforeLeave();
        },
        idle: () => {},
      })
    ),
    ue = P(E =>
      N(E, {
        enter: () => {
          H.removeFlag(T.Opening), y.current.afterEnter();
        },
        leave: () => {
          H.removeFlag(T.Closing), y.current.afterLeave();
        },
        idle: () => {},
      })
    ),
    D = ie(() => {
      j("hidden"), x(e);
    }, X);
  he({
    container: e,
    classes: _,
    direction: oe,
    onStart: M(E => {
      D.onStart(e, E, se);
    }),
    onStop: M(E => {
      D.onStop(e, E, ue), E === "leave" && !U(D) && (j("hidden"), x(e));
    }),
  }),
    F(() => {
      B && (i === w.Hidden ? (V.current = null) : (V.current = s));
    }, [s, B, u]);
  let z = a,
    ce = { ref: o };
  return (
    S &&
      s &&
      d &&
      (z = { ...z, className: be(a.className, ..._.current.enter, ..._.current.enterFrom) }),
    m.createElement(
      I.Provider,
      { value: D },
      m.createElement(
        fe,
        { value: N(u, { visible: T.Open, hidden: T.Closed }) | H.flags },
        ee({
          ourProps: ce,
          theirProps: z,
          defaultTag: Se,
          features: le,
          visible: u === "visible",
          name: "Transition.Child",
        })
      )
    )
  );
}
function Re(r, t) {
  let { show: n, appear: l = !1, unmount: R, ...L } = r,
    h = v(null),
    $ = ne(h, t);
  te();
  let p = re();
  if ((n === void 0 && p !== null && (n = (p & T.Open) === T.Open), ![!0, !1].includes(n)))
    throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
  let [b, c] = G(n ? "visible" : "hidden"),
    g = ie(() => {
      c("hidden");
    }),
    [f, a] = G(!0),
    e = v([n]);
  ve(() => {
    f !== !1 && e.current[e.current.length - 1] !== n && (e.current.push(n), a(!1));
  }, [e, n]);
  let o = Z(() => ({ show: n, appear: l, initial: f }), [n, l, f]);
  F(() => {
    if (n) c("visible");
    else if (!U(g)) c("hidden");
    else {
      let d = h.current;
      if (!d) return;
      let u = d.getBoundingClientRect();
      u.x === 0 && u.y === 0 && u.width === 0 && u.height === 0 && c("hidden");
    }
  }, [n, g]);
  let i = { unmount: R },
    s = P(() => {
      var d;
      f && a(!1), (d = r.beforeEnter) == null || d.call(r);
    }),
    S = P(() => {
      var d;
      f && a(!1), (d = r.beforeLeave) == null || d.call(r);
    });
  return m.createElement(
    I.Provider,
    { value: g },
    m.createElement(
      A.Provider,
      { value: o },
      ee({
        ourProps: {
          ...i,
          as: q,
          children: m.createElement(ae, { ref: $, ...i, ...L, beforeEnter: s, beforeLeave: S }),
        },
        theirProps: {},
        defaultTag: q,
        features: le,
        visible: b === "visible",
        name: "Transition",
      })
    )
  );
}
function Le(r, t) {
  let n = K(A) !== null,
    l = re() !== null;
  return m.createElement(
    m.Fragment,
    null,
    !n && l ? m.createElement(J, { ref: t, ...r }) : m.createElement(ae, { ref: t, ...r })
  );
}
let J = W(Re),
  ae = W(Fe),
  He = W(Le),
  ze = Object.assign(J, { Child: He, Root: J });
export { ze as Transition };
