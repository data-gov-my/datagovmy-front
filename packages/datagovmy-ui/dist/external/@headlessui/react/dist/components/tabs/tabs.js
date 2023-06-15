import L, {
  createContext as J,
  useReducer as re,
  useMemo as R,
  useRef as j,
  useContext as Q,
  Fragment as ne,
} from "react";
import { Features as V, forwardRefWithAs as O, render as M } from "../../utils/render.js";
import { useId as Y } from "../../hooks/use-id.js";
import { match as F } from "../../utils/match.js";
import { Keys as x } from "../keyboard.js";
import {
  sortByDomNode as C,
  FocusResult as U,
  focusIn as w,
  Focus as g,
} from "../../utils/focus-management.js";
import { useIsoMorphicEffect as W } from "../../hooks/use-iso-morphic-effect.js";
import { useSyncRefs as N } from "../../hooks/use-sync-refs.js";
import { useResolveButtonType as ae } from "../../hooks/use-resolve-button-type.js";
import { useLatestValue as z } from "../../hooks/use-latest-value.js";
import { FocusSentinel as le } from "../../internal/focus-sentinel.js";
import { useEvent as S } from "../../hooks/use-event.js";
import { microTask as se } from "../../utils/micro-task.js";
import { Hidden as oe } from "../../internal/hidden.js";
import { getOwnerDocument as ie } from "../../utils/owner.js";
import {
  StableCollection as ue,
  useStableCollectionIndex as Z,
} from "../../utils/stable-collection.js";
var ce = (e => ((e[(e.Forwards = 0)] = "Forwards"), (e[(e.Backwards = 1)] = "Backwards"), e))(
    ce || {}
  ),
  de = (e => (
    (e[(e.Less = -1)] = "Less"), (e[(e.Equal = 0)] = "Equal"), (e[(e.Greater = 1)] = "Greater"), e
  ))(de || {}),
  pe = (e => (
    (e[(e.SetSelectedIndex = 0)] = "SetSelectedIndex"),
    (e[(e.RegisterTab = 1)] = "RegisterTab"),
    (e[(e.UnregisterTab = 2)] = "UnregisterTab"),
    (e[(e.RegisterPanel = 3)] = "RegisterPanel"),
    (e[(e.UnregisterPanel = 4)] = "UnregisterPanel"),
    e
  ))(pe || {});
let fe = {
    [0](e, t) {
      var r;
      let a = C(e.tabs, o => o.current),
        c = C(e.panels, o => o.current),
        u = a.filter(o => {
          var I;
          return !((I = o.current) != null && I.hasAttribute("disabled"));
        }),
        s = { ...e, tabs: a, panels: c };
      if (t.index < 0 || t.index > a.length - 1) {
        let o = F(Math.sign(t.index - e.selectedIndex), {
          [-1]: () => 1,
          [0]: () => F(Math.sign(t.index), { [-1]: () => 0, [0]: () => 0, [1]: () => 1 }),
          [1]: () => 0,
        });
        return u.length === 0
          ? s
          : {
              ...s,
              selectedIndex: F(o, {
                [0]: () => a.indexOf(u[0]),
                [1]: () => a.indexOf(u[u.length - 1]),
              }),
            };
      }
      let h = a.slice(0, t.index),
        T = [...a.slice(t.index), ...h].find(o => u.includes(o));
      if (!T) return s;
      let f = (r = a.indexOf(T)) != null ? r : e.selectedIndex;
      return f === -1 && (f = e.selectedIndex), { ...s, selectedIndex: f };
    },
    [1](e, t) {
      var r;
      if (e.tabs.includes(t.tab)) return e;
      let a = e.tabs[e.selectedIndex],
        c = C([...e.tabs, t.tab], s => s.current),
        u = (r = c.indexOf(a)) != null ? r : e.selectedIndex;
      return u === -1 && (u = e.selectedIndex), { ...e, tabs: c, selectedIndex: u };
    },
    [2](e, t) {
      return { ...e, tabs: e.tabs.filter(r => r !== t.tab) };
    },
    [3](e, t) {
      return e.panels.includes(t.panel)
        ? e
        : { ...e, panels: C([...e.panels, t.panel], r => r.current) };
    },
    [4](e, t) {
      return { ...e, panels: e.panels.filter(r => r !== t.panel) };
    },
  },
  H = J(null);
