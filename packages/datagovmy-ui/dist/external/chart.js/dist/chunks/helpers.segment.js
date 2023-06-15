/*!
 * Chart.js v3.9.1
 * https://www.chartjs.org
 * (c) 2022 Chart.js Contributors
 * Released under the MIT License
 */
function Fn() {}
const Cn = (function () {
  let e = 0;
  return function () {
    return e++;
  };
})();
function K(e) {
  return e === null || typeof e > "u";
}
function M(e) {
  if (Array.isArray && Array.isArray(e)) return !0;
  const t = Object.prototype.toString.call(e);
  return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function y(e) {
  return e !== null && Object.prototype.toString.call(e) === "[object Object]";
}
const Ee = e => (typeof e == "number" || e instanceof Number) && isFinite(+e);
function In(e, t) {
  return Ee(e) ? e : t;
}
function R(e, t) {
  return typeof e > "u" ? t : e;
}
const An = (e, t) => (typeof e == "string" && e.endsWith("%") ? parseFloat(e) / 100 : e / t),
  nt = (e, t) => (typeof e == "string" && e.endsWith("%") ? (parseFloat(e) / 100) * t : +e);
function En(e, t, n) {
  if (e && typeof e.call == "function") return e.apply(n, t);
}
function Bn(e, t, n, r) {
  let o, i, s;
  if (M(e))
    if (((i = e.length), r)) for (o = i - 1; o >= 0; o--) t.call(n, e[o], o);
    else for (o = 0; o < i; o++) t.call(n, e[o], o);
  else if (y(e)) for (s = Object.keys(e), i = s.length, o = 0; o < i; o++) t.call(n, e[s[o]], s[o]);
}
function jn(e, t) {
  let n, r, o, i;
  if (!e || !t || e.length !== t.length) return !1;
  for (n = 0, r = e.length; n < r; ++n)
    if (((o = e[n]), (i = t[n]), o.datasetIndex !== i.datasetIndex || o.index !== i.index))
      return !1;
  return !0;
}
function V(e) {
  if (M(e)) return e.map(V);
  if (y(e)) {
    const t = /* @__PURE__ */ Object.create(null),
      n = Object.keys(e),
      r = n.length;
    let o = 0;
    for (; o < r; ++o) t[n[o]] = V(e[n[o]]);
    return t;
  }
  return e;
}
function Be(e) {
  return ["__proto__", "prototype", "constructor"].indexOf(e) === -1;
}
function rt(e, t, n, r) {
  if (!Be(e)) return;
  const o = t[e],
    i = n[e];
  y(o) && y(i) ? U(o, i, r) : (t[e] = V(i));
}
function U(e, t, n) {
  const r = M(t) ? t : [t],
    o = r.length;
  if (!y(e)) return e;
  n = n || {};
  const i = n.merger || rt;
  for (let s = 0; s < o; ++s) {
    if (((t = r[s]), !y(t))) continue;
    const a = Object.keys(t);
    for (let c = 0, f = a.length; c < f; ++c) i(a[c], e, t, n);
  }
  return e;
}
function ot(e, t) {
  return U(e, t, { merger: it });
}
function it(e, t, n) {
  if (!Be(e)) return;
  const r = t[e],
    o = n[e];
  y(r) && y(o) ? ot(r, o) : Object.prototype.hasOwnProperty.call(t, e) || (t[e] = V(o));
}
const be = {
  "": e => e,
  "x": e => e.x,
  "y": e => e.y,
};
function je(e, t) {
  return (be[t] || (be[t] = st(t)))(e);
}
function st(e) {
  const t = at(e);
  return n => {
    for (const r of t) {
      if (r === "") break;
      n = n && n[r];
    }
    return n;
  };
}
function at(e) {
  const t = e.split("."),
    n = [];
  let r = "";
  for (const o of t)
    (r += o), r.endsWith("\\") ? (r = r.slice(0, -1) + ".") : (n.push(r), (r = ""));
  return n;
}
function ve(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const C = e => typeof e < "u",
  Z = e => typeof e == "function",
  vn = (e, t) => {
    if (e.size !== t.size) return !1;
    for (const n of e) if (!t.has(n)) return !1;
    return !0;
  };
function Ln(e) {
  return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
}
const b = Math.PI,
  S = 2 * b,
  ct = S + b,
  Q = Number.POSITIVE_INFINITY,
  ft = b / 180,
  x = b / 2,
  L = b / 4,
  me = (b * 2) / 3,
  ut = Math.log10,
  ye = Math.sign;
function Nn(e) {
  const t = Math.round(e);
  e = Le(e, t, e / 1e3) ? t : e;
  const n = Math.pow(10, Math.floor(ut(e))),
    r = e / n;
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * n;
}
function Wn(e) {
  const t = [],
    n = Math.sqrt(e);
  let r;
  for (r = 1; r < n; r++) e % r === 0 && (t.push(r), t.push(e / r));
  return n === (n | 0) && t.push(n), t.sort((o, i) => o - i).pop(), t;
}
function Yn(e) {
  return !isNaN(parseFloat(e)) && isFinite(e);
}
function Le(e, t, n) {
  return Math.abs(e - t) < n;
}
function Dn(e, t) {
  const n = Math.round(e);
  return n - t <= e && n + t >= e;
}
function Hn(e, t, n) {
  let r, o, i;
  for (r = 0, o = e.length; r < o; r++)
    (i = e[r][n]), isNaN(i) || ((t.min = Math.min(t.min, i)), (t.max = Math.max(t.max, i)));
}
function zn(e) {
  return e * (b / 180);
}
function $n(e) {
  return e * (180 / b);
}
function qn(e) {
  if (!Ee(e)) return;
  let t = 1,
    n = 0;
  for (; Math.round(e * t) / t !== e; ) (t *= 10), n++;
  return n;
}
function Xn(e, t) {
  const n = t.x - e.x,
    r = t.y - e.y,
    o = Math.sqrt(n * n + r * r);
  let i = Math.atan2(r, n);
  return (
    i < -0.5 * b && (i += S),
    {
      angle: i,
      distance: o,
    }
  );
}
function pe(e, t) {
  return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
}
function lt(e, t) {
  return ((e - t + ct) % S) - b;
}
function P(e) {
  return ((e % S) + S) % S;
}
function dt(e, t, n, r) {
  const o = P(e),
    i = P(t),
    s = P(n),
    a = P(i - o),
    c = P(s - o),
    f = P(o - i),
    u = P(o - s);
  return o === i || o === s || (r && i === s) || (a > c && f < u);
}
function ae(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function Kn(e) {
  return ae(e, -32768, 32767);
}
function ht(e, t, n, r = 1e-6) {
  return e >= Math.min(t, n) - r && e <= Math.max(t, n) + r;
}
function Ne(e, t, n) {
  n = n || (s => e[s] < t);
  let r = e.length - 1,
    o = 0,
    i;
  for (; r - o > 1; ) (i = (o + r) >> 1), n(i) ? (o = i) : (r = i);
  return { lo: o, hi: r };
}
const D = (e, t, n, r) => Ne(e, n, r ? o => e[o][t] <= n : o => e[o][t] < n),
  Vn = (e, t, n) => Ne(e, n, r => e[r][t] >= n);
function Un(e, t, n) {
  let r = 0,
    o = e.length;
  for (; r < o && e[r] < t; ) r++;
  for (; o > r && e[o - 1] > n; ) o--;
  return r > 0 || o < e.length ? e.slice(r, o) : e;
}
const We = ["push", "pop", "shift", "splice", "unshift"];
function Zn(e, t) {
  if (e._chartjs) {
    e._chartjs.listeners.push(t);
    return;
  }
  Object.defineProperty(e, "_chartjs", {
    configurable: !0,
    enumerable: !1,
    value: {
      listeners: [t],
    },
  }),
    We.forEach(n => {
      const r = "_onData" + ve(n),
        o = e[n];
      Object.defineProperty(e, n, {
        configurable: !0,
        enumerable: !1,
        value(...i) {
          const s = o.apply(this, i);
          return (
            e._chartjs.listeners.forEach(a => {
              typeof a[r] == "function" && a[r](...i);
            }),
            s
          );
        },
      });
    });
}
function Qn(e, t) {
  const n = e._chartjs;
  if (!n) return;
  const r = n.listeners,
    o = r.indexOf(t);
  o !== -1 && r.splice(o, 1),
    !(r.length > 0) &&
      (We.forEach(i => {
        delete e[i];
      }),
      delete e._chartjs);
}
function Gn(e) {
  const t = /* @__PURE__ */ new Set();
  let n, r;
  for (n = 0, r = e.length; n < r; ++n) t.add(e[n]);
  return t.size === r ? e : Array.from(t);
}
const gt = (function () {
  return typeof window > "u"
    ? function (e) {
        return e();
      }
    : window.requestAnimationFrame;
})();
function Jn(e, t, n) {
  const r = n || (s => Array.prototype.slice.call(s));
  let o = !1,
    i = [];
  return function (...s) {
    (i = r(s)),
      o ||
        ((o = !0),
        gt.call(window, () => {
          (o = !1), e.apply(t, i);
        }));
  };
}
function er(e, t) {
  let n;
  return function (...r) {
    return t ? (clearTimeout(n), (n = setTimeout(e, t, r))) : e.apply(this, r), t;
  };
}
const tr = e => (e === "start" ? "left" : e === "end" ? "right" : "center"),
  nr = (e, t, n) => (e === "start" ? t : e === "end" ? n : (t + n) / 2),
  rr = (e, t, n, r) => (e === (r ? "left" : "right") ? n : e === "center" ? (t + n) / 2 : t);
function or(e, t, n) {
  const r = t.length;
  let o = 0,
    i = r;
  if (e._sorted) {
    const { iScale: s, _parsed: a } = e,
      c = s.axis,
      { min: f, max: u, minDefined: d, maxDefined: g } = s.getUserBounds();
    d &&
      (o = ae(Math.min(D(a, s.axis, f).lo, n ? r : D(t, c, s.getPixelForValue(f)).lo), 0, r - 1)),
      g
        ? (i =
            ae(
              Math.max(
                D(a, s.axis, u, !0).hi + 1,
                n ? 0 : D(t, c, s.getPixelForValue(u), !0).hi + 1
              ),
              o,
              r
            ) - o)
        : (i = r - o);
  }
  return { start: o, count: i };
}
function ir(e) {
  const { xScale: t, yScale: n, _scaleRanges: r } = e,
    o = {
      xmin: t.min,
      xmax: t.max,
      ymin: n.min,
      ymax: n.max,
    };
  if (!r) return (e._scaleRanges = o), !0;
  const i = r.xmin !== t.min || r.xmax !== t.max || r.ymin !== n.min || r.ymax !== n.max;
  return Object.assign(r, o), i;
}
const H = e => e === 0 || e === 1,
  _e = (e, t, n) => -(Math.pow(2, 10 * (e -= 1)) * Math.sin(((e - t) * S) / n)),
  we = (e, t, n) => Math.pow(2, -10 * e) * Math.sin(((e - t) * S) / n) + 1,
  ne = {
    linear: e => e,
    easeInQuad: e => e * e,
    easeOutQuad: e => -e * (e - 2),
    easeInOutQuad: e => ((e /= 0.5) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1)),
    easeInCubic: e => e * e * e,
    easeOutCubic: e => (e -= 1) * e * e + 1,
    easeInOutCubic: e => ((e /= 0.5) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2)),
    easeInQuart: e => e * e * e * e,
    easeOutQuart: e => -((e -= 1) * e * e * e - 1),
    easeInOutQuart: e => ((e /= 0.5) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2)),
    easeInQuint: e => e * e * e * e * e,
    easeOutQuint: e => (e -= 1) * e * e * e * e + 1,
    easeInOutQuint: e =>
      (e /= 0.5) < 1 ? 0.5 * e * e * e * e * e : 0.5 * ((e -= 2) * e * e * e * e + 2),
    easeInSine: e => -Math.cos(e * x) + 1,
    easeOutSine: e => Math.sin(e * x),
    easeInOutSine: e => -0.5 * (Math.cos(b * e) - 1),
    easeInExpo: e => (e === 0 ? 0 : Math.pow(2, 10 * (e - 1))),
    easeOutExpo: e => (e === 1 ? 1 : -Math.pow(2, -10 * e) + 1),
    easeInOutExpo: e =>
      H(e)
        ? e
        : e < 0.5
        ? 0.5 * Math.pow(2, 10 * (e * 2 - 1))
        : 0.5 * (-Math.pow(2, -10 * (e * 2 - 1)) + 2),
    easeInCirc: e => (e >= 1 ? e : -(Math.sqrt(1 - e * e) - 1)),
    easeOutCirc: e => Math.sqrt(1 - (e -= 1) * e),
    easeInOutCirc: e =>
      (e /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1),
    easeInElastic: e => (H(e) ? e : _e(e, 0.075, 0.3)),
    easeOutElastic: e => (H(e) ? e : we(e, 0.075, 0.3)),
    easeInOutElastic(e) {
      return H(e)
        ? e
        : e < 0.5
        ? 0.5 * _e(e * 2, 0.1125, 0.45)
        : 0.5 + 0.5 * we(e * 2 - 1, 0.1125, 0.45);
    },
    easeInBack(e) {
      return e * e * ((1.70158 + 1) * e - 1.70158);
    },
    easeOutBack(e) {
      return (e -= 1) * e * ((1.70158 + 1) * e + 1.70158) + 1;
    },
    easeInOutBack(e) {
      let t = 1.70158;
      return (e /= 0.5) < 1
        ? 0.5 * (e * e * (((t *= 1.525) + 1) * e - t))
        : 0.5 * ((e -= 2) * e * (((t *= 1.525) + 1) * e + t) + 2);
    },
    easeInBounce: e => 1 - ne.easeOutBounce(1 - e),
    easeOutBounce(e) {
      return e < 1 / 2.75
        ? 7.5625 * e * e
        : e < 2 / 2.75
        ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
        : e < 2.5 / 2.75
        ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
        : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
    },
    easeInOutBounce: e =>
      e < 0.5 ? ne.easeInBounce(e * 2) * 0.5 : ne.easeOutBounce(e * 2 - 1) * 0.5 + 0.5,
  };
