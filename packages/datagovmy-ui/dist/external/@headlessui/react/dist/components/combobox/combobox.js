import ee, {
  createContext as be,
  useReducer as xe,
  createRef as ge,
  useRef as P,
  useCallback as Oe,
  useMemo as w,
  useEffect as se,
  useContext as fe,
  Fragment as Re,
} from "react";
import { useComputed as re } from "../../hooks/use-computed.js";
import { useDisposables as ae } from "../../hooks/use-disposables.js";
import { useEvent as x } from "../../hooks/use-event.js";
import { useId as W } from "../../hooks/use-id.js";
import { useIsoMorphicEffect as M } from "../../hooks/use-iso-morphic-effect.js";
import { useLatestValue as Ce } from "../../hooks/use-latest-value.js";
import { useOutsideClick as Ie } from "../../hooks/use-outside-click.js";
import { useResolveButtonType as Se } from "../../hooks/use-resolve-button-type.js";
import { useSyncRefs as X } from "../../hooks/use-sync-refs.js";
import { useTreeWalker as Te } from "../../hooks/use-tree-walker.js";
import { Focus as C, calculateActiveIndex as Pe } from "../../utils/calculate-active-index.js";
import { disposables as ce } from "../../utils/disposables.js";
import {
  Features as de,
  forwardRefWithAs as V,
  compact as he,
  render as j,
} from "../../utils/render.js";
import { isDisabledReactIssue7711 as ye } from "../../utils/bugs.js";
import { match as N } from "../../utils/match.js";
import { objectToFormEntries as Ee } from "../../utils/form.js";
import { sortByDomNode as De } from "../../utils/focus-management.js";
import { Hidden as Fe, Features as ke } from "../../internal/hidden.js";
import {
  OpenClosedProvider as we,
  State as oe,
  useOpenClosed as Ae,
} from "../../internal/open-closed.js";
import { Keys as T } from "../keyboard.js";
import { useControllable as Le } from "../../hooks/use-controllable.js";
import { useWatch as pe } from "../../hooks/use-watch.js";
import { useTrackedPointer as Me } from "../../hooks/use-tracked-pointer.js";
import { isMobile as $e } from "../../utils/platform.js";
var _e = (e => ((e[(e.Open = 0)] = "Open"), (e[(e.Closed = 1)] = "Closed"), e))(_e || {}),
  Be = (e => ((e[(e.Single = 0)] = "Single"), (e[(e.Multi = 1)] = "Multi"), e))(Be || {}),
  Ne = (e => ((e[(e.Pointer = 0)] = "Pointer"), (e[(e.Other = 1)] = "Other"), e))(Ne || {}),
  Ve = (e => (
    (e[(e.OpenCombobox = 0)] = "OpenCombobox"),
    (e[(e.CloseCombobox = 1)] = "CloseCombobox"),
    (e[(e.GoToOption = 2)] = "GoToOption"),
    (e[(e.RegisterOption = 3)] = "RegisterOption"),
    (e[(e.UnregisterOption = 4)] = "UnregisterOption"),
    (e[(e.RegisterLabel = 5)] = "RegisterLabel"),
    e
  ))(Ve || {});