H.displayName = "TabsDataContext";
function k(e) {
  let t = Q(H);
  if (t === null) {
    let r = new Error(`<${e} /> is missing a parent <Tab.Group /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(r, k), r);
  }
  return t;
}
let K = J(null);
K.displayName = "TabsActionsContext";
function X(e) {
  let t = Q(K);
  if (t === null) {
    let r = new Error(`<${e} /> is missing a parent <Tab.Group /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(r, X), r);
  }
  return t;
}
function be(e, t) {
  return F(t.type, fe, e, t);
}
let me = ne;
function xe(e, t) {
  let {
    defaultIndex: r = 0,
    vertical: a = !1,
    manual: c = !1,
    onChange: u,
    selectedIndex: s = null,
    ...h
  } = e;
  const T = a ? "vertical" : "horizontal",
    f = c ? "manual" : "auto";
  let o = s !== null,
    I = N(t),
    [l, m] = re(be, { selectedIndex: s ?? r, tabs: [], panels: [] }),
    d = R(() => ({ selectedIndex: l.selectedIndex }), [l.selectedIndex]),
    A = z(u || (() => {})),
    D = z(l.tabs),
    p = R(() => ({ orientation: T, activation: f, ...l }), [T, f, l]),
    b = S(i => (m({ type: 1, tab: i }), () => m({ type: 2, tab: i }))),
    y = S(i => (m({ type: 3, panel: i }), () => m({ type: 4, panel: i }))),
    $ = S(i => {
      E.current !== i && A.current(i), o || m({ type: 0, index: i });
    }),
    E = z(o ? e.selectedIndex : l.selectedIndex),
    G = R(() => ({ registerTab: b, registerPanel: y, change: $ }), []);
  W(() => {
    m({ type: 0, index: s ?? r });
  }, [s]),
    W(() => {
      if (E.current === void 0 || l.tabs.length <= 0) return;
      let i = C(l.tabs, P => P.current);
      i.some((P, n) => l.tabs[n] !== P) && $(i.indexOf(l.tabs[E.current]));
    });
  let q = { ref: I };
  return L.createElement(
    ue,
    null,
    L.createElement(
      K.Provider,
      { value: G },
      L.createElement(
        H.Provider,
        { value: p },
        p.tabs.length <= 0 &&
          L.createElement(le, {
            onFocus: () => {
              var i, P;
              for (let n of D.current)
                if (((i = n.current) == null ? void 0 : i.tabIndex) === 0)
                  return (P = n.current) == null || P.focus(), !0;
              return !1;
            },
          }),
        M({ ourProps: q, theirProps: h, slot: d, defaultTag: me, name: "Tabs" })
      )
    )
  );
}
let ge = "div";
function Te(e, t) {
  let { orientation: r, selectedIndex: a } = k("Tab.List"),
    c = N(t);
  return M({
    ourProps: { "ref": c, "role": "tablist", "aria-orientation": r },
    theirProps: e,
    slot: { selectedIndex: a },
    defaultTag: ge,
    name: "Tabs.List",
  });
}
let ve = "button";
function Ie(e, t) {
  var r, a;
  let c = Y(),
    { id: u = `headlessui-tabs-tab-${c}`, ...s } = e,
    { orientation: h, activation: T, selectedIndex: f, tabs: o, panels: I } = k("Tab"),
    l = X("Tab"),
    m = k("Tab"),
    d = j(null),
    A = N(d, t);
  W(() => l.registerTab(d), [l, d]);
  let D = Z("tabs"),
    p = o.indexOf(d);
  p === -1 && (p = D);
  let b = p === f,
    y = S(n => {
      var v;
      let B = n();
      if (B === U.Success && T === "auto") {
        let ee = (v = ie(d)) == null ? void 0 : v.activeElement,
          _ = m.tabs.findIndex(te => te.current === ee);
        _ !== -1 && l.change(_);
      }
      return B;
    }),
    $ = S(n => {
      let v = o.map(B => B.current).filter(Boolean);
      if (n.key === x.Space || n.key === x.Enter) {
        n.preventDefault(), n.stopPropagation(), l.change(p);
        return;
      }
      switch (n.key) {
        case x.Home:
        case x.PageUp:
          return n.preventDefault(), n.stopPropagation(), y(() => w(v, g.First));
        case x.End:
        case x.PageDown:
          return n.preventDefault(), n.stopPropagation(), y(() => w(v, g.Last));
      }
      if (
        y(() =>
          F(h, {
            vertical() {
              return n.key === x.ArrowUp
                ? w(v, g.Previous | g.WrapAround)
                : n.key === x.ArrowDown
                ? w(v, g.Next | g.WrapAround)
                : U.Error;
            },
            horizontal() {
              return n.key === x.ArrowLeft
                ? w(v, g.Previous | g.WrapAround)
                : n.key === x.ArrowRight
                ? w(v, g.Next | g.WrapAround)
                : U.Error;
            },
          })
        ) === U.Success
      )
        return n.preventDefault();
    }),
    E = j(!1),
    G = S(() => {
      var n;
      E.current ||
        ((E.current = !0),
        (n = d.current) == null || n.focus(),
        l.change(p),
        se(() => {
          E.current = !1;
        }));
    }),
    q = S(n => {
      n.preventDefault();
    }),
    i = R(() => ({ selected: b }), [b]),
    P = {
      "ref": A,
      "onKeyDown": $,
      "onMouseDown": q,
      "onClick": G,
      "id": u,
      "role": "tab",
      "type": ae(e, d),
      "aria-controls": (a = (r = I[p]) == null ? void 0 : r.current) == null ? void 0 : a.id,
      "aria-selected": b,
      "tabIndex": b ? 0 : -1,
    };
  return M({ ourProps: P, theirProps: s, slot: i, defaultTag: ve, name: "Tabs.Tab" });
}
let Pe = "div";
function he(e, t) {
  let { selectedIndex: r } = k("Tab.Panels"),
    a = N(t),
    c = R(() => ({ selectedIndex: r }), [r]);
  return M({ ourProps: { ref: a }, theirProps: e, slot: c, defaultTag: Pe, name: "Tabs.Panels" });
}
let ye = "div",
  $e = V.RenderStrategy | V.Static;
