import U, {
  createContext as Z,
  useReducer as xe,
  createRef as me,
  useRef as D,
  useCallback as ge,
  useMemo as C,
  useEffect as ee,
  useContext as te,
  Fragment as Oe,
} from "react";
import { useDisposables as V } from "../../hooks/use-disposables.js";
import { useId as K } from "../../hooks/use-id.js";
import { useIsoMorphicEffect as z } from "../../hooks/use-iso-morphic-effect.js";
import { useComputed as oe } from "../../hooks/use-computed.js";
import { useSyncRefs as w } from "../../hooks/use-sync-refs.js";
import {
  Features as _,
  forwardRefWithAs as F,
  compact as Re,
  render as A,
} from "../../utils/render.js";
import { match as E } from "../../utils/match.js";
import { disposables as q } from "../../utils/disposables.js";
import { Keys as x } from "../keyboard.js";
import { Focus as h, calculateActiveIndex as Se } from "../../utils/calculate-active-index.js";
import { isDisabledReactIssue7711 as he } from "../../utils/bugs.js";
import {
  isFocusableElement as Le,
  FocusableMode as ye,
  sortByDomNode as Ie,
} from "../../utils/focus-management.js";
import {
  OpenClosedProvider as Te,
  State as G,
  useOpenClosed as $e,
} from "../../internal/open-closed.js";
import { useResolveButtonType as Pe } from "../../hooks/use-resolve-button-type.js";
import { useOutsideClick as Ce } from "../../hooks/use-outside-click.js";
import { Hidden as De, Features as Ee } from "../../internal/hidden.js";
import { objectToFormEntries as ke } from "../../utils/form.js";
import { getOwnerDocument as we } from "../../utils/owner.js";
import { useEvent as p } from "../../hooks/use-event.js";
import { useControllable as Fe } from "../../hooks/use-controllable.js";
import { useLatestValue as Ae } from "../../hooks/use-latest-value.js";
import { useTrackedPointer as Me } from "../../hooks/use-tracked-pointer.js";
import { useTextValue as Qe } from "../../hooks/use-text-value.js";
var Ne = (e => ((e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e))(Ne || {}),
  Be = (e => ((e[(e.Single = 0)] = "Single"), (e[(e.Multi = 1)] = "Multi"), e))(Be || {}),
  He = (e => ((e[(e.Pointer = 0)] = "Pointer"), (e[(e.Other = 1)] = "Other"), e))(He || {}),
  Ue = (e => (
    (e[(e.OpenListbox = 0)] = "OpenListbox"),
    (e[(e.CloseListbox = 1)] = "CloseListbox"),
    (e[(e.GoToOption = 2)] = "GoToOption"),
    (e[(e.Search = 3)] = "Search"),
    (e[(e.ClearSearch = 4)] = "ClearSearch"),
    (e[(e.RegisterOption = 5)] = "RegisterOption"),
    (e[(e.UnregisterOption = 6)] = "UnregisterOption"),
    (e[(e.RegisterLabel = 7)] = "RegisterLabel"),
    e
  ))(Ue || {});
function X(e, i = a => a) {
  let a = e.activeOptionIndex !== null ? e.options[e.activeOptionIndex] : null,
    r = Ie(i(e.options.slice()), u => u.dataRef.current.domRef.current),
    l = a ? r.indexOf(a) : null;
  return l === -1 && (l = null), { options: r, activeOptionIndex: l };
}
let Ve = {
    [1](e) {
      return e.dataRef.current.disabled || e.listboxState === 1
        ? e
        : { ...e, activeOptionIndex: null, listboxState: 1 };
    },
    [0](e) {
      if (e.dataRef.current.disabled || e.listboxState === 0) return e;
      let i = e.activeOptionIndex,
        { isSelected: a } = e.dataRef.current,
        r = e.options.findIndex(l => a(l.dataRef.current.value));
      return r !== -1 && (i = r), { ...e, listboxState: 0, activeOptionIndex: i };
    },
    [2](e, i) {
      var a;
      if (e.dataRef.current.disabled || e.listboxState === 1) return e;
      let r = X(e),
        l = Se(i, {
          resolveItems: () => r.options,
          resolveActiveIndex: () => r.activeOptionIndex,
          resolveId: u => u.id,
          resolveDisabled: u => u.dataRef.current.disabled,
        });
      return {
        ...e,
        ...r,
        searchQuery: "",
        activeOptionIndex: l,
        activationTrigger: (a = i.trigger) != null ? a : 1,
      };
    },
    [3]: (e, i) => {
      if (e.dataRef.current.disabled || e.listboxState === 1) return e;
      let a = e.searchQuery !== "" ? 0 : 1,
        r = e.searchQuery + i.value.toLowerCase(),
        l = (
          e.activeOptionIndex !== null
            ? e.options
                .slice(e.activeOptionIndex + a)
                .concat(e.options.slice(0, e.activeOptionIndex + a))
            : e.options
        ).find(t => {
          var n;
          return (
            !t.dataRef.current.disabled &&
            ((n = t.dataRef.current.textValue) == null ? void 0 : n.startsWith(r))
          );
        }),
        u = l ? e.options.indexOf(l) : -1;
      return u === -1 || u === e.activeOptionIndex
        ? { ...e, searchQuery: r }
        : { ...e, searchQuery: r, activeOptionIndex: u, activationTrigger: 1 };
    },
    [4](e) {
      return e.dataRef.current.disabled || e.listboxState === 1 || e.searchQuery === ""
        ? e
        : { ...e, searchQuery: "" };
    },
    [5]: (e, i) => {
      let a = { id: i.id, dataRef: i.dataRef },
        r = X(e, l => [...l, a]);
      return (
        e.activeOptionIndex === null &&
          e.dataRef.current.isSelected(i.dataRef.current.value) &&
          (r.activeOptionIndex = r.options.indexOf(a)),
        { ...e, ...r }
      );
    },
    [6]: (e, i) => {
      let a = X(e, r => {
        let l = r.findIndex(u => u.id === i.id);
        return l !== -1 && r.splice(l, 1), r;
      });
      return { ...e, ...a, activationTrigger: 1 };
    },
    [7]: (e, i) => ({ ...e, labelId: i.id }),
  },
  W = Z(null);
W.displayName = "ListboxActionsContext";
function M(e) {
  let i = te(W);
  if (i === null) {
    let a = new Error(`<${e} /> is missing a parent <Listbox /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(a, M), a);
  }
  return i;
}
let J = Z(null);
J.displayName = "ListboxDataContext";
function Q(e) {
  let i = te(J);
  if (i === null) {
    let a = new Error(`<${e} /> is missing a parent <Listbox /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(a, Q), a);
  }
  return i;
}
function ze(e, i) {
  return E(i.type, Ve, e, i);
}
let Ge = Oe;
function Ke(e, i) {
  let {
    value: a,
    defaultValue: r,
    form: l,
    name: u,
    onChange: t,
    by: n = (s, d) => s === d,
    disabled: b = !1,
    horizontal: m = !1,
    multiple: g = !1,
    ...L
  } = e;
  const $ = m ? "horizontal" : "vertical";
  let I = w(i),
    [O = g ? [] : void 0, y] = Fe(a, t, r),
    [v, o] = xe(ze, {
      dataRef: me(),
      listboxState: 1,
      options: [],
      searchQuery: "",
      labelId: null,
      activeOptionIndex: null,
      activationTrigger: 1,
    }),
    c = D({ static: !1, hold: !1 }),
    P = D(null),
    N = D(null),
    j = D(null),
    R = p(
      typeof n == "string"
        ? (s, d) => {
            let S = n;
            return (s == null ? void 0 : s[S]) === (d == null ? void 0 : d[S]);
          }
        : n
    ),
    T = ge(s => E(f.mode, { [1]: () => O.some(d => R(d, s)), [0]: () => R(O, s) }), [O]),
    f = C(
      () => ({
        ...v,
        value: O,
        disabled: b,
        mode: g ? 1 : 0,
        orientation: $,
        compare: R,
        isSelected: T,
        optionsPropsRef: c,
        labelRef: P,
        buttonRef: N,
        optionsRef: j,
      }),
      [O, b, g, v]
    );
  z(() => {
    v.dataRef.current = f;
  }, [f]),
    Ce(
      [f.buttonRef, f.optionsRef],
      (s, d) => {
        var S;
        o({ type: 1 }),
          Le(d, ye.Loose) || (s.preventDefault(), (S = f.buttonRef.current) == null || S.focus());
      },
      f.listboxState === 0
    );
  let re = C(() => ({ open: f.listboxState === 0, disabled: b, value: O }), [f, b, O]),
    ne = p(s => {
      let d = f.options.find(S => S.id === s);
      d && k(d.dataRef.current.value);
    }),
    ie = p(() => {
      if (f.activeOptionIndex !== null) {
        let { dataRef: s, id: d } = f.options[f.activeOptionIndex];
        k(s.current.value), o({ type: 2, focus: h.Specific, id: d });
      }
    }),
    ae = p(() => o({ type: 0 })),
    le = p(() => o({ type: 1 })),
    se = p((s, d, S) =>
      s === h.Specific
        ? o({ type: 2, focus: h.Specific, id: d, trigger: S })
        : o({ type: 2, focus: s, trigger: S })
    ),
    ue = p((s, d) => (o({ type: 5, id: s, dataRef: d }), () => o({ type: 6, id: s }))),
    de = p(s => (o({ type: 7, id: s }), () => o({ type: 7, id: null }))),
    k = p(s =>
      E(f.mode, {
        [0]() {
          return y == null ? void 0 : y(s);
        },
        [1]() {
          let d = f.value.slice(),
            S = d.findIndex(H => R(H, s));
          return S === -1 ? d.push(s) : d.splice(S, 1), y == null ? void 0 : y(d);
        },
      })
    ),
    pe = p(s => o({ type: 3, value: s })),
    ce = p(() => o({ type: 4 })),
    fe = C(
      () => ({
        onChange: k,
        registerOption: ue,
        registerLabel: de,
        goToOption: se,
        closeListbox: le,
        openListbox: ae,
        selectActiveOption: ie,
        selectOption: ne,
        search: pe,
        clearSearch: ce,
      }),
      []
    ),
    be = { ref: I },
    B = D(null),
    ve = V();
  return (
    ee(() => {
      B.current &&
        r !== void 0 &&
        ve.addEventListener(B.current, "reset", () => {
          k(r);
        });
    }, [B, k]),
    U.createElement(
      W.Provider,
      { value: fe },
      U.createElement(
        J.Provider,
        { value: f },
        U.createElement(
          Te,
          { value: E(f.listboxState, { [0]: G.Open, [1]: G.Closed }) },
          u != null &&
            O != null &&
            ke({ [u]: O }).map(([s, d], S) =>
              U.createElement(De, {
                features: Ee.Hidden,
                ref:
                  S === 0
                    ? H => {
                        var Y;
                        B.current = (Y = H == null ? void 0 : H.closest("form")) != null ? Y : null;
                      }
                    : void 0,
                ...Re({
                  key: s,
                  as: "input",
                  type: "hidden",
                  hidden: !0,
                  readOnly: !0,
                  form: l,
                  name: s,
                  value: d,
                }),
              })
            ),
          A({ ourProps: be, theirProps: L, slot: re, defaultTag: Ge, name: "Listbox" })
        )
      )
    )
  );
}
let je = "button";
function Xe(e, i) {
  var a;
  let r = K(),
    { id: l = `headlessui-listbox-button-${r}`, ...u } = e,
    t = Q("Listbox.Button"),
    n = M("Listbox.Button"),
    b = w(t.buttonRef, i),
    m = V(),
    g = p(v => {
      switch (v.key) {
        case x.Space:
        case x.Enter:
        case x.ArrowDown:
          v.preventDefault(),
            n.openListbox(),
            m.nextFrame(() => {
              t.value || n.goToOption(h.First);
            });
          break;
        case x.ArrowUp:
          v.preventDefault(),
            n.openListbox(),
            m.nextFrame(() => {
              t.value || n.goToOption(h.Last);
            });
          break;
      }
    }),
    L = p(v => {
      switch (v.key) {
        case x.Space:
          v.preventDefault();
          break;
      }
    }),
    $ = p(v => {
      if (he(v.currentTarget)) return v.preventDefault();
      t.listboxState === 0
        ? (n.closeListbox(),
          m.nextFrame(() => {
            var o;
            return (o = t.buttonRef.current) == null ? void 0 : o.focus({ preventScroll: !0 });
          }))
        : (v.preventDefault(), n.openListbox());
    }),
    I = oe(() => {
      if (t.labelId) return [t.labelId, l].join(" ");
    }, [t.labelId, l]),
    O = C(() => ({ open: t.listboxState === 0, disabled: t.disabled, value: t.value }), [t]),
    y = {
      "ref": b,
      "id": l,
      "type": Pe(e, t.buttonRef),
      "aria-haspopup": "listbox",
      "aria-controls": (a = t.optionsRef.current) == null ? void 0 : a.id,
      "aria-expanded": t.disabled ? void 0 : t.listboxState === 0,
      "aria-labelledby": I,
      "disabled": t.disabled,
      "onKeyDown": g,
      "onKeyUp": L,
      "onClick": $,
    };
  return A({ ourProps: y, theirProps: u, slot: O, defaultTag: je, name: "Listbox.Button" });
}
let qe = "label";
function We(e, i) {
  let a = K(),
    { id: r = `headlessui-listbox-label-${a}`, ...l } = e,
    u = Q("Listbox.Label"),
    t = M("Listbox.Label"),
    n = w(u.labelRef, i);
  z(() => t.registerLabel(r), [r]);
  let b = p(() => {
      var g;
      return (g = u.buttonRef.current) == null ? void 0 : g.focus({ preventScroll: !0 });
    }),
    m = C(() => ({ open: u.listboxState === 0, disabled: u.disabled }), [u]);
  return A({
    ourProps: { ref: n, id: r, onClick: b },
    theirProps: l,
    slot: m,
    defaultTag: qe,
    name: "Listbox.Label",
  });
}
let Je = "ul",
  Ye = _.RenderStrategy | _.Static;
function _e(e, i) {
  var a;
  let r = K(),
    { id: l = `headlessui-listbox-options-${r}`, ...u } = e,
    t = Q("Listbox.Options"),
    n = M("Listbox.Options"),
    b = w(t.optionsRef, i),
    m = V(),
    g = V(),
    L = $e(),
    $ = (() => (L !== null ? (L & G.Open) === G.Open : t.listboxState === 0))();
  ee(() => {
    var o;
    let c = t.optionsRef.current;
    c &&
      t.listboxState === 0 &&
      c !== ((o = we(c)) == null ? void 0 : o.activeElement) &&
      c.focus({ preventScroll: !0 });
  }, [t.listboxState, t.optionsRef]);
  let I = p(o => {
      switch ((g.dispose(), o.key)) {
        case x.Space:
          if (t.searchQuery !== "") return o.preventDefault(), o.stopPropagation(), n.search(o.key);
        case x.Enter:
          if ((o.preventDefault(), o.stopPropagation(), t.activeOptionIndex !== null)) {
            let { dataRef: c } = t.options[t.activeOptionIndex];
            n.onChange(c.current.value);
          }
          t.mode === 0 &&
            (n.closeListbox(),
            q().nextFrame(() => {
              var c;
              return (c = t.buttonRef.current) == null ? void 0 : c.focus({ preventScroll: !0 });
            }));
          break;
        case E(t.orientation, { vertical: x.ArrowDown, horizontal: x.ArrowRight }):
          return o.preventDefault(), o.stopPropagation(), n.goToOption(h.Next);
        case E(t.orientation, { vertical: x.ArrowUp, horizontal: x.ArrowLeft }):
          return o.preventDefault(), o.stopPropagation(), n.goToOption(h.Previous);
        case x.Home:
        case x.PageUp:
          return o.preventDefault(), o.stopPropagation(), n.goToOption(h.First);
        case x.End:
        case x.PageDown:
          return o.preventDefault(), o.stopPropagation(), n.goToOption(h.Last);
        case x.Escape:
          return (
            o.preventDefault(),
            o.stopPropagation(),
            n.closeListbox(),
            m.nextFrame(() => {
              var c;
              return (c = t.buttonRef.current) == null ? void 0 : c.focus({ preventScroll: !0 });
            })
          );
        case x.Tab:
          o.preventDefault(), o.stopPropagation();
          break;
        default:
          o.key.length === 1 && (n.search(o.key), g.setTimeout(() => n.clearSearch(), 350));
          break;
      }
    }),
    O = oe(() => {
      var o, c, P;
      return (P = (o = t.labelRef.current) == null ? void 0 : o.id) != null
        ? P
        : (c = t.buttonRef.current) == null
        ? void 0
        : c.id;
    }, [t.labelRef.current, t.buttonRef.current]),
    y = C(() => ({ open: t.listboxState === 0 }), [t]),
    v = {
      "aria-activedescendant":
        t.activeOptionIndex === null || (a = t.options[t.activeOptionIndex]) == null
          ? void 0
          : a.id,
      "aria-multiselectable": t.mode === 1 ? !0 : void 0,
      "aria-labelledby": O,
      "aria-orientation": t.orientation,
      "id": l,
      "onKeyDown": I,
      "role": "listbox",
      "tabIndex": 0,
      "ref": b,
    };
  return A({
    ourProps: v,
    theirProps: u,
    slot: y,
    defaultTag: Je,
    features: Ye,
    visible: $,
    name: "Listbox.Options",
  });
}
let Ze = "li";
function et(e, i) {
  let a = K(),
    { id: r = `headlessui-listbox-option-${a}`, disabled: l = !1, value: u, ...t } = e,
    n = Q("Listbox.Option"),
    b = M("Listbox.Option"),
    m = n.activeOptionIndex !== null ? n.options[n.activeOptionIndex].id === r : !1,
    g = n.isSelected(u),
    L = D(null),
    $ = Qe(L),
    I = Ae({
      disabled: l,
      value: u,
      domRef: L,
      get textValue() {
        return $();
      },
    }),
    O = w(i, L);
  z(() => {
    if (n.listboxState !== 0 || !m || n.activationTrigger === 0) return;
    let R = q();
    return (
      R.requestAnimationFrame(() => {
        var T, f;
        (f = (T = L.current) == null ? void 0 : T.scrollIntoView) == null ||
          f.call(T, { block: "nearest" });
      }),
      R.dispose
    );
  }, [L, m, n.listboxState, n.activationTrigger, n.activeOptionIndex]),
    z(() => b.registerOption(r, I), [I, r]);
  let y = p(R => {
      if (l) return R.preventDefault();
      b.onChange(u),
        n.mode === 0 &&
          (b.closeListbox(),
          q().nextFrame(() => {
            var T;
            return (T = n.buttonRef.current) == null ? void 0 : T.focus({ preventScroll: !0 });
          }));
    }),
    v = p(() => {
      if (l) return b.goToOption(h.Nothing);
      b.goToOption(h.Specific, r);
    }),
    o = Me(),
    c = p(R => o.update(R)),
    P = p(R => {
      o.wasMoved(R) && (l || m || b.goToOption(h.Specific, r, 0));
    }),
    N = p(R => {
      o.wasMoved(R) && (l || (m && b.goToOption(h.Nothing)));
    }),
    j = C(() => ({ active: m, selected: g, disabled: l }), [m, g, l]);
  return A({
    ourProps: {
      "id": r,
      "ref": O,
      "role": "option",
      "tabIndex": l === !0 ? void 0 : -1,
      "aria-disabled": l === !0 ? !0 : void 0,
      "aria-selected": g,
      "disabled": void 0,
      "onClick": y,
      "onFocus": v,
      "onPointerEnter": c,
      "onMouseEnter": c,
      "onPointerMove": P,
      "onMouseMove": P,
      "onPointerLeave": N,
      "onMouseLeave": N,
    },
    theirProps: t,
    slot: j,
    defaultTag: Ze,
    name: "Listbox.Option",
  });
}
let tt = F(Ke),
  ot = F(Xe),
  rt = F(We),
  nt = F(_e),
  it = F(et),
  Dt = Object.assign(tt, { Button: ot, Label: rt, Options: nt, Option: it });
export { Dt as Listbox };
