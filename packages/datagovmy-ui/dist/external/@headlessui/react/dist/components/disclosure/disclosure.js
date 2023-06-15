import S, {
  createContext as T,
  useRef as b,
  Fragment as M,
  useReducer as A,
  useMemo as v,
  useEffect as H,
  useContext as C,
} from "react";
import { match as R } from "../../utils/match.js";
import { Features as L, forwardRefWithAs as $, render as h } from "../../utils/render.js";
import { useSyncRefs as w, optionalRef as F } from "../../hooks/use-sync-refs.js";
import { useId as N } from "../../hooks/use-id.js";
import { Keys as I } from "../keyboard.js";
import { isDisabledReactIssue7711 as _ } from "../../utils/bugs.js";
import {
  OpenClosedProvider as j,
  State as g,
  useOpenClosed as q,
} from "../../internal/open-closed.js";
import { useResolveButtonType as z } from "../../hooks/use-resolve-button-type.js";
import { getOwnerDocument as Q } from "../../utils/owner.js";
import { useEvent as k } from "../../hooks/use-event.js";
import { startTransition as V } from "../../utils/start-transition.js";
var W = (e => ((e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e))(W || {}),
  X = (e => (
    (e[(e.ToggleDisclosure = 0)] = "ToggleDisclosure"),
    (e[(e.CloseDisclosure = 1)] = "CloseDisclosure"),
    (e[(e.SetButtonId = 2)] = "SetButtonId"),
    (e[(e.SetPanelId = 3)] = "SetPanelId"),
    (e[(e.LinkPanel = 4)] = "LinkPanel"),
    (e[(e.UnlinkPanel = 5)] = "UnlinkPanel"),
    e
  ))(X || {});
let Y = {
    [0]: e => ({ ...e, disclosureState: R(e.disclosureState, { [0]: 1, [1]: 0 }) }),
    [1]: e => (e.disclosureState === 1 ? e : { ...e, disclosureState: 1 }),
    [4](e) {
      return e.linkedPanel === !0 ? e : { ...e, linkedPanel: !0 };
    },
    [5](e) {
      return e.linkedPanel === !1 ? e : { ...e, linkedPanel: !1 };
    },
    [2](e, t) {
      return e.buttonId === t.buttonId ? e : { ...e, buttonId: t.buttonId };
    },
    [3](e, t) {
      return e.panelId === t.panelId ? e : { ...e, panelId: t.panelId };
    },
  },
  O = T(null);
O.displayName = "DisclosureContext";
function B(e) {
  let t = C(O);
  if (t === null) {
    let o = new Error(`<${e} /> is missing a parent <Disclosure /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(o, B), o);
  }
  return t;
}
let x = T(null);
x.displayName = "DisclosureAPIContext";
function U(e) {
  let t = C(x);
  if (t === null) {
    let o = new Error(`<${e} /> is missing a parent <Disclosure /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(o, U), o);
  }
  return t;
}
let K = T(null);
K.displayName = "DisclosurePanelContext";
function Z() {
  return C(K);
}
function G(e, t) {
  return R(t.type, Y, e, t);
}
let J = M;
function ee(e, t) {
  let { defaultOpen: o = !1, ...a } = e,
    m = b(null),
    n = w(
      t,
      F(i => {
        m.current = i;
      }, e.as === void 0 || e.as === M)
    ),
    l = b(null),
    f = b(null),
    s = A(G, {
      disclosureState: o ? 0 : 1,
      linkedPanel: !1,
      buttonRef: f,
      panelRef: l,
      buttonId: null,
      panelId: null,
    }),
    [{ disclosureState: u, buttonId: c }, P] = s,
    d = k(i => {
      P({ type: 1 });
      let r = Q(m);
      if (!r || !c) return;
      let p = (() =>
        i
          ? i instanceof HTMLElement
            ? i
            : i.current instanceof HTMLElement
            ? i.current
            : r.getElementById(c)
          : r.getElementById(c))();
      p == null || p.focus();
    }),
    y = v(() => ({ close: d }), [d]),
    E = v(() => ({ open: u === 0, close: d }), [u, d]),
    D = { ref: n };
  return S.createElement(
    O.Provider,
    { value: s },
    S.createElement(
      x.Provider,
      { value: y },
      S.createElement(
        j,
        { value: R(u, { [0]: g.Open, [1]: g.Closed }) },
        h({ ourProps: D, theirProps: a, slot: E, defaultTag: J, name: "Disclosure" })
      )
    )
  );
}
let te = "button";
function ne(e, t) {
  let o = N(),
    { id: a = `headlessui-disclosure-button-${o}`, ...m } = e,
    [n, l] = B("Disclosure.Button"),
    f = Z(),
    s = f === null ? !1 : f === n.panelId,
    u = b(null),
    c = w(u, t, s ? null : n.buttonRef);
  H(() => {
    if (!s)
      return (
        l({ type: 2, buttonId: a }),
        () => {
          l({ type: 2, buttonId: null });
        }
      );
  }, [a, l, s]);
  let P = k(r => {
      var p;
      if (s) {
        if (n.disclosureState === 1) return;
        switch (r.key) {
          case I.Space:
          case I.Enter:
            r.preventDefault(),
              r.stopPropagation(),
              l({ type: 0 }),
              (p = n.buttonRef.current) == null || p.focus();
            break;
        }
      } else
        switch (r.key) {
          case I.Space:
          case I.Enter:
            r.preventDefault(), r.stopPropagation(), l({ type: 0 });
            break;
        }
    }),
    d = k(r => {
      switch (r.key) {
        case I.Space:
          r.preventDefault();
          break;
      }
    }),
    y = k(r => {
      var p;
      _(r.currentTarget) ||
        e.disabled ||
        (s ? (l({ type: 0 }), (p = n.buttonRef.current) == null || p.focus()) : l({ type: 0 }));
    }),
    E = v(() => ({ open: n.disclosureState === 0 }), [n]),
    D = z(e, u),
    i = s
      ? { ref: c, type: D, onKeyDown: P, onClick: y }
      : {
          "ref": c,
          "id": a,
          "type": D,
          "aria-expanded": e.disabled ? void 0 : n.disclosureState === 0,
          "aria-controls": n.linkedPanel ? n.panelId : void 0,
          "onKeyDown": P,
          "onKeyUp": d,
          "onClick": y,
        };
  return h({ ourProps: i, theirProps: m, slot: E, defaultTag: te, name: "Disclosure.Button" });
}
let re = "div",
  le = L.RenderStrategy | L.Static;
function oe(e, t) {
  let o = N(),
    { id: a = `headlessui-disclosure-panel-${o}`, ...m } = e,
    [n, l] = B("Disclosure.Panel"),
    { close: f } = U("Disclosure.Panel"),
    s = w(t, n.panelRef, y => {
      V(() => l({ type: y ? 4 : 5 }));
    });
  H(
    () => (
      l({ type: 3, panelId: a }),
      () => {
        l({ type: 3, panelId: null });
      }
    ),
    [a, l]
  );
  let u = q(),
    c = (() => (u !== null ? (u & g.Open) === g.Open : n.disclosureState === 0))(),
    P = v(() => ({ open: n.disclosureState === 0, close: f }), [n, f]),
    d = { ref: s, id: a };
  return S.createElement(
    K.Provider,
    { value: n.panelId },
    h({
      ourProps: d,
      theirProps: m,
      slot: P,
      defaultTag: re,
      features: le,
      visible: c,
      name: "Disclosure.Panel",
    })
  );
}
let se = $(ee),
  ae = $(ne),
  ue = $(oe),
  ke = Object.assign(se, { Button: ae, Panel: ue });
export { ke as Disclosure };
