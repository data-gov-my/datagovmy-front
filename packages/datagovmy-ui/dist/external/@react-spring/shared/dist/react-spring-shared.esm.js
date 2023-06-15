import { raf as d } from "../node_modules/@react-spring/rafz/dist/react-spring-rafz.esm.js";
import * as U from "react";
import { useState as I, useRef as D, useEffect as q } from "react";
function K() {}
const Ee = (e, f, r) =>
    Object.defineProperty(e, f, {
      value: r,
      writable: !0,
      configurable: !0,
    }),
  l = {
    arr: Array.isArray,
    obj: e => !!e && e.constructor.name === "Object",
    fun: e => typeof e == "function",
    str: e => typeof e == "string",
    num: e => typeof e == "number",
    und: e => e === void 0,
  };
function Ie(e, f) {
  if (l.arr(e)) {
    if (!l.arr(f) || e.length !== f.length) return !1;
    for (let r = 0; r < e.length; r++) if (e[r] !== f[r]) return !1;
    return !0;
  }
  return e === f;
}
const W = (e, f) => e.forEach(f);
function Oe(e, f, r) {
  if (l.arr(e)) {
    for (let t = 0; t < e.length; t++) f.call(r, e[t], `${t}`);
    return;
  }
  for (const t in e) e.hasOwnProperty(t) && f.call(r, e[t], t);
}
const Se = e => (l.und(e) ? [] : l.arr(e) ? e : [e]);
function Y(e, f) {
  if (e.size) {
    const r = Array.from(e);
    e.clear(), W(r, f);
  }
}
const qe = (e, ...f) => Y(e, r => r(...f));
let C,
  B,
  x = null,
  G = !1,
  z = K;
const Z = e => {
  e.to && (B = e.to),
    e.now && (d.now = e.now),
    e.colors !== void 0 && (x = e.colors),
    e.skipAnimation != null && (G = e.skipAnimation),
    e.createStringInterpolator && (C = e.createStringInterpolator),
    e.requestAnimationFrame && d.use(e.requestAnimationFrame),
    e.batchedUpdates && (d.batchedUpdates = e.batchedUpdates),
    e.willAdvance && (z = e.willAdvance),
    e.frameLoop && (d.frameLoop = e.frameLoop);
};
var Ce = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  get createStringInterpolator() {
    return C;
  },
  get to() {
    return B;
  },
  get colors() {
    return x;
  },
  get skipAnimation() {
    return G;
  },
  get willAdvance() {
    return z;
  },
  assign: Z,
});
const m = /* @__PURE__ */ new Set();
let s = [],
  R = [],
  k = 0;
