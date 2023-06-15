import { disposables as b } from "./disposables.js";
import { match as N } from "./match.js";
import { getOwnerDocument as m } from "./owner.js";
let d = [
  "[contentEditable=true]",
  "[tabindex]",
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "iframe",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
]
  .map(e => `${e}:not([tabindex='-1'])`)
  .join(",");
var h = (e => (
    (e[(e.First = 1)] = "First"),
    (e[(e.Previous = 2)] = "Previous"),
    (e[(e.Next = 4)] = "Next"),
    (e[(e.Last = 8)] = "Last"),
    (e[(e.WrapAround = 16)] = "WrapAround"),
    (e[(e.NoScroll = 32)] = "NoScroll"),
    e
  ))(h || {}),
  x = (e => (
    (e[(e.Error = 0)] = "Error"),
    (e[(e.Overflow = 1)] = "Overflow"),
    (e[(e.Success = 2)] = "Success"),
    (e[(e.Underflow = 3)] = "Underflow"),
    e
  ))(x || {}),
  y = (e => ((e[(e.Previous = -1)] = "Previous"), (e[(e.Next = 1)] = "Next"), e))(y || {});
function f(e = document.body) {
  return e == null
    ? []
    : Array.from(e.querySelectorAll(d)).sort((t, r) =>
        Math.sign((t.tabIndex || Number.MAX_SAFE_INTEGER) - (r.tabIndex || Number.MAX_SAFE_INTEGER))
      );
}
var p = (e => ((e[(e.Strict = 0)] = "Strict"), (e[(e.Loose = 1)] = "Loose"), e))(p || {});
function w(e, t = 0) {
  var r;
  return e === ((r = m(e)) == null ? void 0 : r.body)
    ? !1
    : N(t, {
        [0]() {
          return e.matches(d);
        },
        [1]() {
          let o = e;
          for (; o !== null; ) {
            if (o.matches(d)) return !0;
            o = o.parentElement;
          }
          return !1;
        },
      });
}
function T(e) {
  let t = m(e);
  b().nextFrame(() => {
    t && !w(t.activeElement, 0) && S(e);
  });
}
var O = (e => ((e[(e.Keyboard = 0)] = "Keyboard"), (e[(e.Mouse = 1)] = "Mouse"), e))(O || {});
typeof window < "u" &&
  typeof document < "u" &&
  (document.addEventListener(
    "keydown",
    e => {
      e.metaKey ||
        e.altKey ||
        e.ctrlKey ||
        (document.documentElement.dataset.headlessuiFocusVisible = "");
    },
    !0
  ),
  document.addEventListener(
    "click",
    e => {
      e.detail === 1
        ? delete document.documentElement.dataset.headlessuiFocusVisible
        : e.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = "");
    },
    !0
  ));
function S(e) {
  e == null || e.focus({ preventScroll: !0 });
}
let I = ["textarea", "input"].join(",");
function M(e) {
  var t, r;
  return (r = (t = e == null ? void 0 : e.matches) == null ? void 0 : t.call(e, I)) != null
    ? r
    : !1;
}
function A(e, t = r => r) {
  return e.slice().sort((r, o) => {
    let l = t(r),
      i = t(o);
    if (l === null || i === null) return 0;
    let n = l.compareDocumentPosition(i);
    return n & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function _(e, t) {
  return g(f(), t, { relativeTo: e });
}
function g(e, t, { sorted: r = !0, relativeTo: o = null, skipElements: l = [] } = {}) {
  let i = Array.isArray(e) ? (e.length > 0 ? e[0].ownerDocument : document) : e.ownerDocument,
    n = Array.isArray(e) ? (r ? A(e) : e) : f(e);
  l.length > 0 && n.length > 1 && (n = n.filter(s => !l.includes(s))), (o = o ?? i.activeElement);
  let E = (() => {
      if (t & 5) return 1;
      if (t & 10) return -1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(),
    F = (() => {
      if (t & 1) return 0;
      if (t & 2) return Math.max(0, n.indexOf(o)) - 1;
      if (t & 4) return Math.max(0, n.indexOf(o)) + 1;
      if (t & 8) return n.length - 1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(),
    v = t & 32 ? { preventScroll: !0 } : {},
    c = 0,
    a = n.length,
    u;
  do {
    if (c >= a || c + a <= 0) return 0;
    let s = F + c;
    if (t & 16) s = (s + a) % a;
    else {
      if (s < 0) return 3;
      if (s >= a) return 1;
    }
    (u = n[s]), u == null || u.focus(v), (c += E);
  } while (u !== i.activeElement);
  return t & 6 && M(u) && u.select(), 2;
}
export {
  h as Focus,
  x as FocusResult,
  p as FocusableMode,
  S as focusElement,
  _ as focusFrom,
  g as focusIn,
  f as getFocusableElements,
  w as isFocusableElement,
  T as restoreFocusIfNecessary,
  A as sortByDomNode,
};