/*!
 * @kurkle/color v0.2.1
 * https://github.com/kurkle/color#readme
 * (c) 2022 Jukka Kurkela
 * Released under the MIT License
 */
function Y(e) {
  return (e + 0.5) | 0;
}
const T = (e, t, n) => Math.max(Math.min(e, n), t);
function N(e) {
  return T(Y(e * 2.55), 0, 255);
}
function k(e) {
  return T(Y(e * 255), 0, 255);
}
function O(e) {
  return T(Y(e / 2.55) / 100, 0, 1);
}
function xe(e) {
  return T(Y(e * 100), 0, 100);
}
const w = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
  },
  ce = [..."0123456789ABCDEF"],
  bt = e => ce[e & 15],
  mt = e => ce[(e & 240) >> 4] + ce[e & 15],
  z = e => (e & 240) >> 4 === (e & 15),
  yt = e => z(e.r) && z(e.g) && z(e.b) && z(e.a);
function pt(e) {
  var t = e.length,
    n;
  return (
    e[0] === "#" &&
      (t === 4 || t === 5
        ? (n = {
            r: 255 & (w[e[1]] * 17),
            g: 255 & (w[e[2]] * 17),
            b: 255 & (w[e[3]] * 17),
            a: t === 5 ? w[e[4]] * 17 : 255,
          })
        : (t === 7 || t === 9) &&
          (n = {
            r: (w[e[1]] << 4) | w[e[2]],
            g: (w[e[3]] << 4) | w[e[4]],
            b: (w[e[5]] << 4) | w[e[6]],
            a: t === 9 ? (w[e[7]] << 4) | w[e[8]] : 255,
          })),
    n
  );
}
const _t = (e, t) => (e < 255 ? t(e) : "");
function wt(e) {
  var t = yt(e) ? bt : mt;
  return e ? "#" + t(e.r) + t(e.g) + t(e.b) + _t(e.a, t) : void 0;
}
const xt =
  /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function Ye(e, t, n) {
  const r = t * Math.min(n, 1 - n),
    o = (i, s = (i + e / 30) % 12) => n - r * Math.max(Math.min(s - 3, 9 - s, 1), -1);
  return [o(0), o(8), o(4)];
}
function Mt(e, t, n) {
  const r = (o, i = (o + e / 60) % 6) => n - n * t * Math.max(Math.min(i, 4 - i, 1), 0);
  return [r(5), r(3), r(1)];
}
function St(e, t, n) {
  const r = Ye(e, 1, 0.5);
  let o;
  for (t + n > 1 && ((o = 1 / (t + n)), (t *= o), (n *= o)), o = 0; o < 3; o++)
    (r[o] *= 1 - t - n), (r[o] += t);
  return r;
}
function Ot(e, t, n, r, o) {
  return e === o ? (t - n) / r + (t < n ? 6 : 0) : t === o ? (n - e) / r + 2 : (e - t) / r + 4;
}
function fe(e) {
  const n = e.r / 255,
    r = e.g / 255,
    o = e.b / 255,
    i = Math.max(n, r, o),
    s = Math.min(n, r, o),
    a = (i + s) / 2;
  let c, f, u;
  return (
    i !== s &&
      ((u = i - s),
      (f = a > 0.5 ? u / (2 - i - s) : u / (i + s)),
      (c = Ot(n, r, o, u, i)),
      (c = c * 60 + 0.5)),
    [c | 0, f || 0, a]
  );
}
function ue(e, t, n, r) {
  return (Array.isArray(t) ? e(t[0], t[1], t[2]) : e(t, n, r)).map(k);
}
function le(e, t, n) {
  return ue(Ye, e, t, n);
}
function Pt(e, t, n) {
  return ue(St, e, t, n);
}
function Tt(e, t, n) {
  return ue(Mt, e, t, n);
}
function De(e) {
  return ((e % 360) + 360) % 360;
}
function kt(e) {
  const t = xt.exec(e);
  let n = 255,
    r;
  if (!t) return;
  t[5] !== r && (n = t[6] ? N(+t[5]) : k(+t[5]));
  const o = De(+t[2]),
    i = +t[3] / 100,
    s = +t[4] / 100;
  return (
    t[1] === "hwb" ? (r = Pt(o, i, s)) : t[1] === "hsv" ? (r = Tt(o, i, s)) : (r = le(o, i, s)),
    {
      r: r[0],
      g: r[1],
      b: r[2],
      a: n,
    }
  );
}
function Rt(e, t) {
  var n = fe(e);
  (n[0] = De(n[0] + t)), (n = le(n)), (e.r = n[0]), (e.g = n[1]), (e.b = n[2]);
}
function Ft(e) {
  if (!e) return;
  const t = fe(e),
    n = t[0],
    r = xe(t[1]),
    o = xe(t[2]);
  return e.a < 255 ? `hsla(${n}, ${r}%, ${o}%, ${O(e.a)})` : `hsl(${n}, ${r}%, ${o}%)`;
}
const Me = {
    x: "dark",
    Z: "light",
    Y: "re",
    X: "blu",
    W: "gr",
    V: "medium",
    U: "slate",
    A: "ee",
    T: "ol",
    S: "or",
    B: "ra",
    C: "lateg",
    D: "ights",
    R: "in",
    Q: "turquois",
    E: "hi",
    P: "ro",
    O: "al",
    N: "le",
    M: "de",
    L: "yello",
    F: "en",
    K: "ch",
    G: "arks",
    H: "ea",
    I: "ightg",
    J: "wh",
  },
  Se = {
    OiceXe: "f0f8ff",
    antiquewEte: "faebd7",
    aqua: "ffff",
    aquamarRe: "7fffd4",
    azuY: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "0",
    blanKedOmond: "ffebcd",
    Xe: "ff",
    XeviTet: "8a2be2",
    bPwn: "a52a2a",
    burlywood: "deb887",
    caMtXe: "5f9ea0",
    KartYuse: "7fff00",
    KocTate: "d2691e",
    cSO: "ff7f50",
    cSnflowerXe: "6495ed",
    cSnsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "ffff",
    xXe: "8b",
    xcyan: "8b8b",
    xgTMnPd: "b8860b",
    xWay: "a9a9a9",
    xgYF: "6400",
    xgYy: "a9a9a9",
    xkhaki: "bdb76b",
    xmagFta: "8b008b",
    xTivegYF: "556b2f",
    xSange: "ff8c00",
    xScEd: "9932cc",
    xYd: "8b0000",
    xsOmon: "e9967a",
    xsHgYF: "8fbc8f",
    xUXe: "483d8b",
    xUWay: "2f4f4f",
    xUgYy: "2f4f4f",
    xQe: "ced1",
    xviTet: "9400d3",
    dAppRk: "ff1493",
    dApskyXe: "bfff",
    dimWay: "696969",
    dimgYy: "696969",
    dodgerXe: "1e90ff",
    fiYbrick: "b22222",
    flSOwEte: "fffaf0",
    foYstWAn: "228b22",
    fuKsia: "ff00ff",
    gaRsbSo: "dcdcdc",
    ghostwEte: "f8f8ff",
    gTd: "ffd700",
    gTMnPd: "daa520",
    Way: "808080",
    gYF: "8000",
    gYFLw: "adff2f",
    gYy: "808080",
    honeyMw: "f0fff0",
    hotpRk: "ff69b4",
    RdianYd: "cd5c5c",
    Rdigo: "4b0082",
    ivSy: "fffff0",
    khaki: "f0e68c",
    lavFMr: "e6e6fa",
    lavFMrXsh: "fff0f5",
    lawngYF: "7cfc00",
    NmoncEffon: "fffacd",
    ZXe: "add8e6",
    ZcSO: "f08080",
    Zcyan: "e0ffff",
    ZgTMnPdLw: "fafad2",
    ZWay: "d3d3d3",
    ZgYF: "90ee90",
    ZgYy: "d3d3d3",
    ZpRk: "ffb6c1",
    ZsOmon: "ffa07a",
    ZsHgYF: "20b2aa",
    ZskyXe: "87cefa",
    ZUWay: "778899",
    ZUgYy: "778899",
    ZstAlXe: "b0c4de",
    ZLw: "ffffe0",
    lime: "ff00",
    limegYF: "32cd32",
    lRF: "faf0e6",
    magFta: "ff00ff",
    maPon: "800000",
    VaquamarRe: "66cdaa",
    VXe: "cd",
    VScEd: "ba55d3",
    VpurpN: "9370db",
    VsHgYF: "3cb371",
    VUXe: "7b68ee",
    VsprRggYF: "fa9a",
    VQe: "48d1cc",
    VviTetYd: "c71585",
    midnightXe: "191970",
    mRtcYam: "f5fffa",
    mistyPse: "ffe4e1",
    moccasR: "ffe4b5",
    navajowEte: "ffdead",
    navy: "80",
    Tdlace: "fdf5e6",
    Tive: "808000",
    TivedBb: "6b8e23",
    Sange: "ffa500",
    SangeYd: "ff4500",
    ScEd: "da70d6",
    pOegTMnPd: "eee8aa",
    pOegYF: "98fb98",
    pOeQe: "afeeee",
    pOeviTetYd: "db7093",
    papayawEp: "ffefd5",
    pHKpuff: "ffdab9",
    peru: "cd853f",
    pRk: "ffc0cb",
    plum: "dda0dd",
    powMrXe: "b0e0e6",
    purpN: "800080",
    YbeccapurpN: "663399",
    Yd: "ff0000",
    Psybrown: "bc8f8f",
    PyOXe: "4169e1",
    saddNbPwn: "8b4513",
    sOmon: "fa8072",
    sandybPwn: "f4a460",
    sHgYF: "2e8b57",
    sHshell: "fff5ee",
    siFna: "a0522d",
    silver: "c0c0c0",
    skyXe: "87ceeb",
    UXe: "6a5acd",
    UWay: "708090",
    UgYy: "708090",
    snow: "fffafa",
    sprRggYF: "ff7f",
    stAlXe: "4682b4",
    tan: "d2b48c",
    teO: "8080",
    tEstN: "d8bfd8",
    tomato: "ff6347",
    Qe: "40e0d0",
    viTet: "ee82ee",
    JHt: "f5deb3",
    wEte: "ffffff",
    wEtesmoke: "f5f5f5",
    Lw: "ffff00",
    LwgYF: "9acd32",
  };