const M = {
  get idle() {
    return !m.size && !s.length;
  },
  start(e) {
    k > e.priority ? (m.add(e), d.onStart(ee)) : (N(e), d(O));
  },
  advance: O,
  sort(e) {
    if (k) d.onFrame(() => M.sort(e));
    else {
      const f = s.indexOf(e);
      ~f && (s.splice(f, 1), H(e));
    }
  },
  clear() {
    (s = []), m.clear();
  },
};
function ee() {
  m.forEach(N), m.clear(), d(O);
}
function N(e) {
  s.includes(e) || H(e);
}
function H(e) {
  s.splice(
    fe(s, f => f.priority > e.priority),
    0,
    e
  );
}
function O(e) {
  const f = R;
  for (let r = 0; r < s.length; r++) {
    const t = s[r];
    (k = t.priority), t.idle || (z(t), t.advance(e), t.idle || f.push(t));
  }
  return (k = 0), (R = s), (R.length = 0), (s = f), s.length > 0;
}
function fe(e, f) {
  const r = e.findIndex(f);
  return r < 0 ? e.length : r;
}
const ze = {
    transparent: 0,
    aliceblue: 4042850303,
    antiquewhite: 4209760255,
    aqua: 16777215,
    aquamarine: 2147472639,
    azure: 4043309055,
    beige: 4126530815,
    bisque: 4293182719,
    black: 255,
    blanchedalmond: 4293643775,
    blue: 65535,
    blueviolet: 2318131967,
    brown: 2771004159,
    burlywood: 3736635391,
    burntsienna: 3934150143,
    cadetblue: 1604231423,
    chartreuse: 2147418367,
    chocolate: 3530104575,
    coral: 4286533887,
    cornflowerblue: 1687547391,
    cornsilk: 4294499583,
    crimson: 3692313855,
    cyan: 16777215,
    darkblue: 35839,
    darkcyan: 9145343,
    darkgoldenrod: 3095792639,
    darkgray: 2846468607,
    darkgreen: 6553855,
    darkgrey: 2846468607,
    darkkhaki: 3182914559,
    darkmagenta: 2332068863,
    darkolivegreen: 1433087999,
    darkorange: 4287365375,
    darkorchid: 2570243327,
    darkred: 2332033279,
    darksalmon: 3918953215,
    darkseagreen: 2411499519,
    darkslateblue: 1211993087,
    darkslategray: 793726975,
    darkslategrey: 793726975,
    darkturquoise: 13554175,
    darkviolet: 2483082239,
    deeppink: 4279538687,
    deepskyblue: 12582911,
    dimgray: 1768516095,
    dimgrey: 1768516095,
    dodgerblue: 512819199,
    firebrick: 2988581631,
    floralwhite: 4294635775,
    forestgreen: 579543807,
    fuchsia: 4278255615,
    gainsboro: 3705462015,
    ghostwhite: 4177068031,
    gold: 4292280575,
    goldenrod: 3668254975,
    gray: 2155905279,
    green: 8388863,
    greenyellow: 2919182335,
    grey: 2155905279,
    honeydew: 4043305215,
    hotpink: 4285117695,
    indianred: 3445382399,
    indigo: 1258324735,
    ivory: 4294963455,
    khaki: 4041641215,
    lavender: 3873897215,
    lavenderblush: 4293981695,
    lawngreen: 2096890111,
    lemonchiffon: 4294626815,
    lightblue: 2916673279,
    lightcoral: 4034953471,
    lightcyan: 3774873599,
    lightgoldenrodyellow: 4210742015,
    lightgray: 3553874943,
    lightgreen: 2431553791,
    lightgrey: 3553874943,
    lightpink: 4290167295,
    lightsalmon: 4288707327,
    lightseagreen: 548580095,
    lightskyblue: 2278488831,
    lightslategray: 2005441023,
    lightslategrey: 2005441023,
    lightsteelblue: 2965692159,
    lightyellow: 4294959359,
    lime: 16711935,
    limegreen: 852308735,
    linen: 4210091775,
    magenta: 4278255615,
    maroon: 2147483903,
    mediumaquamarine: 1724754687,
    mediumblue: 52735,
    mediumorchid: 3126187007,
    mediumpurple: 2473647103,
    mediumseagreen: 1018393087,
    mediumslateblue: 2070474495,
    mediumspringgreen: 16423679,
    mediumturquoise: 1221709055,
    mediumvioletred: 3340076543,
    midnightblue: 421097727,
    mintcream: 4127193855,
    mistyrose: 4293190143,
    moccasin: 4293178879,
    navajowhite: 4292783615,
    navy: 33023,
    oldlace: 4260751103,
    olive: 2155872511,
    olivedrab: 1804477439,
    orange: 4289003775,
    orangered: 4282712319,
    orchid: 3664828159,
    palegoldenrod: 4008225535,
    palegreen: 2566625535,
    paleturquoise: 2951671551,
    palevioletred: 3681588223,
    papayawhip: 4293907967,
    peachpuff: 4292524543,
    peru: 3448061951,
    pink: 4290825215,
    plum: 3718307327,
    powderblue: 2967529215,
    purple: 2147516671,
    rebeccapurple: 1714657791,
    red: 4278190335,
    rosybrown: 3163525119,
    royalblue: 1097458175,
    saddlebrown: 2336560127,
    salmon: 4202722047,
    sandybrown: 4104413439,
    seagreen: 780883967,
    seashell: 4294307583,
    sienna: 2689740287,
    silver: 3233857791,
    skyblue: 2278484991,
    slateblue: 1784335871,
    slategray: 1887473919,
    slategrey: 1887473919,
    snow: 4294638335,
    springgreen: 16744447,
    steelblue: 1182971135,
    tan: 3535047935,
    teal: 8421631,
    thistle: 3636451583,
    tomato: 4284696575,
    turquoise: 1088475391,
    violet: 4001558271,
    wheat: 4125012991,
    white: 4294967295,
    whitesmoke: 4126537215,
    yellow: 4294902015,
    yellowgreen: 2597139199,
  },
  u = "[-+]?\\d*\\.?\\d+",
  F = u + "%";