function Ee(e, t) {
  var r, a, c, u;
  let s = Y(),
    { id: h = `headlessui-tabs-panel-${s}`, tabIndex: T = 0, ...f } = e,
    { selectedIndex: o, tabs: I, panels: l } = k("Tab.Panel"),
    m = X("Tab.Panel"),
    d = j(null),
    A = N(d, t);
  W(() => m.registerPanel(d), [m, d]);
  let D = Z("panels"),
    p = l.indexOf(d);
  p === -1 && (p = D);
  let b = p === o,
    y = R(() => ({ selected: b }), [b]),
    $ = {
      "ref": A,
      "id": h,
      "role": "tabpanel",
      "aria-labelledby": (a = (r = I[p]) == null ? void 0 : r.current) == null ? void 0 : a.id,
      "tabIndex": b ? T : -1,
    };
  return !b && ((c = f.unmount) == null || c) && !((u = f.static) != null && u)
    ? L.createElement(oe, { as: "span", ...$ })
    : M({
        ourProps: $,
        theirProps: f,
        slot: y,
        defaultTag: ye,
        features: $e,
        visible: b,
        name: "Tabs.Panel",
      });
}
let Se = O(Ie),
  we = O(xe),
  Re = O(Te),
  ke = O(he),
  Ae = O(Ee),
  Xe = Object.assign(Se, { Group: we, List: Re, Panels: ke, Panel: Ae });
export { Xe as Tab };