function Ct() {
  const e = {},
    t = Object.keys(Se),
    n = Object.keys(Me);
  let r, o, i, s, a;
  for (r = 0; r < t.length; r++) {
    for (s = a = t[r], o = 0; o < n.length; o++) (i = n[o]), (a = a.replace(i, Me[i]));
    (i = parseInt(Se[s], 16)), (e[a] = [(i >> 16) & 255, (i >> 8) & 255, i & 255]);
  }
  return e;
}
let $;
function It(e) {
  $ || (($ = Ct()), ($.transparent = [0, 0, 0, 0]));
  const t = $[e.toLowerCase()];
  return (
    t && {
      r: t[0],
      g: t[1],
      b: t[2],
      a: t.length === 4 ? t[3] : 255,
    }
  );
}
const At =
  /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function Et(e) {
  const t = At.exec(e);
  let n = 255,
    r,
    o,
    i;
  if (t) {
    if (t[7] !== r) {
      const s = +t[7];
      n = t[8] ? N(s) : T(s * 255, 0, 255);
    }
    return (
      (r = +t[1]),
      (o = +t[3]),
      (i = +t[5]),
      (r = 255 & (t[2] ? N(r) : T(r, 0, 255))),
      (o = 255 & (t[4] ? N(o) : T(o, 0, 255))),
      (i = 255 & (t[6] ? N(i) : T(i, 0, 255))),
      {
        r,
        g: o,
        b: i,
        a: n,
      }
    );
  }
}
function Bt(e) {
  return (
    e && (e.a < 255 ? `rgba(${e.r}, ${e.g}, ${e.b}, ${O(e.a)})` : `rgb(${e.r}, ${e.g}, ${e.b})`)
  );
}
const re = e => (e <= 31308e-7 ? e * 12.92 : Math.pow(e, 1 / 2.4) * 1.055 - 0.055),
  E = e => (e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4));