function A(...e) {
  return "\\(\\s*(" + e.join(")\\s*,\\s*(") + ")\\s*\\)";
}
const re = new RegExp("rgb" + A(u, u, u)),
  te = new RegExp("rgba" + A(u, u, u, u)),
  ne = new RegExp("hsl" + A(u, F, F)),
  ae = new RegExp("hsla" + A(u, F, F, u)),
  ie = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  oe = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  se = /^#([0-9a-fA-F]{6})$/,
  ce = /^#([0-9a-fA-F]{8})$/;
function ue(e) {
  let f;
  return typeof e == "number"
    ? e >>> 0 === e && e >= 0 && e <= 4294967295
      ? e
      : null
    : (f = se.exec(e))
    ? parseInt(f[1] + "ff", 16) >>> 0
    : x && x[e] !== void 0
    ? x[e]
    : (f = re.exec(e))
    ? ((h(f[1]) << 24) | (h(f[2]) << 16) | (h(f[3]) << 8) | 255) >>> 0
    : (f = te.exec(e))
    ? ((h(f[1]) << 24) | (h(f[2]) << 16) | (h(f[3]) << 8) | L(f[4])) >>> 0
    : (f = ie.exec(e))
    ? parseInt(f[1] + f[1] + f[2] + f[2] + f[3] + f[3] + "ff", 16) >>> 0
    : (f = ce.exec(e))
    ? parseInt(f[1], 16) >>> 0
    : (f = oe.exec(e))
    ? parseInt(f[1] + f[1] + f[2] + f[2] + f[3] + f[3] + f[4] + f[4], 16) >>> 0
    : (f = ne.exec(e))
    ? (_(j(f[1]), w(f[2]), w(f[3])) | 255) >>> 0
    : (f = ae.exec(e))
    ? (_(j(f[1]), w(f[2]), w(f[3])) | L(f[4])) >>> 0
    : null;
}
function $(e, f, r) {
  return (
    r < 0 && (r += 1),
    r > 1 && (r -= 1),
    r < 1 / 6 ? e + (f - e) * 6 * r : r < 1 / 2 ? f : r < 2 / 3 ? e + (f - e) * (2 / 3 - r) * 6 : e
  );
}
function _(e, f, r) {
  const t = r < 0.5 ? r * (1 + f) : r + f - r * f,
    i = 2 * r - t,
    a = $(i, t, e + 1 / 3),
    o = $(i, t, e),
    c = $(i, t, e - 1 / 3);
  return (Math.round(a * 255) << 24) | (Math.round(o * 255) << 16) | (Math.round(c * 255) << 8);
}
function h(e) {
  const f = parseInt(e, 10);
  return f < 0 ? 0 : f > 255 ? 255 : f;
}
function j(e) {
  return (((parseFloat(e) % 360) + 360) % 360) / 360;
}
function L(e) {
  const f = parseFloat(e);
  return f < 0 ? 0 : f > 1 ? 255 : Math.round(f * 255);
}
function w(e) {
  const f = parseFloat(e);
  return f < 0 ? 0 : f > 100 ? 1 : f / 100;
}
function T(e) {
  let f = ue(e);
  if (f === null) return e;
  f = f || 0;
  let r = (f & 4278190080) >>> 24,
    t = (f & 16711680) >>> 16,
    i = (f & 65280) >>> 8,
    a = (f & 255) / 255;
  return `rgba(${r}, ${t}, ${i}, ${a})`;
}
const Q = (e, f, r) => {
  if (l.fun(e)) return e;
  if (l.arr(e))
    return Q({
      range: e,
      output: f,
      extrapolate: r,
    });
  if (l.str(e.output[0])) return C(e);
  const t = e,
    i = t.output,
    a = t.range || [0, 1],
    o = t.extrapolateLeft || t.extrapolate || "extend",
    c = t.extrapolateRight || t.extrapolate || "extend",
    g = t.easing || (n => n);
  return n => {
    const y = de(n, a);
    return le(n, a[y], a[y + 1], i[y], i[y + 1], g, o, c, t.map);
  };
};
function le(e, f, r, t, i, a, o, c, g) {
  let n = g ? g(e) : e;
  if (n < f) {
    if (o === "identity") return n;
    o === "clamp" && (n = f);
  }
  if (n > r) {
    if (c === "identity") return n;
    c === "clamp" && (n = r);
  }
  return t === i
    ? t
    : f === r
    ? e <= f
      ? t
      : i
    : (f === -1 / 0 ? (n = -n) : r === 1 / 0 ? (n = n - f) : (n = (n - f) / (r - f)),
      (n = a(n)),
      t === -1 / 0 ? (n = -n) : i === 1 / 0 ? (n = n + t) : (n = n * (i - t) + t),
      n);
}
function de(e, f) {
  for (var r = 1; r < f.length - 1 && !(f[r] >= e); ++r);
  return r - 1;
}
function S() {
  return (
    (S =
      Object.assign ||
      function (e) {
        for (var f = 1; f < arguments.length; f++) {
          var r = arguments[f];
          for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (e[t] = r[t]);
        }
        return e;
      }),
    S.apply(this, arguments)
  );
}
const b = Symbol.for("FluidValue.get"),
  p = Symbol.for("FluidValue.observers"),
  Pe = e => !!(e && e[b]),
  xe = e => (e && e[b] ? e[b]() : e),
  Ue = e => e[p] || null;