function ne(e, i = l => l) {
  let l = e.activeOptionIndex !== null ? e.options[e.activeOptionIndex] : null,
    o = De(i(e.options.slice()), u => u.dataRef.current.domRef.current),
    c = l ? o.indexOf(l) : null;
  return c === -1 && (c = null), { options: o, activeOptionIndex: c };
}
let je = {
    [1](e) {
      var i;
      return ((i = e.dataRef.current) != null && i.disabled) || e.comboboxState === 1
        ? e
        : { ...e, activeOptionIndex: null, comboboxState: 1 };
    },
    [0](e) {
      var i;
      if (((i = e.dataRef.current) != null && i.disabled) || e.comboboxState === 0) return e;
      let l = e.activeOptionIndex;
      if (e.dataRef.current) {
        let { isSelected: o } = e.dataRef.current,
          c = e.options.findIndex(u => o(u.dataRef.current.value));
        c !== -1 && (l = c);
      }
      return { ...e, comboboxState: 0, activeOptionIndex: l };
    },
    [2](e, i) {
      var l, o, c, u;
      if (
        ((l = e.dataRef.current) != null && l.disabled) ||
        ((o = e.dataRef.current) != null &&
          o.optionsRef.current &&
          !((c = e.dataRef.current) != null && c.optionsPropsRef.current.static) &&
          e.comboboxState === 1)
      )
        return e;
      let r = ne(e);
      if (r.activeOptionIndex === null) {
        let m = r.options.findIndex(s => !s.dataRef.current.disabled);
        m !== -1 && (r.activeOptionIndex = m);
      }
      let g = Pe(i, {
        resolveItems: () => r.options,
        resolveActiveIndex: () => r.activeOptionIndex,
        resolveId: m => m.id,
        resolveDisabled: m => m.dataRef.current.disabled,
      });
      return {
        ...e,
        ...r,
        activeOptionIndex: g,
        activationTrigger: (u = i.trigger) != null ? u : 1,
      };
    },
    [3]: (e, i) => {
      var l, o;
      let c = { id: i.id, dataRef: i.dataRef },
        u = ne(e, g => [...g, c]);
      e.activeOptionIndex === null &&
        (l = e.dataRef.current) != null &&
        l.isSelected(i.dataRef.current.value) &&
        (u.activeOptionIndex = u.options.indexOf(c));
      let r = { ...e, ...u, activationTrigger: 1 };
      return (
        (o = e.dataRef.current) != null &&
          o.__demoMode &&
          e.dataRef.current.value === void 0 &&
          (r.activeOptionIndex = 0),
        r
      );
    },
    [4]: (e, i) => {
      let l = ne(e, o => {
        let c = o.findIndex(u => u.id === i.id);
        return c !== -1 && o.splice(c, 1), o;
      });
      return { ...e, ...l, activationTrigger: 1 };
    },
    [5]: (e, i) => ({ ...e, labelId: i.id }),
  },
  ie = be(null);