function jt(e, t, n) {
  const r = E(O(e.r)),
    o = E(O(e.g)),
    i = E(O(e.b));
  return {
    r: k(re(r + n * (E(O(t.r)) - r))),
    g: k(re(o + n * (E(O(t.g)) - o))),
    b: k(re(i + n * (E(O(t.b)) - i))),
    a: e.a + n * (t.a - e.a),
  };
}
function q(e, t, n) {
  if (e) {
    let r = fe(e);
    (r[t] = Math.max(0, Math.min(r[t] + r[t] * n, t === 0 ? 360 : 1))),
      (r = le(r)),
      (e.r = r[0]),
      (e.g = r[1]),
      (e.b = r[2]);
  }
}
function He(e, t) {
  return e && Object.assign(t || {}, e);
}
function Oe(e) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return (
    Array.isArray(e)
      ? e.length >= 3 &&
        ((t = { r: e[0], g: e[1], b: e[2], a: 255 }), e.length > 3 && (t.a = k(e[3])))
      : ((t = He(e, { r: 0, g: 0, b: 0, a: 1 })), (t.a = k(t.a))),
    t
  );
}
function vt(e) {
  return e.charAt(0) === "r" ? Et(e) : kt(e);
}
class G {
  constructor(t) {
    if (t instanceof G) return t;
    const n = typeof t;
    let r;
    n === "object" ? (r = Oe(t)) : n === "string" && (r = pt(t) || It(t) || vt(t)),
      (this._rgb = r),
      (this._valid = !!r);
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var t = He(this._rgb);
    return t && (t.a = O(t.a)), t;
  }
  set rgb(t) {
    this._rgb = Oe(t);
  }
  rgbString() {
    return this._valid ? Bt(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? wt(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? Ft(this._rgb) : void 0;
  }
  mix(t, n) {
    if (t) {
      const r = this.rgb,
        o = t.rgb;
      let i;
      const s = n === i ? 0.5 : n,
        a = 2 * s - 1,
        c = r.a - o.a,
        f = ((a * c === -1 ? a : (a + c) / (1 + a * c)) + 1) / 2;
      (i = 1 - f),
        (r.r = 255 & (f * r.r + i * o.r + 0.5)),
        (r.g = 255 & (f * r.g + i * o.g + 0.5)),
        (r.b = 255 & (f * r.b + i * o.b + 0.5)),
        (r.a = s * r.a + (1 - s) * o.a),
        (this.rgb = r);
    }
    return this;
  }
  interpolate(t, n) {
    return t && (this._rgb = jt(this._rgb, t._rgb, n)), this;
  }
  clone() {
    return new G(this.rgb);
  }
  alpha(t) {
    return (this._rgb.a = k(t)), this;
  }
  clearer(t) {
    const n = this._rgb;
    return (n.a *= 1 - t), this;
  }
  greyscale() {
    const t = this._rgb,
      n = Y(t.r * 0.3 + t.g * 0.59 + t.b * 0.11);
    return (t.r = t.g = t.b = n), this;
  }
  opaquer(t) {
    const n = this._rgb;
    return (n.a *= 1 + t), this;
  }
  negate() {
    const t = this._rgb;
    return (t.r = 255 - t.r), (t.g = 255 - t.g), (t.b = 255 - t.b), this;
  }
  lighten(t) {
    return q(this._rgb, 2, t), this;
  }
  darken(t) {
    return q(this._rgb, 2, -t), this;
  }
  saturate(t) {
    return q(this._rgb, 1, t), this;
  }
  desaturate(t) {
    return q(this._rgb, 1, -t), this;
  }
  rotate(t) {
    return Rt(this._rgb, t), this;
  }
}
function ze(e) {
  return new G(e);
}
function $e(e) {
  if (e && typeof e == "object") {
    const t = e.toString();
    return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
  }
  return !1;
}
function sr(e) {
  return $e(e) ? e : ze(e);
}
function oe(e) {
  return $e(e) ? e : ze(e).saturate(0.5).darken(0.1).hexString();
}
const Lt = /* @__PURE__ */ Object.create(null),
  Nt = /* @__PURE__ */ Object.create(null);
function W(e, t) {
  if (!t) return e;
  const n = t.split(".");
  for (let r = 0, o = n.length; r < o; ++r) {
    const i = n[r];
    e = e[i] || (e[i] = /* @__PURE__ */ Object.create(null));
  }
  return e;
}
function ie(e, t, n) {
  return typeof t == "string" ? U(W(e, t), n) : U(W(e, ""), t);
}
class Wt {
  constructor(t) {
    (this.animation = void 0),
      (this.backgroundColor = "rgba(0,0,0,0.1)"),
      (this.borderColor = "rgba(0,0,0,0.1)"),
      (this.color = "#666"),
      (this.datasets = {}),
      (this.devicePixelRatio = n => n.chart.platform.getDevicePixelRatio()),
      (this.elements = {}),
      (this.events = ["mousemove", "mouseout", "click", "touchstart", "touchmove"]),
      (this.font = {
        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        size: 12,
        style: "normal",
        lineHeight: 1.2,
        weight: null,
      }),
      (this.hover = {}),
      (this.hoverBackgroundColor = (n, r) => oe(r.backgroundColor)),
      (this.hoverBorderColor = (n, r) => oe(r.borderColor)),
      (this.hoverColor = (n, r) => oe(r.color)),
      (this.indexAxis = "x"),
      (this.interaction = {
        mode: "nearest",
        intersect: !0,
        includeInvisible: !1,
      }),
      (this.maintainAspectRatio = !0),
      (this.onHover = null),
      (this.onClick = null),
      (this.parsing = !0),
      (this.plugins = {}),
      (this.responsive = !0),
      (this.scale = void 0),
      (this.scales = {}),
      (this.showLine = !0),
      (this.drawActiveElementsOnTop = !0),
      this.describe(t);
  }
  set(t, n) {
    return ie(this, t, n);
  }
  get(t) {
    return W(this, t);
  }
  describe(t, n) {
    return ie(Nt, t, n);
  }
  override(t, n) {
    return ie(Lt, t, n);
  }
  route(t, n, r, o) {
    const i = W(this, t),
      s = W(this, r),
      a = "_" + n;
    Object.defineProperties(i, {
      [a]: {
        value: i[n],
        writable: !0,
      },
      [n]: {
        enumerable: !0,
        get() {
          const c = this[a],
            f = s[o];
          return y(c) ? Object.assign({}, f, c) : R(c, f);
        },
        set(c) {
          this[a] = c;
        },
      },
    });
  }
}
var Yt = new Wt({
  _scriptable: e => !e.startsWith("on"),
  _indexable: e => e !== "events",
  hover: {
    _fallback: "interaction",
  },
  interaction: {
    _scriptable: !1,
    _indexable: !1,
  },
});
function Dt(e) {
  return !e || K(e.size) || K(e.family)
    ? null
    : (e.style ? e.style + " " : "") + (e.weight ? e.weight + " " : "") + e.size + "px " + e.family;
}
function Pe(e, t, n, r, o) {
  let i = t[o];
  return i || ((i = t[o] = e.measureText(o).width), n.push(o)), i > r && (r = i), r;
}
function ar(e, t, n, r) {
  r = r || {};
  let o = (r.data = r.data || {}),
    i = (r.garbageCollect = r.garbageCollect || []);
  r.font !== t && ((o = r.data = {}), (i = r.garbageCollect = []), (r.font = t)),
    e.save(),
    (e.font = t);
  let s = 0;
  const a = n.length;
  let c, f, u, d, g;
  for (c = 0; c < a; c++)
    if (((d = n[c]), d != null && M(d) !== !0)) s = Pe(e, o, i, s, d);
    else if (M(d))
      for (f = 0, u = d.length; f < u; f++)
        (g = d[f]), g != null && !M(g) && (s = Pe(e, o, i, s, g));
  e.restore();
  const h = i.length / 2;
  if (h > n.length) {
    for (c = 0; c < h; c++) delete o[i[c]];
    i.splice(0, h);
  }
  return s;
}
function cr(e, t, n) {
  const r = e.currentDevicePixelRatio,
    o = n !== 0 ? Math.max(n / 2, 0.5) : 0;
  return Math.round((t - o) * r) / r + o;
}
function fr(e, t) {
  (t = t || e.getContext("2d")),
    t.save(),
    t.resetTransform(),
    t.clearRect(0, 0, e.width, e.height),
    t.restore();
}
function ur(e, t, n, r) {
  Ht(e, t, n, r, null);
}
function Ht(e, t, n, r, o) {
  let i, s, a, c, f, u;
  const d = t.pointStyle,
    g = t.rotation,
    h = t.radius;
  let l = (g || 0) * ft;
  if (
    d &&
    typeof d == "object" &&
    ((i = d.toString()), i === "[object HTMLImageElement]" || i === "[object HTMLCanvasElement]")
  ) {
    e.save(),
      e.translate(n, r),
      e.rotate(l),
      e.drawImage(d, -d.width / 2, -d.height / 2, d.width, d.height),
      e.restore();
    return;
  }
  if (!(isNaN(h) || h <= 0)) {
    switch ((e.beginPath(), d)) {
      default:
        o ? e.ellipse(n, r, o / 2, h, 0, 0, S) : e.arc(n, r, h, 0, S), e.closePath();
        break;
      case "triangle":
        e.moveTo(n + Math.sin(l) * h, r - Math.cos(l) * h),
          (l += me),
          e.lineTo(n + Math.sin(l) * h, r - Math.cos(l) * h),
          (l += me),
          e.lineTo(n + Math.sin(l) * h, r - Math.cos(l) * h),
          e.closePath();
        break;
      case "rectRounded":
        (f = h * 0.516),
          (c = h - f),
          (s = Math.cos(l + L) * c),
          (a = Math.sin(l + L) * c),
          e.arc(n - s, r - a, f, l - b, l - x),
          e.arc(n + a, r - s, f, l - x, l),
          e.arc(n + s, r + a, f, l, l + x),
          e.arc(n - a, r + s, f, l + x, l + b),
          e.closePath();
        break;
      case "rect":
        if (!g) {
          (c = Math.SQRT1_2 * h), (u = o ? o / 2 : c), e.rect(n - u, r - c, 2 * u, 2 * c);
          break;
        }
        l += L;
      case "rectRot":
        (s = Math.cos(l) * h),
          (a = Math.sin(l) * h),
          e.moveTo(n - s, r - a),
          e.lineTo(n + a, r - s),
          e.lineTo(n + s, r + a),
          e.lineTo(n - a, r + s),
          e.closePath();
        break;
      case "crossRot":
        l += L;
      case "cross":
        (s = Math.cos(l) * h),
          (a = Math.sin(l) * h),
          e.moveTo(n - s, r - a),
          e.lineTo(n + s, r + a),
          e.moveTo(n + a, r - s),
          e.lineTo(n - a, r + s);
        break;
      case "star":
        (s = Math.cos(l) * h),
          (a = Math.sin(l) * h),
          e.moveTo(n - s, r - a),
          e.lineTo(n + s, r + a),
          e.moveTo(n + a, r - s),
          e.lineTo(n - a, r + s),
          (l += L),
          (s = Math.cos(l) * h),
          (a = Math.sin(l) * h),
          e.moveTo(n - s, r - a),
          e.lineTo(n + s, r + a),
          e.moveTo(n + a, r - s),
          e.lineTo(n - a, r + s);
        break;
      case "line":
        (s = o ? o / 2 : Math.cos(l) * h),
          (a = Math.sin(l) * h),
          e.moveTo(n - s, r - a),
          e.lineTo(n + s, r + a);
        break;
      case "dash":
        e.moveTo(n, r), e.lineTo(n + Math.cos(l) * h, r + Math.sin(l) * h);
        break;
    }
    e.fill(), t.borderWidth > 0 && e.stroke();
  }
}
function Te(e, t, n) {
  return (
    (n = n || 0.5),
    !t || (e && e.x > t.left - n && e.x < t.right + n && e.y > t.top - n && e.y < t.bottom + n)
  );
}
function lr(e, t) {
  e.save(), e.beginPath(), e.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), e.clip();
}
function dr(e) {
  e.restore();
}
function hr(e, t, n, r, o) {
  if (!t) return e.lineTo(n.x, n.y);
  if (o === "middle") {
    const i = (t.x + n.x) / 2;
    e.lineTo(i, t.y), e.lineTo(i, n.y);
  } else (o === "after") != !!r ? e.lineTo(t.x, n.y) : e.lineTo(n.x, t.y);
  e.lineTo(n.x, n.y);
}
function gr(e, t, n, r) {
  if (!t) return e.lineTo(n.x, n.y);
  e.bezierCurveTo(
    r ? t.cp1x : t.cp2x,
    r ? t.cp1y : t.cp2y,
    r ? n.cp2x : n.cp1x,
    r ? n.cp2y : n.cp1y,
    n.x,
    n.y
  );
}
function br(e, t, n, r, o, i = {}) {
  const s = M(t) ? t : [t],
    a = i.strokeWidth > 0 && i.strokeColor !== "";
  let c, f;
  for (e.save(), e.font = o.string, zt(e, i), c = 0; c < s.length; ++c)
    (f = s[c]),
      a &&
        (i.strokeColor && (e.strokeStyle = i.strokeColor),
        K(i.strokeWidth) || (e.lineWidth = i.strokeWidth),
        e.strokeText(f, n, r, i.maxWidth)),
      e.fillText(f, n, r, i.maxWidth),
      $t(e, n, r, f, i),
      (r += o.lineHeight);
  e.restore();
}
function zt(e, t) {
  t.translation && e.translate(t.translation[0], t.translation[1]),
    K(t.rotation) || e.rotate(t.rotation),
    t.color && (e.fillStyle = t.color),
    t.textAlign && (e.textAlign = t.textAlign),
    t.textBaseline && (e.textBaseline = t.textBaseline);
}
function $t(e, t, n, r, o) {
  if (o.strikethrough || o.underline) {
    const i = e.measureText(r),
      s = t - i.actualBoundingBoxLeft,
      a = t + i.actualBoundingBoxRight,
      c = n - i.actualBoundingBoxAscent,
      f = n + i.actualBoundingBoxDescent,
      u = o.strikethrough ? (c + f) / 2 : f;
    (e.strokeStyle = e.fillStyle),
      e.beginPath(),
      (e.lineWidth = o.decorationWidth || 2),
      e.moveTo(s, u),
      e.lineTo(a, u),
      e.stroke();
  }
}
function mr(e, t) {
  const { x: n, y: r, w: o, h: i, radius: s } = t;
  e.arc(n + s.topLeft, r + s.topLeft, s.topLeft, -x, b, !0),
    e.lineTo(n, r + i - s.bottomLeft),
    e.arc(n + s.bottomLeft, r + i - s.bottomLeft, s.bottomLeft, b, x, !0),
    e.lineTo(n + o - s.bottomRight, r + i),
    e.arc(n + o - s.bottomRight, r + i - s.bottomRight, s.bottomRight, x, 0, !0),
    e.lineTo(n + o, r + s.topRight),
    e.arc(n + o - s.topRight, r + s.topRight, s.topRight, 0, -x, !0),
    e.lineTo(n + s.topLeft, r);
}
const qt = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/),
  Xt = new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);
