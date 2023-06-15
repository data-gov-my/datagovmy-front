import p, {
  createContext as ge,
  useState as ve,
  useRef as he,
  useReducer as De,
  createRef as Ee,
  useContext as Q,
  useCallback as z,
  useEffect as L,
  useMemo as D,
} from "react";
import { match as Y } from "../../utils/match.js";
import { Features as G, forwardRefWithAs as T, render as b } from "../../utils/render.js";
import { useSyncRefs as w } from "../../hooks/use-sync-refs.js";
import { Keys as $e } from "../keyboard.js";
import { isDisabledReactIssue7711 as ye } from "../../utils/bugs.js";
import { useId as C } from "../../hooks/use-id.js";
import { FocusTrap as y } from "../focus-trap/focus-trap.js";
import { useNestedPortals as Pe, Portal as x } from "../portal/portal.js";
import { ForcePortalRoot as B } from "../../internal/portal-force-root.js";
import { Description as Te, useDescriptions as be } from "../description/description.js";
import { useOpenClosed as we, State as A } from "../../internal/open-closed.js";
import { useServerHandoffComplete as Ce } from "../../hooks/use-server-handoff-complete.js";
import { StackProvider as Re, StackMessage as J } from "../../internal/stack-context.js";
import { useOutsideClick as Se } from "../../hooks/use-outside-click.js";
import { useOwnerDocument as ke } from "../../hooks/use-owner.js";
import { useEventListener as Ie } from "../../hooks/use-event-listener.js";
import { useEvent as P } from "../../hooks/use-event.js";
import { useDocumentOverflowLockedEffect as Oe } from "../../hooks/document-overflow/use-document-overflow.js";
import { useInert as K } from "../../hooks/use-inert.js";
import { useRootContainers as Me } from "../../hooks/use-root-containers.js";
var Ae = (e => ((e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e))(Ae || {}),
  Fe = (e => ((e[(e.SetTitleId = 0)] = "SetTitleId"), e))(Fe || {});
let Ne = {
    [0](e, t) {
      return e.titleId === t.id ? e : { ...e, titleId: t.id };
    },
  },
  F = ge(null);
F.displayName = "DialogContext";
function R(e) {
  let t = Q(F);
  if (t === null) {
    let a = new Error(`<${e} /> is missing a parent <Dialog /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(a, R), a);
  }
  return t;
}
function Ye(e, t, a = () => [document.body]) {
  Oe(e, t, n => {
    var i;
    return { containers: [...((i = n.containers) != null ? i : []), a] };
  });
}
function xe(e, t) {
  return Y(t.type, Ne, e, t);
}
let Be = "div",
  Le = G.RenderStrategy | G.Static;
function _e(e, t) {
  var a;
  let n = C(),
    {
      id: i = `headlessui-dialog-${n}`,
      open: o,
      onClose: l,
      initialFocus: c,
      __demoMode: f = !1,
      ...E
    } = e,
    [d, _] = ve(0),
    $ = we();
  o === void 0 && $ !== null && (o = ($ & A.Open) === A.Open);
  let g = he(null),
    V = w(g, t),
    v = ke(g),
    H = e.hasOwnProperty("open") || $ !== null,
    q = e.hasOwnProperty("onClose");
  if (!H && !q)
    throw new Error(
      "You have to provide an `open` and an `onClose` prop to the `Dialog` component."
    );
  if (!H)
    throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");
  if (!q)
    throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");
  if (typeof o != "boolean")
    throw new Error(
      `You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${o}`
    );
  if (typeof l != "function")
    throw new Error(
      `You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${l}`
    );
  let s = o ? 0 : 1,
    [S, Z] = De(xe, { titleId: null, descriptionId: null, panelRef: Ee() }),
    h = P(() => l(!1)),
    U = P(r => Z({ type: 0, id: r })),
    k = Ce() ? (f ? !1 : s === 0) : !1,
    I = d > 1,
    W = Q(F) !== null,
    [ee, te] = Pe(),
    {
      resolveContainers: N,
      mainTreeNodeRef: O,
      MainTreeNode: oe,
    } = Me({ portals: ee, defaultContainers: [(a = S.panelRef.current) != null ? a : g.current] }),
    re = I ? "parent" : "leaf",
    X = $ !== null ? ($ & A.Closing) === A.Closing : !1,
    ae = (() => (W || X ? !1 : k))(),
    le = z(() => {
      var r, m;
      return (m = Array.from(
        (r = v == null ? void 0 : v.querySelectorAll("body > *")) != null ? r : []
      ).find(u =>
        u.id === "headlessui-portal-root" ? !1 : u.contains(O.current) && u instanceof HTMLElement
      )) != null
        ? m
        : null;
    }, [O]);
  K(le, ae);
  let ne = (() => (I ? !0 : k))(),
    ie = z(() => {
      var r, m;
      return (m = Array.from(
        (r = v == null ? void 0 : v.querySelectorAll("[data-headlessui-portal]")) != null ? r : []
      ).find(u => u.contains(O.current) && u instanceof HTMLElement)) != null
        ? m
        : null;
    }, [O]);
  K(ie, ne);
  let se = (() => !(!k || I))();
  Se(N, h, se);
  let ue = (() => !(I || s !== 0))();
  Ie(v == null ? void 0 : v.defaultView, "keydown", r => {
    ue &&
      (r.defaultPrevented ||
        (r.key === $e.Escape && (r.preventDefault(), r.stopPropagation(), h())));
  });
  let pe = (() => !(X || s !== 0 || W))();
  Ye(v, pe, N),
    L(() => {
      if (s !== 0 || !g.current) return;
      let r = new ResizeObserver(m => {
        for (let u of m) {
          let M = u.target.getBoundingClientRect();
          M.x === 0 && M.y === 0 && M.width === 0 && M.height === 0 && h();
        }
      });
      return r.observe(g.current), () => r.disconnect();
    }, [s, g, h]);
  let [de, ce] = be(),
    fe = D(() => [{ dialogState: s, close: h, setTitleId: U }, S], [s, S, h, U]),
    j = D(() => ({ open: s === 0 }), [s]),
    me = {
      "ref": V,
      "id": i,
      "role": "dialog",
      "aria-modal": s === 0 ? !0 : void 0,
      "aria-labelledby": S.titleId,
      "aria-describedby": de,
    };
  return p.createElement(
    Re,
    {
      type: "Dialog",
      enabled: s === 0,
      element: g,
      onUpdate: P((r, m) => {
        m === "Dialog" && Y(r, { [J.Add]: () => _(u => u + 1), [J.Remove]: () => _(u => u - 1) });
      }),
    },
    p.createElement(
      B,
      { force: !0 },
      p.createElement(
        x,
        null,
        p.createElement(
          F.Provider,
          { value: fe },
          p.createElement(
            x.Group,
            { target: g },
            p.createElement(
              B,
              { force: !1 },
              p.createElement(
                ce,
                { slot: j, name: "Dialog.Description" },
                p.createElement(
                  y,
                  {
                    initialFocus: c,
                    containers: N,
                    features: k
                      ? Y(re, {
                          parent: y.features.RestoreFocus,
                          leaf: y.features.All & ~y.features.FocusLock,
                        })
                      : y.features.None,
                  },
                  p.createElement(
                    te,
                    null,
                    b({
                      ourProps: me,
                      theirProps: E,
                      slot: j,
                      defaultTag: Be,
                      features: Le,
                      visible: s === 0,
                      name: "Dialog",
                    })
                  )
                )
              )
            )
          )
        )
      )
    ),
    p.createElement(oe, null)
  );
}
let He = "div";
function qe(e, t) {
  let a = C(),
    { id: n = `headlessui-dialog-overlay-${a}`, ...i } = e,
    [{ dialogState: o, close: l }] = R("Dialog.Overlay"),
    c = w(t),
    f = P(d => {
      if (d.target === d.currentTarget) {
        if (ye(d.currentTarget)) return d.preventDefault();
        d.preventDefault(), d.stopPropagation(), l();
      }
    }),
    E = D(() => ({ open: o === 0 }), [o]);
  return b({
    ourProps: { "ref": c, "id": n, "aria-hidden": !0, "onClick": f },
    theirProps: i,
    slot: E,
    defaultTag: He,
    name: "Dialog.Overlay",
  });
}
let Ue = "div";
function We(e, t) {
  let a = C(),
    { id: n = `headlessui-dialog-backdrop-${a}`, ...i } = e,
    [{ dialogState: o }, l] = R("Dialog.Backdrop"),
    c = w(t);
  L(() => {
    if (l.panelRef.current === null)
      throw new Error(
        "A <Dialog.Backdrop /> component is being used, but a <Dialog.Panel /> component is missing."
      );
  }, [l.panelRef]);
  let f = D(() => ({ open: o === 0 }), [o]);
  return p.createElement(
    B,
    { force: !0 },
    p.createElement(
      x,
      null,
      b({
        ourProps: { "ref": c, "id": n, "aria-hidden": !0 },
        theirProps: i,
        slot: f,
        defaultTag: Ue,
        name: "Dialog.Backdrop",
      })
    )
  );
}
let Xe = "div";
function je(e, t) {
  let a = C(),
    { id: n = `headlessui-dialog-panel-${a}`, ...i } = e,
    [{ dialogState: o }, l] = R("Dialog.Panel"),
    c = w(t, l.panelRef),
    f = D(() => ({ open: o === 0 }), [o]),
    E = P(d => {
      d.stopPropagation();
    });
  return b({
    ourProps: { ref: c, id: n, onClick: E },
    theirProps: i,
    slot: f,
    defaultTag: Xe,
    name: "Dialog.Panel",
  });
}
let ze = "h2";
function Ge(e, t) {
  let a = C(),
    { id: n = `headlessui-dialog-title-${a}`, ...i } = e,
    [{ dialogState: o, setTitleId: l }] = R("Dialog.Title"),
    c = w(t);
  L(() => (l(n), () => l(null)), [n, l]);
  let f = D(() => ({ open: o === 0 }), [o]);
  return b({
    ourProps: { ref: c, id: n },
    theirProps: i,
    slot: f,
    defaultTag: ze,
    name: "Dialog.Title",
  });
}
let Je = T(_e),
  Ke = T(We),
  Qe = T(je),
  Ve = T(qe),
  Ze = T(Ge),
  yt = Object.assign(Je, { Backdrop: Ke, Panel: Qe, Overlay: Ve, Title: Ze, Description: Te });
export { yt as Dialog };