ie.displayName = "ComboboxActionsContext";
function G(e) {
  let i = fe(ie);
  if (i === null) {
    let l = new Error(`<${e} /> is missing a parent <Combobox /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(l, G), l);
  }
  return i;
}
let le = be(null);
le.displayName = "ComboboxDataContext";
function q(e) {
  let i = fe(le);
  if (i === null) {
    let l = new Error(`<${e} /> is missing a parent <Combobox /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(l, q), l);
  }
  return i;
}
function qe(e, i) {
  return N(i.type, je, e, i);
}
let Ke = Re;
function Ue(e, i) {
  let {
      value: l,
      defaultValue: o,
      onChange: c,
      form: u,
      name: r,
      by: g = (b, v) => b === v,
      disabled: m = !1,
      __demoMode: s = !1,
      nullable: O = !1,
      multiple: R = !1,
      ...t
    } = e,
    [n = R ? [] : void 0, S] = Le(l, c, o),
    [d, f] = xe(qe, {
      dataRef: ge(),
      comboboxState: s ? 0 : 1,
      options: [],
      activeOptionIndex: null,
      activationTrigger: 1,
      labelId: null,
    }),
    E = P(!1),
    F = P({ static: !1, hold: !1 }),
    k = P(null),
    A = P(null),
    $ = P(null),
    _ = P(null),
    D = x(
      typeof g == "string"
        ? (b, v) => {
            let I = g;
            return (b == null ? void 0 : b[I]) === (v == null ? void 0 : v[I]);
          }
        : g
    ),
    K = Oe(b => N(a.mode, { [1]: () => n.some(v => D(v, b)), [0]: () => D(n, b) }), [n]),
    a = w(
      () => ({
        ...d,
        optionsPropsRef: F,
        labelRef: k,
        inputRef: A,
        buttonRef: $,
        optionsRef: _,
        value: n,
        defaultValue: o,
        disabled: m,
        mode: R ? 1 : 0,
        get activeOptionIndex() {
          if (E.current && d.activeOptionIndex === null && d.options.length > 0) {
            let b = d.options.findIndex(v => !v.dataRef.current.disabled);
            if (b !== -1) return b;
          }
          return d.activeOptionIndex;
        },
        compare: D,
        isSelected: K,
        nullable: O,
        __demoMode: s,
      }),
      [n, o, m, R, O, s, d]
    ),
    h = P(a.activeOptionIndex !== null ? a.options[a.activeOptionIndex] : null);
  se(() => {
    let b = a.activeOptionIndex !== null ? a.options[a.activeOptionIndex] : null;
    h.current !== b && (h.current = b);
  }),
    M(() => {
      d.dataRef.current = a;
    }, [a]),
    Ie([a.buttonRef, a.inputRef, a.optionsRef], () => te.closeCombobox(), a.comboboxState === 0);
  let B = w(
      () => ({
        open: a.comboboxState === 0,
        disabled: m,
        activeIndex: a.activeOptionIndex,
        activeOption:
          a.activeOptionIndex === null
            ? null
            : a.options[a.activeOptionIndex].dataRef.current.value,
        value: n,
      }),
      [a, m, n]
    ),
    p = x(b => {
      let v = a.options.find(I => I.id === b);
      v && H(v.dataRef.current.value);
    }),
    L = x(() => {
      if (a.activeOptionIndex !== null) {
        let { dataRef: b, id: v } = a.options[a.activeOptionIndex];
        H(b.current.value), te.goToOption(C.Specific, v);
      }
    }),
    y = x(() => {
      f({ type: 0 }), (E.current = !0);
    }),
    U = x(() => {
      f({ type: 1 }), (E.current = !1);
    }),
    J = x(
      (b, v, I) => (
        (E.current = !1),
        b === C.Specific
          ? f({ type: 2, focus: C.Specific, id: v, trigger: I })
          : f({ type: 2, focus: b, trigger: I })
      )
    ),
    Q = x(
      (b, v) => (
        f({ type: 3, id: b, dataRef: v }),
        () => {
          var I;
          ((I = h.current) == null ? void 0 : I.id) === b && (E.current = !0),
            f({ type: 4, id: b });
        }
      )
    ),
    Y = x(b => (f({ type: 5, id: b }), () => f({ type: 5, id: null }))),
    H = x(b =>
      N(a.mode, {
        [0]() {
          return S == null ? void 0 : S(b);
        },
        [1]() {
          let v = a.value.slice(),
            I = v.findIndex(z => D(z, b));
          return I === -1 ? v.push(b) : v.splice(I, 1), S == null ? void 0 : S(v);
        },
      })
    ),
    te = w(
      () => ({
        onChange: H,
        registerOption: Q,
        registerLabel: Y,
        goToOption: J,
        closeCombobox: U,
        openCombobox: y,
        selectActiveOption: L,
        selectOption: p,
      }),
      []
    ),
    me = i === null ? {} : { ref: i },
    Z = P(null),
    ve = ae();
  return (
    se(() => {
      Z.current &&
        o !== void 0 &&
        ve.addEventListener(Z.current, "reset", () => {
          H(o);
        });
    }, [Z, H]),
    ee.createElement(
      ie.Provider,
      { value: te },
      ee.createElement(
        le.Provider,
        { value: a },
        ee.createElement(
          we,
          { value: N(a.comboboxState, { [0]: oe.Open, [1]: oe.Closed }) },
          r != null &&
            n != null &&
            Ee({ [r]: n }).map(([b, v], I) =>
              ee.createElement(Fe, {
                features: ke.Hidden,
                ref:
                  I === 0
                    ? z => {
                        var ue;
                        Z.current =
                          (ue = z == null ? void 0 : z.closest("form")) != null ? ue : null;
                      }
                    : void 0,
                ...he({
                  key: b,
                  as: "input",
                  type: "hidden",
                  hidden: !0,
                  readOnly: !0,
                  form: u,
                  name: b,
                  value: v,
                }),
              })
            ),
          j({ ourProps: me, theirProps: t, slot: B, defaultTag: Ke, name: "Combobox" })
        )
      )
    )
  );
}
let He = "input";
function We(e, i) {
  var l, o, c, u;
  let r = W(),
    {
      id: g = `headlessui-combobox-input-${r}`,
      onChange: m,
      displayValue: s,
      type: O = "text",
      ...R
    } = e,
    t = q("Combobox.Input"),
    n = G("Combobox.Input"),
    S = X(t.inputRef, i),
    d = P(!1),
    f = ae(),
    E = (function () {
      var p;
      return typeof s == "function" && t.value !== void 0
        ? (p = s(t.value)) != null
          ? p
          : ""
        : typeof t.value == "string"
        ? t.value
        : "";
    })();
  pe(
    ([p, L], [y, U]) => {
      d.current ||
        (t.inputRef.current && ((U === 0 && L === 1) || p !== y) && (t.inputRef.current.value = p));
    },
    [E, t.comboboxState]
  ),
    pe(
      ([p], [L]) => {
        if (p === 0 && L === 1) {
          let y = t.inputRef.current;
          if (!y) return;
          let U = y.value,
            { selectionStart: J, selectionEnd: Q, selectionDirection: Y } = y;
          (y.value = ""),
            (y.value = U),
            Y !== null ? y.setSelectionRange(J, Q, Y) : y.setSelectionRange(J, Q);
        }
      },
      [t.comboboxState]
    );
  let F = P(!1),
    k = P(null),
    A = x(() => {
      F.current = !0;
    }),
    $ = x(() => {
      f.nextFrame(() => {
        (F.current = !1),
          k.current && (n.openCombobox(), m == null || m(k.current), (k.current = null));
      });
    }),
    _ = x(p => {
      switch (((d.current = !0), p.key)) {
        case T.Backspace:
        case T.Delete:
          if (t.mode !== 0 || !t.nullable) return;
          let L = p.currentTarget;
          f.requestAnimationFrame(() => {
            L.value === "" &&
              (n.onChange(null),
              t.optionsRef.current && (t.optionsRef.current.scrollTop = 0),
              n.goToOption(C.Nothing));
          });
          break;
        case T.Enter:
          if (((d.current = !1), t.comboboxState !== 0 || F.current)) return;
          if ((p.preventDefault(), p.stopPropagation(), t.activeOptionIndex === null)) {
            n.closeCombobox();
            return;
          }
          n.selectActiveOption(), t.mode === 0 && n.closeCombobox();
          break;
        case T.ArrowDown:
          return (
            (d.current = !1),
            p.preventDefault(),
            p.stopPropagation(),
            N(t.comboboxState, {
              [0]: () => {
                n.goToOption(C.Next);
              },
              [1]: () => {
                n.openCombobox();
              },
            })
          );
        case T.ArrowUp:
          return (
            (d.current = !1),
            p.preventDefault(),
            p.stopPropagation(),
            N(t.comboboxState, {
              [0]: () => {
                n.goToOption(C.Previous);
              },
              [1]: () => {
                n.openCombobox(),
                  f.nextFrame(() => {
                    t.value || n.goToOption(C.Last);
                  });
              },
            })
          );
        case T.Home:
          if (p.shiftKey) break;
          return (d.current = !1), p.preventDefault(), p.stopPropagation(), n.goToOption(C.First);
        case T.PageUp:
          return (d.current = !1), p.preventDefault(), p.stopPropagation(), n.goToOption(C.First);
        case T.End:
          if (p.shiftKey) break;
          return (d.current = !1), p.preventDefault(), p.stopPropagation(), n.goToOption(C.Last);
        case T.PageDown:
          return (d.current = !1), p.preventDefault(), p.stopPropagation(), n.goToOption(C.Last);
        case T.Escape:
          return (
            (d.current = !1),
            t.comboboxState !== 0
              ? void 0
              : (p.preventDefault(),
                t.optionsRef.current && !t.optionsPropsRef.current.static && p.stopPropagation(),
                n.closeCombobox())
          );
        case T.Tab:
          if (((d.current = !1), t.comboboxState !== 0)) return;
          t.mode === 0 && n.selectActiveOption(), n.closeCombobox();
          break;
      }
    }),
    D = x(p => {
      if (F.current) {
        k.current = p;
        return;
      }
      n.openCombobox(), m == null || m(p);
    }),
    K = x(() => {
      d.current = !1;
    }),
    a = re(() => {
      if (t.labelId) return [t.labelId].join(" ");
    }, [t.labelId]),
    h = w(() => ({ open: t.comboboxState === 0, disabled: t.disabled }), [t]),
    B = {
      "ref": S,
      "id": g,
      "role": "combobox",
      "type": O,
      "aria-controls": (l = t.optionsRef.current) == null ? void 0 : l.id,
      "aria-expanded": t.disabled ? void 0 : t.comboboxState === 0,
      "aria-activedescendant":
        t.activeOptionIndex === null || (o = t.options[t.activeOptionIndex]) == null
          ? void 0
          : o.id,
      "aria-labelledby": a,
      "aria-autocomplete": "list",
      "defaultValue":
        (u =
          (c = e.defaultValue) != null
            ? c
            : t.defaultValue !== void 0
            ? s == null
              ? void 0
              : s(t.defaultValue)
            : null) != null
          ? u
          : t.defaultValue,
      "disabled": t.disabled,
      "onCompositionStart": A,
      "onCompositionEnd": $,
      "onKeyDown": _,
      "onChange": D,
      "onBlur": K,
    };
  return j({ ourProps: B, theirProps: R, slot: h, defaultTag: He, name: "Combobox.Input" });
}
let Xe = "button";
function Ge(e, i) {
  var l;
  let o = q("Combobox.Button"),
    c = G("Combobox.Button"),
    u = X(o.buttonRef, i),
    r = W(),
    { id: g = `headlessui-combobox-button-${r}`, ...m } = e,
    s = ae(),
    O = x(d => {
      switch (d.key) {
        case T.ArrowDown:
          return (
            d.preventDefault(),
            d.stopPropagation(),
            o.comboboxState === 1 && c.openCombobox(),
            s.nextFrame(() => {
              var f;
              return (f = o.inputRef.current) == null ? void 0 : f.focus({ preventScroll: !0 });
            })
          );
        case T.ArrowUp:
          return (
            d.preventDefault(),
            d.stopPropagation(),
            o.comboboxState === 1 &&
              (c.openCombobox(),
              s.nextFrame(() => {
                o.value || c.goToOption(C.Last);
              })),
            s.nextFrame(() => {
              var f;
              return (f = o.inputRef.current) == null ? void 0 : f.focus({ preventScroll: !0 });
            })
          );
        case T.Escape:
          return o.comboboxState !== 0
            ? void 0
            : (d.preventDefault(),
              o.optionsRef.current && !o.optionsPropsRef.current.static && d.stopPropagation(),
              c.closeCombobox(),
              s.nextFrame(() => {
                var f;
                return (f = o.inputRef.current) == null ? void 0 : f.focus({ preventScroll: !0 });
              }));
        default:
          return;
      }
    }),
    R = x(d => {
      if (ye(d.currentTarget)) return d.preventDefault();
      o.comboboxState === 0 ? c.closeCombobox() : (d.preventDefault(), c.openCombobox()),
        s.nextFrame(() => {
          var f;
          return (f = o.inputRef.current) == null ? void 0 : f.focus({ preventScroll: !0 });
        });
    }),
    t = re(() => {
      if (o.labelId) return [o.labelId, g].join(" ");
    }, [o.labelId, g]),
    n = w(() => ({ open: o.comboboxState === 0, disabled: o.disabled, value: o.value }), [o]),
    S = {
      "ref": u,
      "id": g,
      "type": Se(e, o.buttonRef),
      "tabIndex": -1,
      "aria-haspopup": "listbox",
      "aria-controls": (l = o.optionsRef.current) == null ? void 0 : l.id,
      "aria-expanded": o.disabled ? void 0 : o.comboboxState === 0,
      "aria-labelledby": t,
      "disabled": o.disabled,
      "onClick": R,
      "onKeyDown": O,
    };
  return j({ ourProps: S, theirProps: m, slot: n, defaultTag: Xe, name: "Combobox.Button" });
}
let Je = "label";
function Qe(e, i) {
  let l = W(),
    { id: o = `headlessui-combobox-label-${l}`, ...c } = e,
    u = q("Combobox.Label"),
    r = G("Combobox.Label"),
    g = X(u.labelRef, i);
  M(() => r.registerLabel(o), [o]);
  let m = x(() => {
      var O;
      return (O = u.inputRef.current) == null ? void 0 : O.focus({ preventScroll: !0 });
    }),
    s = w(() => ({ open: u.comboboxState === 0, disabled: u.disabled }), [u]);
  return j({
    ourProps: { ref: g, id: o, onClick: m },
    theirProps: c,
    slot: s,
    defaultTag: Je,
    name: "Combobox.Label",
  });
}
let Ye = "ul",
  Ze = de.RenderStrategy | de.Static;