function Kt(e, t) {
  const n = ("" + e).match(qt);
  if (!n || n[1] === "normal") return t * 1.2;
  switch (((e = +n[2]), n[3])) {
    case "px":
      return e;
    case "%":
      e /= 100;
      break;
  }
  return t * e;
}
const Vt = e => +e || 0;
function qe(e, t) {
  const n = {},
    r = y(t),
    o = r ? Object.keys(t) : t,
    i = y(e) ? (r ? s => R(e[s], e[t[s]]) : s => e[s]) : () => e;
  for (const s of o) n[s] = Vt(i(s));
  return n;
}
function Ut(e) {
  return qe(e, { top: "y", right: "x", bottom: "y", left: "x" });
}
function yr(e) {
  return qe(e, ["topLeft", "topRight", "bottomLeft", "bottomRight"]);
}
function pr(e) {
  const t = Ut(e);
  return (t.width = t.left + t.right), (t.height = t.top + t.bottom), t;
}
function _r(e, t) {
  (e = e || {}), (t = t || Yt.font);
  let n = R(e.size, t.size);
  typeof n == "string" && (n = parseInt(n, 10));
  let r = R(e.style, t.style);
  r && !("" + r).match(Xt) && (console.warn('Invalid font style specified: "' + r + '"'), (r = ""));
  const o = {
    family: R(e.family, t.family),
    lineHeight: Kt(R(e.lineHeight, t.lineHeight), n),
    size: n,
    style: r,
    weight: R(e.weight, t.weight),
    string: "",
  };
  return (o.string = Dt(o)), o;
}
function wr(e, t, n, r) {
  let o = !0,
    i,
    s,
    a;
  for (i = 0, s = e.length; i < s; ++i)
    if (
      ((a = e[i]),
      a !== void 0 &&
        (t !== void 0 && typeof a == "function" && ((a = a(t)), (o = !1)),
        n !== void 0 && M(a) && ((a = a[n % a.length]), (o = !1)),
        a !== void 0))
    )
      return r && !o && (r.cacheable = !1), a;
}
function xr(e, t, n) {
  const { min: r, max: o } = e,
    i = nt(t, (o - r) / 2),
    s = (a, c) => (n && a === 0 ? 0 : a + c);
  return {
    min: s(r, -Math.abs(i)),
    max: s(o, i),
  };
}
function Zt(e, t) {
  return Object.assign(Object.create(e), t);
}
function Xe(e, t = [""], n = e, r, o = () => e[0]) {
  C(r) || (r = Ue("_fallback", e));
  const i = {
    [Symbol.toStringTag]: "Object",
    _cacheable: !0,
    _scopes: e,
    _rootScopes: n,
    _fallback: r,
    _getTarget: o,
    override: s => Xe([s, ...e], t, n, r),
  };
  return new Proxy(i, {
    deleteProperty(s, a) {
      return delete s[a], delete s._keys, delete e[0][a], !0;
    },
    get(s, a) {
      return Ke(s, a, () => sn(a, t, e, s));
    },
    getOwnPropertyDescriptor(s, a) {
      return Reflect.getOwnPropertyDescriptor(s._scopes[0], a);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(e[0]);
    },
    has(s, a) {
      return Re(s).includes(a);
    },
    ownKeys(s) {
      return Re(s);
    },
    set(s, a, c) {
      const f = s._storage || (s._storage = o());
      return (s[a] = f[a] = c), delete s._keys, !0;
    },
  });
}
function J(e, t, n, r) {
  const o = {
    _cacheable: !1,
    _proxy: e,
    _context: t,
    _subProxy: n,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: Qt(e, r),
    setContext: i => J(e, i, n, r),
    override: i => J(e.override(i), t, n, r),
  };
  return new Proxy(o, {
    deleteProperty(i, s) {
      return delete i[s], delete e[s], !0;
    },
    get(i, s, a) {
      return Ke(i, s, () => Jt(i, s, a));
    },
    getOwnPropertyDescriptor(i, s) {
      return i._descriptors.allKeys
        ? Reflect.has(e, s)
          ? { enumerable: !0, configurable: !0 }
          : void 0
        : Reflect.getOwnPropertyDescriptor(e, s);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(e);
    },
    has(i, s) {
      return Reflect.has(e, s);
    },
    ownKeys() {
      return Reflect.ownKeys(e);
    },
    set(i, s, a) {
      return (e[s] = a), delete i[s], !0;
    },
  });
}
function Qt(e, t = { scriptable: !0, indexable: !0 }) {
  const { _scriptable: n = t.scriptable, _indexable: r = t.indexable, _allKeys: o = t.allKeys } = e;
  return {
    allKeys: o,
    scriptable: n,
    indexable: r,
    isScriptable: Z(n) ? n : () => n,
    isIndexable: Z(r) ? r : () => r,
  };
}
const Gt = (e, t) => (e ? e + ve(t) : t),
  de = (e, t) =>
    y(t) && e !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function Ke(e, t, n) {
  if (Object.prototype.hasOwnProperty.call(e, t)) return e[t];
  const r = n();
  return (e[t] = r), r;
}
function Jt(e, t, n) {
  const { _proxy: r, _context: o, _subProxy: i, _descriptors: s } = e;
  let a = r[t];
  return (
    Z(a) && s.isScriptable(t) && (a = en(t, a, e, n)),
    M(a) && a.length && (a = tn(t, a, e, s.isIndexable)),
    de(t, a) && (a = J(a, o, i && i[t], s)),
    a
  );
}
function en(e, t, n, r) {
  const { _proxy: o, _context: i, _subProxy: s, _stack: a } = n;
  if (a.has(e)) throw new Error("Recursion detected: " + Array.from(a).join("->") + "->" + e);
  return a.add(e), (t = t(i, s || r)), a.delete(e), de(e, t) && (t = he(o._scopes, o, e, t)), t;
}
function tn(e, t, n, r) {
  const { _proxy: o, _context: i, _subProxy: s, _descriptors: a } = n;
  if (C(i.index) && r(e)) t = t[i.index % t.length];
  else if (y(t[0])) {
    const c = t,
      f = o._scopes.filter(u => u !== c);
    t = [];
    for (const u of c) {
      const d = he(f, o, e, u);
      t.push(J(d, i, s && s[e], a));
    }
  }
  return t;
}
function Ve(e, t, n) {
  return Z(e) ? e(t, n) : e;
}
const nn = (e, t) => (e === !0 ? t : typeof e == "string" ? je(t, e) : void 0);
function rn(e, t, n, r, o) {
  for (const i of t) {
    const s = nn(n, i);
    if (s) {
      e.add(s);
      const a = Ve(s._fallback, n, o);
      if (C(a) && a !== n && a !== r) return a;
    } else if (s === !1 && C(r) && n !== r) return null;
  }
  return !1;
}
function he(e, t, n, r) {
  const o = t._rootScopes,
    i = Ve(t._fallback, n, r),
    s = [...e, ...o],
    a = /* @__PURE__ */ new Set();
  a.add(r);
  let c = ke(a, s, n, i || n, r);
  return c === null || (C(i) && i !== n && ((c = ke(a, s, i, c, r)), c === null))
    ? !1
    : Xe(Array.from(a), [""], o, i, () => on(t, n, r));
}
function ke(e, t, n, r, o) {
  for (; n; ) n = rn(e, t, n, r, o);
  return n;
}
function on(e, t, n) {
  const r = e._getTarget();
  t in r || (r[t] = {});
  const o = r[t];
  return M(o) && y(n) ? n : o;
}
function sn(e, t, n, r) {
  let o;
  for (const i of t) if (((o = Ue(Gt(i, e), n)), C(o))) return de(e, o) ? he(n, r, e, o) : o;
}
function Ue(e, t) {
  for (const n of t) {
    if (!n) continue;
    const r = n[e];
    if (C(r)) return r;
  }
}
function Re(e) {
  let t = e._keys;
  return t || (t = e._keys = an(e._scopes)), t;
}
function an(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) for (const r of Object.keys(n).filter(o => !o.startsWith("_"))) t.add(r);
  return Array.from(t);
}
function Mr(e, t, n, r) {
  const { iScale: o } = e,
    { key: i = "r" } = this._parsing,
    s = new Array(r);
  let a, c, f, u;
  for (a = 0, c = r; a < c; ++a)
    (f = a + n),
      (u = t[f]),
      (s[a] = {
        r: o.parse(je(u, i), f),
      });
  return s;
}
const cn = Number.EPSILON || 1e-14,
  j = (e, t) => t < e.length && !e[t].skip && e[t],
  Ze = e => (e === "x" ? "y" : "x");