function pe(e, f) {
  e.eventObserved ? e.eventObserved(f) : e(f);
}
function _e(e, f) {
  let r = e[p];
  r &&
    r.forEach(t => {
      pe(t, f);
    });
}
class je {
  constructor(f) {
    if (((this[b] = void 0), (this[p] = void 0), !f && !(f = this.get)))
      throw Error("Unknown getter");
    ge(this, f);
  }
}
const ge = (e, f) => X(e, b, f);
function Le(e, f) {
  if (e[b]) {
    let r = e[p];
    r || X(e, p, (r = /* @__PURE__ */ new Set())),
      r.has(f) || (r.add(f), e.observerAdded && e.observerAdded(r.size, f));
  }
  return f;
}
function Te(e, f) {
  let r = e[p];
  if (r && r.has(f)) {
    const t = r.size - 1;
    t ? r.delete(f) : (e[p] = null), e.observerRemoved && e.observerRemoved(t, f);
  }
}
const X = (e, f, r) =>
    Object.defineProperty(e, f, {
      value: r,
      writable: !0,
      configurable: !0,
    }),
  v = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
  he = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi,
  V = new RegExp(`(${v.source})(%|[a-z]+)`, "i");
let E;
const be = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi,
  me = (e, f, r, t, i) => `rgba(${Math.round(f)}, ${Math.round(r)}, ${Math.round(t)}, ${i})`,
  Ve = e => {
    E || (E = x ? new RegExp(`(${Object.keys(x).join("|")})(?!\\w)`, "g") : /^\b$/);
    const f = e.output.map(a => xe(a).replace(he, T).replace(E, T)),
      r = f.map(a => a.match(v).map(Number)),
      i = r[0]
        .map((a, o) =>
          r.map(c => {
            if (!(o in c)) throw Error('The arity of each "output" value must be equal');
            return c[o];
          })
        )
        .map(a =>
          Q(
            S({}, e, {
              output: a,
            })
          )
        );
    return a => {
      var o;
      const c = !V.test(f[0]) && ((o = f.find(n => V.test(n))) == null ? void 0 : o.replace(v, ""));
      let g = 0;
      return f[0].replace(v, () => `${i[g++](a)}${c || ""}`).replace(be, me);
    };
  },
  P = "react-spring: ",
  J = e => {
    const f = e;
    let r = !1;
    if (typeof f != "function") throw new TypeError(`${P}once requires a function parameter`);
    return (...t) => {
      r || (f(...t), (r = !0));
    };
  },
  ye = J(console.warn);