function ze(e, i) {
  let l = W(),
    { id: o = `headlessui-combobox-options-${l}`, hold: c = !1, ...u } = e,
    r = q("Combobox.Options"),
    g = X(r.optionsRef, i),
    m = Ae(),
    s = (() => (m !== null ? (m & oe.Open) === oe.Open : r.comboboxState === 0))();
  M(() => {
    var n;
    r.optionsPropsRef.current.static = (n = e.static) != null ? n : !1;
  }, [r.optionsPropsRef, e.static]),
    M(() => {
      r.optionsPropsRef.current.hold = c;
    }, [r.optionsPropsRef, c]),
    Te({
      container: r.optionsRef.current,
      enabled: r.comboboxState === 0,
      accept(n) {
        return n.getAttribute("role") === "option"
          ? NodeFilter.FILTER_REJECT
          : n.hasAttribute("role")
          ? NodeFilter.FILTER_SKIP
          : NodeFilter.FILTER_ACCEPT;
      },
      walk(n) {
        n.setAttribute("role", "none");
      },
    });
  let O = re(() => {
      var n, S;
      return (S = r.labelId) != null ? S : (n = r.buttonRef.current) == null ? void 0 : n.id;
    }, [r.labelId, r.buttonRef.current]),
    R = w(() => ({ open: r.comboboxState === 0 }), [r]),
    t = {
      "aria-labelledby": O,
      "role": "listbox",
      "aria-multiselectable": r.mode === 1 ? !0 : void 0,
      "id": o,
      "ref": g,
    };
  return j({
    ourProps: t,
    theirProps: u,
    slot: R,
    defaultTag: Ye,
    features: Ze,
    visible: s,
    name: "Combobox.Options",
  });
}
let eo = "li";
function oo(e, i) {
  var l, o;
  let c = W(),
    { id: u = `headlessui-combobox-option-${c}`, disabled: r = !1, value: g, ...m } = e,
    s = q("Combobox.Option"),
    O = G("Combobox.Option"),
    R = s.activeOptionIndex !== null ? s.options[s.activeOptionIndex].id === u : !1,
    t = s.isSelected(g),
    n = P(null),
    S = Ce({
      disabled: r,
      value: g,
      domRef: n,
      textValue:
        (o = (l = n.current) == null ? void 0 : l.textContent) == null ? void 0 : o.toLowerCase(),
    }),
    d = X(i, n),
    f = x(() => O.selectOption(u));
  M(() => O.registerOption(u, S), [S, u]);
  let E = P(!s.__demoMode);
  M(() => {
    if (!s.__demoMode) return;
    let a = ce();
    return (
      a.requestAnimationFrame(() => {
        E.current = !0;
      }),
      a.dispose
    );
  }, []),
    M(() => {
      if (s.comboboxState !== 0 || !R || !E.current || s.activationTrigger === 0) return;
      let a = ce();
      return (
        a.requestAnimationFrame(() => {
          var h, B;
          (B = (h = n.current) == null ? void 0 : h.scrollIntoView) == null ||
            B.call(h, { block: "nearest" });
        }),
        a.dispose
      );
    }, [n, R, s.comboboxState, s.activationTrigger, s.activeOptionIndex]);
  let F = x(a => {
      if (r) return a.preventDefault();
      f(),
        s.mode === 0 && O.closeCombobox(),
        $e() ||
          requestAnimationFrame(() => {
            var h;
            return (h = s.inputRef.current) == null ? void 0 : h.focus();
          });
    }),
    k = x(() => {
      if (r) return O.goToOption(C.Nothing);
      O.goToOption(C.Specific, u);
    }),
    A = Me(),
    $ = x(a => A.update(a)),
    _ = x(a => {
      A.wasMoved(a) && (r || R || O.goToOption(C.Specific, u, 0));
    }),
    D = x(a => {
      A.wasMoved(a) && (r || (R && (s.optionsPropsRef.current.hold || O.goToOption(C.Nothing))));
    }),
    K = w(() => ({ active: R, selected: t, disabled: r }), [R, t, r]);
  return j({
    ourProps: {
      "id": u,
      "ref": d,
      "role": "option",
      "tabIndex": r === !0 ? void 0 : -1,
      "aria-disabled": r === !0 ? !0 : void 0,
      "aria-selected": t,
      "disabled": void 0,
      "onClick": F,
      "onFocus": k,
      "onPointerEnter": $,
      "onMouseEnter": $,
      "onPointerMove": _,
      "onMouseMove": _,
      "onPointerLeave": D,
      "onMouseLeave": D,
    },
    theirProps: m,
    slot: K,
    defaultTag: eo,
    name: "Combobox.Option",
  });
}
let to = V(Ue),
  no = V(Ge),
  ro = V(We),
  ao = V(Qe),
  io = V(ze),
  lo = V(oo),
  Lo = Object.assign(to, { Input: ro, Button: no, Label: ao, Options: io, Option: lo });
export { Lo as Combobox };