function fn(e, t, n, r) {
  const o = e.skip ? t : e,
    i = t,
    s = n.skip ? t : n,
    a = pe(i, o),
    c = pe(s, i);
  let f = a / (a + c),
    u = c / (a + c);
  (f = isNaN(f) ? 0 : f), (u = isNaN(u) ? 0 : u);
  const d = r * f,
    g = r * u;
  return {
    previous: {
      x: i.x - d * (s.x - o.x),
      y: i.y - d * (s.y - o.y),
    },
    next: {
      x: i.x + g * (s.x - o.x),
      y: i.y + g * (s.y - o.y),
    },
  };
}
function un(e, t, n) {
  const r = e.length;
  let o,
    i,
    s,
    a,
    c,
    f = j(e, 0);
  for (let u = 0; u < r - 1; ++u)
    if (((c = f), (f = j(e, u + 1)), !(!c || !f))) {
      if (Le(t[u], 0, cn)) {
        n[u] = n[u + 1] = 0;
        continue;
      }
      (o = n[u] / t[u]),
        (i = n[u + 1] / t[u]),
        (a = Math.pow(o, 2) + Math.pow(i, 2)),
        !(a <= 9) && ((s = 3 / Math.sqrt(a)), (n[u] = o * s * t[u]), (n[u + 1] = i * s * t[u]));
    }
}
function ln(e, t, n = "x") {
  const r = Ze(n),
    o = e.length;
  let i,
    s,
    a,
    c = j(e, 0);
  for (let f = 0; f < o; ++f) {
    if (((s = a), (a = c), (c = j(e, f + 1)), !a)) continue;
    const u = a[n],
      d = a[r];
    s && ((i = (u - s[n]) / 3), (a[`cp1${n}`] = u - i), (a[`cp1${r}`] = d - i * t[f])),
      c && ((i = (c[n] - u) / 3), (a[`cp2${n}`] = u + i), (a[`cp2${r}`] = d + i * t[f]));
  }
}
function dn(e, t = "x") {
  const n = Ze(t),
    r = e.length,
    o = Array(r).fill(0),
    i = Array(r);
  let s,
    a,
    c,
    f = j(e, 0);
  for (s = 0; s < r; ++s)
    if (((a = c), (c = f), (f = j(e, s + 1)), !!c)) {
      if (f) {
        const u = f[t] - c[t];
        o[s] = u !== 0 ? (f[n] - c[n]) / u : 0;
      }
      i[s] = a ? (f ? (ye(o[s - 1]) !== ye(o[s]) ? 0 : (o[s - 1] + o[s]) / 2) : o[s - 1]) : o[s];
    }
  un(e, o, i), ln(e, i, t);
}
function X(e, t, n) {
  return Math.max(Math.min(e, n), t);
}
function hn(e, t) {
  let n,
    r,
    o,
    i,
    s,
    a = Te(e[0], t);
  for (n = 0, r = e.length; n < r; ++n)
    (s = i),
      (i = a),
      (a = n < r - 1 && Te(e[n + 1], t)),
      i &&
        ((o = e[n]),
        s && ((o.cp1x = X(o.cp1x, t.left, t.right)), (o.cp1y = X(o.cp1y, t.top, t.bottom))),
        a && ((o.cp2x = X(o.cp2x, t.left, t.right)), (o.cp2y = X(o.cp2y, t.top, t.bottom))));
}
function Sr(e, t, n, r, o) {
  let i, s, a, c;
  if ((t.spanGaps && (e = e.filter(f => !f.skip)), t.cubicInterpolationMode === "monotone"))
    dn(e, o);
  else {
    let f = r ? e[e.length - 1] : e[0];
    for (i = 0, s = e.length; i < s; ++i)
      (a = e[i]),
        (c = fn(f, a, e[Math.min(i + 1, s - (r ? 0 : 1)) % s], t.tension)),
        (a.cp1x = c.previous.x),
        (a.cp1y = c.previous.y),
        (a.cp2x = c.next.x),
        (a.cp2y = c.next.y),
        (f = a);
  }
  t.capBezierPoints && hn(e, n);
}
function Or() {
  return typeof window < "u" && typeof document < "u";
}
function gn(e) {
  let t = e.parentNode;
  return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function ee(e, t, n) {
  let r;
  return (
    typeof e == "string"
      ? ((r = parseInt(e, 10)), e.indexOf("%") !== -1 && (r = (r / 100) * t.parentNode[n]))
      : (r = e),
    r
  );
}
const te = e => window.getComputedStyle(e, null);
function bn(e, t) {
  return te(e).getPropertyValue(t);
}
const mn = ["top", "right", "bottom", "left"];
function F(e, t, n) {
  const r = {};
  n = n ? "-" + n : "";
  for (let o = 0; o < 4; o++) {
    const i = mn[o];
    r[i] = parseFloat(e[t + "-" + i + n]) || 0;
  }
  return (r.width = r.left + r.right), (r.height = r.top + r.bottom), r;
}
const yn = (e, t, n) => (e > 0 || t > 0) && (!n || !n.shadowRoot);
function pn(e, t) {
  const n = e.touches,
    r = n && n.length ? n[0] : e,
    { offsetX: o, offsetY: i } = r;
  let s = !1,
    a,
    c;
  if (yn(o, i, e.target)) (a = o), (c = i);
  else {
    const f = t.getBoundingClientRect();
    (a = r.clientX - f.left), (c = r.clientY - f.top), (s = !0);
  }
  return { x: a, y: c, box: s };
}
function Pr(e, t) {
  if ("native" in e) return e;
  const { canvas: n, currentDevicePixelRatio: r } = t,
    o = te(n),
    i = o.boxSizing === "border-box",
    s = F(o, "padding"),
    a = F(o, "border", "width"),
    { x: c, y: f, box: u } = pn(e, n),
    d = s.left + (u && a.left),
    g = s.top + (u && a.top);
  let { width: h, height: l } = t;
  return (
    i && ((h -= s.width + a.width), (l -= s.height + a.height)),
    {
      x: Math.round((((c - d) / h) * n.width) / r),
      y: Math.round((((f - g) / l) * n.height) / r),
    }
  );
}
function _n(e, t, n) {
  let r, o;
  if (t === void 0 || n === void 0) {
    const i = gn(e);
    if (!i) (t = e.clientWidth), (n = e.clientHeight);
    else {
      const s = i.getBoundingClientRect(),
        a = te(i),
        c = F(a, "border", "width"),
        f = F(a, "padding");
      (t = s.width - f.width - c.width),
        (n = s.height - f.height - c.height),
        (r = ee(a.maxWidth, i, "clientWidth")),
        (o = ee(a.maxHeight, i, "clientHeight"));
    }
  }
  return {
    width: t,
    height: n,
    maxWidth: r || Q,
    maxHeight: o || Q,
  };
}
const se = e => Math.round(e * 10) / 10;
function Tr(e, t, n, r) {
  const o = te(e),
    i = F(o, "margin"),
    s = ee(o.maxWidth, e, "clientWidth") || Q,
    a = ee(o.maxHeight, e, "clientHeight") || Q,
    c = _n(e, t, n);
  let { width: f, height: u } = c;
  if (o.boxSizing === "content-box") {
    const d = F(o, "border", "width"),
      g = F(o, "padding");
    (f -= g.width + d.width), (u -= g.height + d.height);
  }
  return (
    (f = Math.max(0, f - i.width)),
    (u = Math.max(0, r ? Math.floor(f / r) : u - i.height)),
    (f = se(Math.min(f, s, c.maxWidth))),
    (u = se(Math.min(u, a, c.maxHeight))),
    f && !u && (u = se(f / 2)),
    {
      width: f,
      height: u,
    }
  );
}
function kr(e, t, n) {
  const r = t || 1,
    o = Math.floor(e.height * r),
    i = Math.floor(e.width * r);
  (e.height = o / r), (e.width = i / r);
  const s = e.canvas;
  return (
    s.style &&
      (n || (!s.style.height && !s.style.width)) &&
      ((s.style.height = `${e.height}px`), (s.style.width = `${e.width}px`)),
    e.currentDevicePixelRatio !== r || s.height !== o || s.width !== i
      ? ((e.currentDevicePixelRatio = r),
        (s.height = o),
        (s.width = i),
        e.ctx.setTransform(r, 0, 0, r, 0, 0),
        !0)
      : !1
  );
}
const Rr = (function () {
  let e = !1;
  try {
    const t = {
      get passive() {
        return (e = !0), !1;
      },
    };
    window.addEventListener("test", null, t), window.removeEventListener("test", null, t);
  } catch {}
  return e;
})();
function Fr(e, t) {
  const n = bn(e, t),
    r = n && n.match(/^(\d+)(\.\d+)?px$/);
  return r ? +r[1] : void 0;
}
function B(e, t, n, r) {
  return {
    x: e.x + n * (t.x - e.x),
    y: e.y + n * (t.y - e.y),
  };
}
function Cr(e, t, n, r) {
  return {
    x: e.x + n * (t.x - e.x),
    y:
      r === "middle"
        ? n < 0.5
          ? e.y
          : t.y
        : r === "after"
        ? n < 1
          ? e.y
          : t.y
        : n > 0
        ? t.y
        : e.y,
  };
}
function Ir(e, t, n, r) {
  const o = { x: e.cp2x, y: e.cp2y },
    i = { x: t.cp1x, y: t.cp1y },
    s = B(e, o, n),
    a = B(o, i, n),
    c = B(i, t, n),
    f = B(s, a, n),
    u = B(a, c, n);
  return B(f, u, n);
}
const Fe = /* @__PURE__ */ new Map();
function wn(e, t) {
  t = t || {};
  const n = e + JSON.stringify(t);
  let r = Fe.get(n);
  return r || ((r = new Intl.NumberFormat(e, t)), Fe.set(n, r)), r;
}
function Ar(e, t, n) {
  return wn(t, n).format(e);
}
const xn = function (e, t) {
    return {
      x(n) {
        return e + e + t - n;
      },
      setWidth(n) {
        t = n;
      },
      textAlign(n) {
        return n === "center" ? n : n === "right" ? "left" : "right";
      },
      xPlus(n, r) {
        return n - r;
      },
      leftForLtr(n, r) {
        return n - r;
      },
    };
  },
  Mn = function () {
    return {
      x(e) {
        return e;
      },
      setWidth(e) {},
      textAlign(e) {
        return e;
      },
      xPlus(e, t) {
        return e + t;
      },
      leftForLtr(e, t) {
        return e;
      },
    };
  };
function Er(e, t, n) {
  return e ? xn(t, n) : Mn();
}
function Br(e, t) {
  let n, r;
  (t === "ltr" || t === "rtl") &&
    ((n = e.canvas.style),
    (r = [n.getPropertyValue("direction"), n.getPropertyPriority("direction")]),
    n.setProperty("direction", t, "important"),
    (e.prevTextDirection = r));
}
function jr(e, t) {
  t !== void 0 && (delete e.prevTextDirection, e.canvas.style.setProperty("direction", t[0], t[1]));
}
function Qe(e) {
  return e === "angle"
    ? {
        between: dt,
        compare: lt,
        normalize: P,
      }
    : {
        between: ht,
        compare: (t, n) => t - n,
        normalize: t => t,
      };
}
function Ce({ start: e, end: t, count: n, loop: r, style: o }) {
  return {
    start: e % n,
    end: t % n,
    loop: r && (t - e + 1) % n === 0,
    style: o,
  };
}
function Sn(e, t, n) {
  const { property: r, start: o, end: i } = n,
    { between: s, normalize: a } = Qe(r),
    c = t.length;
  let { start: f, end: u, loop: d } = e,
    g,
    h;
  if (d) {
    for (f += c, u += c, g = 0, h = c; g < h && s(a(t[f % c][r]), o, i); ++g) f--, u--;
    (f %= c), (u %= c);
  }
  return u < f && (u += c), { start: f, end: u, loop: d, style: e.style };
}
function On(e, t, n) {
  if (!n) return [e];
  const { property: r, start: o, end: i } = n,
    s = t.length,
    { compare: a, between: c, normalize: f } = Qe(r),
    { start: u, end: d, loop: g, style: h } = Sn(e, t, n),
    l = [];
  let p = !1,
    _ = null,
    m,
    I,
    v;
  const Ge = () => c(o, v, m) && a(o, v) !== 0,
    Je = () => a(i, m) === 0 || c(i, v, m),
    et = () => p || Ge(),
    tt = () => !p || Je();
  for (let A = u, ge = u; A <= d; ++A)
    (I = t[A % s]),
      !I.skip &&
        ((m = f(I[r])),
        m !== v &&
          ((p = c(m, o, i)),
          _ === null && et() && (_ = a(m, o) === 0 ? A : ge),
          _ !== null &&
            tt() &&
            (l.push(Ce({ start: _, end: A, loop: g, count: s, style: h })), (_ = null)),
          (ge = A),
          (v = m)));
  return _ !== null && l.push(Ce({ start: _, end: d, loop: g, count: s, style: h })), l;
}
function vr(e, t) {
  const n = [],
    r = e.segments;
  for (let o = 0; o < r.length; o++) {
    const i = On(r[o], e.points, t);
    i.length && n.push(...i);
  }
  return n;
}
function Pn(e, t, n, r) {
  let o = 0,
    i = t - 1;
  if (n && !r) for (; o < t && !e[o].skip; ) o++;
  for (; o < t && e[o].skip; ) o++;
  for (o %= t, n && (i += o); i > o && e[i % t].skip; ) i--;
  return (i %= t), { start: o, end: i };
}
function Tn(e, t, n, r) {
  const o = e.length,
    i = [];
  let s = t,
    a = e[t],
    c;
  for (c = t + 1; c <= n; ++c) {
    const f = e[c % o];
    f.skip || f.stop
      ? a.skip ||
        ((r = !1), i.push({ start: t % o, end: (c - 1) % o, loop: r }), (t = s = f.stop ? c : null))
      : ((s = c), a.skip && (t = c)),
      (a = f);
  }
  return s !== null && i.push({ start: t % o, end: s % o, loop: r }), i;
}
function Lr(e, t) {
  const n = e.points,
    r = e.options.spanGaps,
    o = n.length;
  if (!o) return [];
  const i = !!e._loop,
    { start: s, end: a } = Pn(n, o, i, r);
  if (r === !0) return Ie(e, [{ start: s, end: a, loop: i }], n, t);
  const c = a < s ? a + o : a,
    f = !!e._fullLoop && s === 0 && a === o - 1;
  return Ie(e, Tn(n, s, c, f), n, t);
}
function Ie(e, t, n, r) {
  return !r || !r.setContext || !n ? t : kn(e, t, n, r);
}
function kn(e, t, n, r) {
  const o = e._chart.getContext(),
    i = Ae(e.options),
    {
      _datasetIndex: s,
      options: { spanGaps: a },
    } = e,
    c = n.length,
    f = [];
  let u = i,
    d = t[0].start,
    g = d;
  function h(l, p, _, m) {
    const I = a ? -1 : 1;
    if (l !== p) {
      for (l += c; n[l % c].skip; ) l -= I;
      for (; n[p % c].skip; ) p += I;
      l % c !== p % c &&
        (f.push({ start: l % c, end: p % c, loop: _, style: m }), (u = m), (d = p % c));
    }
  }
  for (const l of t) {
    d = a ? d : l.start;
    let p = n[d % c],
      _;
    for (g = d + 1; g <= l.end; g++) {
      const m = n[g % c];
      (_ = Ae(
        r.setContext(
          Zt(o, {
            type: "segment",
            p0: p,
            p1: m,
            p0DataIndex: (g - 1) % c,
            p1DataIndex: g % c,
            datasetIndex: s,
          })
        )
      )),
        Rn(_, u) && h(d, g - 1, l.loop, u),
        (p = m),
        (u = _);
    }
    d < g - 1 && h(d, g - 1, l.loop, u);
  }
  return f;
}
function Ae(e) {
  return {
    backgroundColor: e.backgroundColor,
    borderCapStyle: e.borderCapStyle,
    borderDash: e.borderDash,
    borderDashOffset: e.borderDashOffset,
    borderJoinStyle: e.borderJoinStyle,
    borderWidth: e.borderWidth,
    borderColor: e.borderColor,
  };
}
function Rn(e, t) {
  return t && JSON.stringify(e) !== JSON.stringify(t);
}
export {
  Te as $,
  Wn as A,
  In as B,
  En as C,
  xr as D,
  ae as E,
  $n as F,
  Pe as G,
  x as H,
  Kn as I,
  cr as J,
  pr as K,
  lr as L,
  br as M,
  dr as N,
  _r as O,
  b as P,
  Bn as Q,
  tr as R,
  nr as S,
  S as T,
  Lt as U,
  U as V,
  ve as W,
  Pr as X,
  Vn as Y,
  D as Z,
  Gn as _,
  wr as a,
  Kt as a$,
  Xn as a0,
  Tr as a1,
  gn as a2,
  Fr as a3,
  Jn as a4,
  Rr as a5,
  Or as a6,
  Nt as a7,
  Z as a8,
  J as a9,
  Er as aA,
  Br as aB,
  rr as aC,
  jr as aD,
  Ht as aE,
  Fn as aF,
  pe as aG,
  Hn as aH,
  Nn as aI,
  Dn as aJ,
  Le as aK,
  qn as aL,
  ar as aM,
  Un as aN,
  Ne as aO,
  $e as aP,
  oe as aQ,
  V as aR,
  rt as aS,
  it as aT,
  at as aV,
  Dt as aW,
  fn as aX,
  dn as aY,
  bn as aZ,
  Xe as aa,
  Qt as ab,
  ot as ac,
  Cn as ad,
  er as ae,
  kr as af,
  fr as ag,
  vn as ah,
  jn as ai,
  Ln as aj,
  ht as ak,
  qe as al,
  Sr as am,
  Lr as an,
  vr as ao,
  Cr as ap,
  Ir as aq,
  B as ar,
  hr as as,
  gr as at,
  ur as au,
  mr as av,
  Ut as aw,
  yr as ax,
  On as ay,
  P as az,
  M as b,
  ct as b0,
  Q as b1,
  ft as b2,
  L as b3,
  me as b4,
  lt as b5,
  sr as c,
  Yt as d,
  ne as e,
  je as f,
  Ee as g,
  Zt as h,
  y as i,
  C as j,
  K as k,
  Zn as l,
  An as m,
  nt as n,
  Ar as o,
  dt as p,
  or as q,
  gt as r,
  ye as s,
  zn as t,
  Qn as u,
  R as v,
  ir as w,
  Yn as x,
  Mr as y,
  ut as z,
};
