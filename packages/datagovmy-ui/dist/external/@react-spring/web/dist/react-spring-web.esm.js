import {
  BailSignal as ot,
  Controller as st,
  FrameValue as it,
  Interpolation as at,
  SpringContext as nt,
  SpringRef as lt,
  SpringValue as ut,
  config as dt,
  inferTo as pt,
  useSpring as ct,
  useSprings as ft,
} from "../../core/dist/react-spring-core.esm.js";
import { unstable_batchedUpdates as k } from "react-dom";
import {
  Globals as F,
  createStringInterpolator as A,
  colors as _,
  eachProp as j,
  is as h,
  FluidValue as T,
  each as f,
  getFluidValue as O,
  hasFluidValue as S,
  addFluidObserver as I,
  removeFluidObserver as P,
  callFluidObservers as $,
  toArray as V,
} from "../../shared/dist/react-spring-shared.esm.js";
import { createInterpolator as ht } from "../../shared/dist/react-spring-shared.esm.js";
import {
  createHost as G,
  AnimatedObject as R,
} from "../../animated/dist/react-spring-animated.esm.js";
function x(t, e) {
  if (t == null) return {};
  var r = {},
    s = Object.keys(t),
    a,
    i;
  for (i = 0; i < s.length; i++) (a = s[i]), !(e.indexOf(a) >= 0) && (r[a] = t[a]);
  return r;
}
const E = ["style", "children", "scrollTop", "scrollLeft"],
  C = /^--/;
function L(t, e) {
  return e == null || typeof e == "boolean" || e === ""
    ? ""
    : typeof e == "number" && e !== 0 && !C.test(t) && !(m.hasOwnProperty(t) && m[t])
    ? e + "px"
    : ("" + e).trim();
}
const w = {};
function N(t, e) {
  if (!t.nodeType || !t.setAttribute) return !1;
  const r = t.nodeName === "filter" || (t.parentNode && t.parentNode.nodeName === "filter"),
    s = e,
    { style: a, children: i, scrollTop: l, scrollLeft: d } = s,
    p = x(s, E),
    n = Object.values(p),
    c = Object.keys(p).map(o =>
      r || t.hasAttribute(o)
        ? o
        : w[o] || (w[o] = o.replace(/([A-Z])/g, u => "-" + u.toLowerCase()))
    );
  i !== void 0 && (t.textContent = i);
  for (let o in a)
    if (a.hasOwnProperty(o)) {
      const u = L(o, a[o]);
      C.test(o) ? t.style.setProperty(o, u) : (t.style[o] = u);
    }
  c.forEach((o, u) => {
    t.setAttribute(o, n[u]);
  }),
    l !== void 0 && (t.scrollTop = l),
    d !== void 0 && (t.scrollLeft = d);
}
let m = {
  animationIterationCount: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0,
};
const W = (t, e) => t + e.charAt(0).toUpperCase() + e.substring(1),
  z = ["Webkit", "Ms", "Moz", "O"];
m = Object.keys(m).reduce((t, e) => (z.forEach(r => (t[W(r, e)] = t[e])), t), m);
const U = ["x", "y", "z"],
  M = /^(matrix|translate|scale|rotate|skew)/,
  q = /^(translate)/,
  D = /^(rotate|skew)/,
  g = (t, e) => (h.num(t) && t !== 0 ? t + e : t),
  b = (t, e) => (h.arr(t) ? t.every(r => b(r, e)) : h.num(t) ? t === e : parseFloat(t) === e);
class H extends R {
  constructor(e) {
    let { x: r, y: s, z: a } = e,
      i = x(e, U);
    const l = [],
      d = [];
    (r || s || a) &&
      (l.push([r || 0, s || 0, a || 0]),
      d.push(p => [`translate3d(${p.map(n => g(n, "px")).join(",")})`, b(p, 0)])),
      j(i, (p, n) => {
        if (n === "transform") l.push([p || ""]), d.push(c => [c, c === ""]);
        else if (M.test(n)) {
          if ((delete i[n], h.und(p))) return;
          const c = q.test(n) ? "px" : D.test(n) ? "deg" : "";
          l.push(V(p)),
            d.push(
              n === "rotate3d"
                ? ([o, u, v, y]) => [`rotate3d(${o},${u},${v},${g(y, c)})`, b(y, 0)]
                : o => [
                    `${n}(${o.map(u => g(u, c)).join(",")})`,
                    b(o, n.startsWith("scale") ? 1 : 0),
                  ]
            );
        }
      }),
      l.length && (i.transform = new K(l, d)),
      super(i);
  }
}
class K extends T {
  constructor(e, r) {
    super(), (this._value = null), (this.inputs = e), (this.transforms = r);
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let e = "",
      r = !0;
    return (
      f(this.inputs, (s, a) => {
        const i = O(s[0]),
          [l, d] = this.transforms[a](h.arr(i) ? i : s.map(O));
        (e += " " + l), (r = r && d);
      }),
      r ? "none" : e
    );
  }
  observerAdded(e) {
    e == 1 && f(this.inputs, r => f(r, s => S(s) && I(s, this)));
  }
  observerRemoved(e) {
    e == 0 && f(this.inputs, r => f(r, s => S(s) && P(s, this)));
  }
  eventObserved(e) {
    e.type == "change" && (this._value = null), $(this, e);
  }
}
const B = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "circle",
    "clipPath",
    "defs",
    "ellipse",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "mask",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "svg",
    "text",
    "tspan",
  ],
  Z = ["scrollTop", "scrollLeft"];
F.assign({
  batchedUpdates: k,
  createStringInterpolator: A,
  colors: _,
});
const J = G(B, {
    applyAnimatedValues: N,
    createAnimatedStyle: t => new H(t),
    getComponentProps: t => x(t, Z),
  }),
  tt = J.animated;
export {
  ot as BailSignal,
  st as Controller,
  it as FrameValue,
  F as Globals,
  at as Interpolation,
  nt as SpringContext,
  lt as SpringRef,
  ut as SpringValue,
  tt as a,
  tt as animated,
  dt as config,
  ht as createInterpolator,
  pt as inferTo,
  ct as useSpring,
  ft as useSprings,
};
