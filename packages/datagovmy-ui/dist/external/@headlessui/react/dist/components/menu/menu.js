import L, {
  createContext as j,
  useReducer as q,
  createRef as Q,
  useMemo as D,
  useEffect as J,
  useRef as U,
  useContext as X,
  Fragment as V,
} from "react";
import { match as W } from "../../utils/match.js";
import { Features as K, forwardRefWithAs as T, render as k } from "../../utils/render.js";
import { disposables as A } from "../../utils/disposables.js";
import { useDisposables as G } from "../../hooks/use-disposables.js";
import { useIsoMorphicEffect as w } from "../../hooks/use-iso-morphic-effect.js";
import { useSyncRefs as E } from "../../hooks/use-sync-refs.js";
import { useId as O } from "../../hooks/use-id.js";
import { Keys as m } from "../keyboard.js";
import { Focus as y, calculateActiveIndex as z } from "../../utils/calculate-active-index.js";
import { isDisabledReactIssue7711 as Y } from "../../utils/bugs.js";
import {
  isFocusableElement as Z,
  FocusableMode as ee,
  focusFrom as te,
  Focus as B,
  restoreFocusIfNecessary as H,
  sortByDomNode as re,
} from "../../utils/focus-management.js";
import { useOutsideClick as ae } from "../../hooks/use-outside-click.js";
import { useTreeWalker as oe } from "../../hooks/use-tree-walker.js";
import {
  OpenClosedProvider as ne,
  State as M,
  useOpenClosed as se,
} from "../../internal/open-closed.js";
import { useResolveButtonType as ie } from "../../hooks/use-resolve-button-type.js";
import { useOwnerDocument as ue } from "../../hooks/use-owner.js";
import { useEvent as f } from "../../hooks/use-event.js";
import { useTrackedPointer as le } from "../../hooks/use-tracked-pointer.js";
import { useTextValue as ce } from "../../hooks/use-text-value.js";
var me = (e => ((e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e))(me || {}),
  de = (e => ((e[(e.Pointer = 0)] = "Pointer"), (e[(e.Other = 1)] = "Other"), e))(de || {}),
  pe = (e => (
    (e[(e.OpenMenu = 0)] = "OpenMenu"),
    (e[(e.CloseMenu = 1)] = "CloseMenu"),
    (e[(e.GoToItem = 2)] = "GoToItem"),
    (e[(e.Search = 3)] = "Search"),
    (e[(e.ClearSearch = 4)] = "ClearSearch"),
    (e[(e.RegisterItem = 5)] = "RegisterItem"),
    (e[(e.UnregisterItem = 6)] = "UnregisterItem"),
    e
  ))(pe || {});
function C(e, i = n => n) {
  let n = e.activeItemIndex !== null ? e.items[e.activeItemIndex] : null,
    a = re(i(e.items.slice()), u => u.dataRef.current.domRef.current),
    o = n ? a.indexOf(n) : null;
  return o === -1 && (o = null), { items: a, activeItemIndex: o };
}
let fe = {
    [1](e) {
      return e.menuState === 1 ? e : { ...e, activeItemIndex: null, menuState: 1 };
    },
    [0](e) {
      return e.menuState === 0 ? e : { ...e, __demoMode: !1, menuState: 0 };
    },
    [2]: (e, i) => {
      var n;
      let a = C(e),
        o = z(i, {
          resolveItems: () => a.items,
          resolveActiveIndex: () => a.activeItemIndex,
          resolveId: u => u.id,
          resolveDisabled: u => u.dataRef.current.disabled,
        });
      return {
        ...e,
        ...a,
        searchQuery: "",
        activeItemIndex: o,
        activationTrigger: (n = i.trigger) != null ? n : 1,
      };
    },
    [3]: (e, i) => {
      let n = e.searchQuery !== "" ? 0 : 1,
        a = e.searchQuery + i.value.toLowerCase(),
        o = (
          e.activeItemIndex !== null
            ? e.items.slice(e.activeItemIndex + n).concat(e.items.slice(0, e.activeItemIndex + n))
            : e.items
        ).find(s => {
          var t;
          return (
            ((t = s.dataRef.current.textValue) == null ? void 0 : t.startsWith(a)) &&
            !s.dataRef.current.disabled
          );
        }),
        u = o ? e.items.indexOf(o) : -1;
      return u === -1 || u === e.activeItemIndex
        ? { ...e, searchQuery: a }
        : { ...e, searchQuery: a, activeItemIndex: u, activationTrigger: 1 };
    },
    [4](e) {
      return e.searchQuery === "" ? e : { ...e, searchQuery: "", searchActiveItemIndex: null };
    },
    [5]: (e, i) => {
      let n = C(e, a => [...a, { id: i.id, dataRef: i.dataRef }]);
      return { ...e, ...n };
    },
    [6]: (e, i) => {
      let n = C(e, a => {
        let o = a.findIndex(u => u.id === i.id);
        return o !== -1 && a.splice(o, 1), a;
      });
      return { ...e, ...n, activationTrigger: 1 };
    },
  },
  _ = j(null);
_.displayName = "MenuContext";
function F(e) {
  let i = X(_);
  if (i === null) {
    let n = new Error(`<${e} /> is missing a parent <Menu /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(n, F), n);
  }
  return i;
}
function ve(e, i) {
  return W(i.type, fe, e, i);
}
let Ie = V;
function ye(e, i) {
  let { __demoMode: n = !1, ...a } = e,
    o = q(ve, {
      __demoMode: n,
      menuState: n ? 0 : 1,
      buttonRef: Q(),
      itemsRef: Q(),
      items: [],
      searchQuery: "",
      activeItemIndex: null,
      activationTrigger: 1,
    }),
    [{ menuState: u, itemsRef: s, buttonRef: t }, l] = o,
    p = E(i);
  ae(
    [t, s],
    (g, x) => {
      var c;
      l({ type: 1 }), Z(x, ee.Loose) || (g.preventDefault(), (c = t.current) == null || c.focus());
    },
    u === 0
  );
  let I = f(() => {
      l({ type: 1 });
    }),
    b = D(() => ({ open: u === 0, close: I }), [u, I]),
    v = { ref: p };
  return L.createElement(
    _.Provider,
    { value: o },
    L.createElement(
      ne,
      { value: W(u, { [0]: M.Open, [1]: M.Closed }) },
      k({ ourProps: v, theirProps: a, slot: b, defaultTag: Ie, name: "Menu" })
    )
  );
}
let be = "button";
function ge(e, i) {
  var n;
  let a = O(),
    { id: o = `headlessui-menu-button-${a}`, ...u } = e,
    [s, t] = F("Menu.Button"),
    l = E(s.buttonRef, i),
    p = G(),
    I = f(c => {
      switch (c.key) {
        case m.Space:
        case m.Enter:
        case m.ArrowDown:
          c.preventDefault(),
            c.stopPropagation(),
            t({ type: 0 }),
            p.nextFrame(() => t({ type: 2, focus: y.First }));
          break;
        case m.ArrowUp:
          c.preventDefault(),
            c.stopPropagation(),
            t({ type: 0 }),
            p.nextFrame(() => t({ type: 2, focus: y.Last }));
          break;
      }
    }),
    b = f(c => {
      switch (c.key) {
        case m.Space:
          c.preventDefault();
          break;
      }
    }),
    v = f(c => {
      if (Y(c.currentTarget)) return c.preventDefault();
      e.disabled ||
        (s.menuState === 0
          ? (t({ type: 1 }),
            p.nextFrame(() => {
              var R;
              return (R = s.buttonRef.current) == null ? void 0 : R.focus({ preventScroll: !0 });
            }))
          : (c.preventDefault(), t({ type: 0 })));
    }),
    g = D(() => ({ open: s.menuState === 0 }), [s]),
    x = {
      "ref": l,
      "id": o,
      "type": ie(e, s.buttonRef),
      "aria-haspopup": "menu",
      "aria-controls": (n = s.itemsRef.current) == null ? void 0 : n.id,
      "aria-expanded": e.disabled ? void 0 : s.menuState === 0,
      "onKeyDown": I,
      "onKeyUp": b,
      "onClick": v,
    };
  return k({ ourProps: x, theirProps: u, slot: g, defaultTag: be, name: "Menu.Button" });
}
let Re = "div",
  xe = K.RenderStrategy | K.Static;
function he(e, i) {
  var n, a;
  let o = O(),
    { id: u = `headlessui-menu-items-${o}`, ...s } = e,
    [t, l] = F("Menu.Items"),
    p = E(t.itemsRef, i),
    I = ue(t.itemsRef),
    b = G(),
    v = se(),
    g = (() => (v !== null ? (v & M.Open) === M.Open : t.menuState === 0))();
  J(() => {
    let r = t.itemsRef.current;
    r &&
      t.menuState === 0 &&
      r !== (I == null ? void 0 : I.activeElement) &&
      r.focus({ preventScroll: !0 });
  }, [t.menuState, t.itemsRef, I]),
    oe({
      container: t.itemsRef.current,
      enabled: t.menuState === 0,
      accept(r) {
        return r.getAttribute("role") === "menuitem"
          ? NodeFilter.FILTER_REJECT
          : r.hasAttribute("role")
          ? NodeFilter.FILTER_SKIP
          : NodeFilter.FILTER_ACCEPT;
      },
      walk(r) {
        r.setAttribute("role", "none");
      },
    });
  let x = f(r => {
      var h, P;
      switch ((b.dispose(), r.key)) {
        case m.Space:
          if (t.searchQuery !== "")
            return r.preventDefault(), r.stopPropagation(), l({ type: 3, value: r.key });
        case m.Enter:
          if (
            (r.preventDefault(), r.stopPropagation(), l({ type: 1 }), t.activeItemIndex !== null)
          ) {
            let { dataRef: d } = t.items[t.activeItemIndex];
            (P = (h = d.current) == null ? void 0 : h.domRef.current) == null || P.click();
          }
          H(t.buttonRef.current);
          break;
        case m.ArrowDown:
          return r.preventDefault(), r.stopPropagation(), l({ type: 2, focus: y.Next });
        case m.ArrowUp:
          return r.preventDefault(), r.stopPropagation(), l({ type: 2, focus: y.Previous });
        case m.Home:
        case m.PageUp:
          return r.preventDefault(), r.stopPropagation(), l({ type: 2, focus: y.First });
        case m.End:
        case m.PageDown:
          return r.preventDefault(), r.stopPropagation(), l({ type: 2, focus: y.Last });
        case m.Escape:
          r.preventDefault(),
            r.stopPropagation(),
            l({ type: 1 }),
            A().nextFrame(() => {
              var d;
              return (d = t.buttonRef.current) == null ? void 0 : d.focus({ preventScroll: !0 });
            });
          break;
        case m.Tab:
          r.preventDefault(),
            r.stopPropagation(),
            l({ type: 1 }),
            A().nextFrame(() => {
              te(t.buttonRef.current, r.shiftKey ? B.Previous : B.Next);
            });
          break;
        default:
          r.key.length === 1 &&
            (l({ type: 3, value: r.key }), b.setTimeout(() => l({ type: 4 }), 350));
          break;
      }
    }),
    c = f(r => {
      switch (r.key) {
        case m.Space:
          r.preventDefault();
          break;
      }
    }),
    R = D(() => ({ open: t.menuState === 0 }), [t]),
    S = {
      "aria-activedescendant":
        t.activeItemIndex === null || (n = t.items[t.activeItemIndex]) == null ? void 0 : n.id,
      "aria-labelledby": (a = t.buttonRef.current) == null ? void 0 : a.id,
      "id": u,
      "onKeyDown": x,
      "onKeyUp": c,
      "role": "menu",
      "tabIndex": 0,
      "ref": p,
    };
  return k({
    ourProps: S,
    theirProps: s,
    slot: R,
    defaultTag: Re,
    features: xe,
    visible: g,
    name: "Menu.Items",
  });
}
let Se = V;
function Pe(e, i) {
  let n = O(),
    { id: a = `headlessui-menu-item-${n}`, disabled: o = !1, ...u } = e,
    [s, t] = F("Menu.Item"),
    l = s.activeItemIndex !== null ? s.items[s.activeItemIndex].id === a : !1,
    p = U(null),
    I = E(i, p);
  w(() => {
    if (s.__demoMode || s.menuState !== 0 || !l || s.activationTrigger === 0) return;
    let d = A();
    return (
      d.requestAnimationFrame(() => {
        var $, N;
        (N = ($ = p.current) == null ? void 0 : $.scrollIntoView) == null ||
          N.call($, { block: "nearest" });
      }),
      d.dispose
    );
  }, [s.__demoMode, p, l, s.menuState, s.activationTrigger, s.activeItemIndex]);
  let b = ce(p),
    v = U({
      disabled: o,
      domRef: p,
      get textValue() {
        return b();
      },
    });
  w(() => {
    v.current.disabled = o;
  }, [v, o]),
    w(() => (t({ type: 5, id: a, dataRef: v }), () => t({ type: 6, id: a })), [v, a]);
  let g = f(() => {
      t({ type: 1 });
    }),
    x = f(d => {
      if (o) return d.preventDefault();
      t({ type: 1 }), H(s.buttonRef.current);
    }),
    c = f(() => {
      if (o) return t({ type: 2, focus: y.Nothing });
      t({ type: 2, focus: y.Specific, id: a });
    }),
    R = le(),
    S = f(d => R.update(d)),
    r = f(d => {
      R.wasMoved(d) && (o || l || t({ type: 2, focus: y.Specific, id: a, trigger: 0 }));
    }),
    h = f(d => {
      R.wasMoved(d) && (o || (l && t({ type: 2, focus: y.Nothing })));
    }),
    P = D(() => ({ active: l, disabled: o, close: g }), [l, o, g]);
  return k({
    ourProps: {
      "id": a,
      "ref": I,
      "role": "menuitem",
      "tabIndex": o === !0 ? void 0 : -1,
      "aria-disabled": o === !0 ? !0 : void 0,
      "disabled": void 0,
      "onClick": x,
      "onFocus": c,
      "onPointerEnter": S,
      "onMouseEnter": S,
      "onPointerMove": r,
      "onMouseMove": r,
      "onPointerLeave": h,
      "onMouseLeave": h,
    },
    theirProps: u,
    slot: P,
    defaultTag: Se,
    name: "Menu.Item",
  });
}
let Me = T(ye),
  De = T(ge),
  Te = T(he),
  ke = T(Pe),
  Je = Object.assign(Me, { Button: De, Items: Te, Item: ke });
export { Je as Menu };