function De() {
  ye(`${P}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
const we = J(console.warn);
function Be() {
  we(
    `${P}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`
  );
}
function Ge(e) {
  return l.str(e) && (e[0] == "#" || /\d/.test(e) || e in (x || {}));
}
const ve = e => q(e, ke),
  ke = [];
function Ne() {
  const e = I()[1],
    f = I(Fe)[0];
  return (
    ve(f.unmount),
    () => {
      f.current && e({});
    }
  );
}
function Fe() {
  const e = {
    current: !0,
    unmount: () => () => {
      e.current = !1;
    },
  };
  return e;
}
function He(e, f) {
  const [r] = I(() => ({
      inputs: f,
      result: e(),
    })),
    t = D(),
    i = t.current;
  let a = i;
  return (
    a
      ? (f && a.inputs && Ae(f, a.inputs)) ||
        (a = {
          inputs: f,
          result: e(),
        })
      : (a = r),
    q(() => {
      (t.current = a), i == r && (r.inputs = r.result = void 0);
    }, [a]),
    a.result
  );
}
function Ae(e, f) {
  if (e.length !== f.length) return !1;
  for (let r = 0; r < e.length; r++) if (e[r] !== f[r]) return !1;
  return !0;
}
function Qe(e) {
  const f = D();
  return (
    q(() => {
      f.current = e;
    }),
    f.current
  );
}
const Xe =
  typeof window < "u" && window.document && window.document.createElement
    ? U.useLayoutEffect
    : U.useEffect;
export {
  je as FluidValue,
  Ce as Globals,
  Le as addFluidObserver,
  pe as callFluidObserver,
  _e as callFluidObservers,
  T as colorToRgba,
  ze as colors,
  Q as createInterpolator,
  Ve as createStringInterpolator,
  Ee as defineHidden,
  Be as deprecateDirectCall,
  De as deprecateInterpolate,
  W as each,
  Oe as eachProp,
  Y as flush,
  qe as flushCalls,
  M as frameLoop,
  Ue as getFluidObservers,
  xe as getFluidValue,
  Pe as hasFluidValue,
  ie as hex3,
  oe as hex4,
  se as hex6,
  ce as hex8,
  ne as hsl,
  ae as hsla,
  l as is,
  Ge as isAnimatedString,
  Ie as isEqual,
  K as noop,
  d as raf,
  Te as removeFluidObserver,
  re as rgb,
  te as rgba,
  ge as setFluidGetter,
  Se as toArray,
  Ne as useForceUpdate,
  Xe as useLayoutEffect,
  He as useMemoOne,
  ve as useOnce,
  Qe as usePrev,
};
