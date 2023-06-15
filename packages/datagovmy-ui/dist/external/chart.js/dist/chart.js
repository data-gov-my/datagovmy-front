import {
  d as A,
  b as j,
  q as qi,
  w as Ji,
  k as R,
  a0 as Zi,
  T as N,
  p as Zt,
  P as pt,
  am as Fs,
  an as zs,
  ao as Qi,
  $ as Fe,
  au as Se,
  av as Ft,
  aG as Is,
  Q as T,
  ax as gt,
  aA as kt,
  O as W,
  i as F,
  K as $,
  aB as ts,
  aD as es,
  ai as Qt,
  v as C,
  g as V,
  t as J,
  aH as is,
  o as Vt,
  z as q,
  C as E,
  az as zt,
  H as G,
  M as Mt,
  ac as qt,
  aN as Bs,
  _ as ss,
  u as Xe,
  l as Vs,
  f as St,
  j as It,
  s as ht,
  m as Ns,
  n as Ws,
  y as ns,
  x as wt,
  B as K,
  D as Hs,
  E as X,
  F as ze,
  G as Ke,
  I as js,
  J as dt,
  L as se,
  N as ne,
  ad as $s,
  ae as Ys,
  af as Ge,
  ag as qe,
  ah as Je,
  a8 as oe,
  h as mt,
  aj as Us,
  U as Pt,
  ak as at,
  ap as Xs,
  aq as Ks,
  ar as Gs,
  aF as it,
  aO as qs,
  Z as we,
  a as jt,
  e as Ze,
  W as Js,
  a6 as os,
  a7 as Qe,
  a9 as ti,
  aa as Zs,
  ab as Qs,
  aw as tn,
  S as U,
  aC as en,
  R as as,
  aI as ei,
  aJ as sn,
  aK as ge,
  aM as nn,
  r as on,
  c as ii,
  V as an,
  X as ft,
  a1 as rn,
  a2 as rs,
  as as ln,
  at as hn,
  ay as cn,
  aE as dn,
  aL as si,
  A as un,
  a3 as ni,
  al as fn,
  Y as gn,
  a5 as pn,
  a4 as ls,
} from "./chunks/helpers.segment.js";
/*!
 * Chart.js v3.9.1
 * https://www.chartjs.org
 * (c) 2022 Chart.js Contributors
 * Released under the MIT License
 */
class mn {
  constructor() {
    (this._request = null),
      (this._charts = /* @__PURE__ */ new Map()),
      (this._running = !1),
      (this._lastDate = void 0);
  }
  _notify(t, e, i, s) {
    const o = e.listeners[s],
      a = e.duration;
    o.forEach(r =>
      r({
        chart: t,
        initial: e.initial,
        numSteps: a,
        currentStep: Math.min(i - e.start, a),
      })
    );
  }
  _refresh() {
    this._request ||
      ((this._running = !0),
      (this._request = on.call(window, () => {
        this._update(), (this._request = null), this._running && this._refresh();
      })));
  }
  _update(t = Date.now()) {
    let e = 0;
    this._charts.forEach((i, s) => {
      if (!i.running || !i.items.length) return;
      const o = i.items;
      let a = o.length - 1,
        r = !1,
        l;
      for (; a >= 0; --a)
        (l = o[a]),
          l._active
            ? (l._total > i.duration && (i.duration = l._total), l.tick(t), (r = !0))
            : ((o[a] = o[o.length - 1]), o.pop());
      r && (s.draw(), this._notify(s, i, t, "progress")),
        o.length || ((i.running = !1), this._notify(s, i, t, "complete"), (i.initial = !1)),
        (e += o.length);
    }),
      (this._lastDate = t),
      e === 0 && (this._running = !1);
  }
  _getAnims(t) {
    const e = this._charts;
    let i = e.get(t);
    return (
      i ||
        ((i = {
          running: !1,
          initial: !0,
          items: [],
          listeners: {
            complete: [],
            progress: [],
          },
        }),
        e.set(t, i)),
      i
    );
  }
  listen(t, e, i) {
    this._getAnims(t).listeners[e].push(i);
  }
  add(t, e) {
    !e || !e.length || this._getAnims(t).items.push(...e);
  }
  has(t) {
    return this._getAnims(t).items.length > 0;
  }
  start(t) {
    const e = this._charts.get(t);
    e &&
      ((e.running = !0),
      (e.start = Date.now()),
      (e.duration = e.items.reduce((i, s) => Math.max(i, s._duration), 0)),
      this._refresh());
  }
  running(t) {
    if (!this._running) return !1;
    const e = this._charts.get(t);
    return !(!e || !e.running || !e.items.length);
  }
  stop(t) {
    const e = this._charts.get(t);
    if (!e || !e.items.length) return;
    const i = e.items;
    let s = i.length - 1;
    for (; s >= 0; --s) i[s].cancel();
    (e.items = []), this._notify(t, e, Date.now(), "complete");
  }
  remove(t) {
    return this._charts.delete(t);
  }
}
var st = new mn();
const oi = "transparent",
  bn = {
    boolean(n, t, e) {
      return e > 0.5 ? t : n;
    },
    color(n, t, e) {
      const i = ii(n || oi),
        s = i.valid && ii(t || oi);
      return s && s.valid ? s.mix(i, e).hexString() : t;
    },
    number(n, t, e) {
      return n + (t - n) * e;
    },
  };
class xn {
  constructor(t, e, i, s) {
    const o = e[i];
    s = jt([t.to, s, o, t.from]);
    const a = jt([t.from, o, s]);
    (this._active = !0),
      (this._fn = t.fn || bn[t.type || typeof a]),
      (this._easing = Ze[t.easing] || Ze.linear),
      (this._start = Math.floor(Date.now() + (t.delay || 0))),
      (this._duration = this._total = Math.floor(t.duration)),
      (this._loop = !!t.loop),
      (this._target = e),
      (this._prop = i),
      (this._from = a),
      (this._to = s),
      (this._promises = void 0);
  }
  active() {
    return this._active;
  }
  update(t, e, i) {
    if (this._active) {
      this._notify(!1);
      const s = this._target[this._prop],
        o = i - this._start,
        a = this._duration - o;
      (this._start = i),
        (this._duration = Math.floor(Math.max(a, t.duration))),
        (this._total += o),
        (this._loop = !!t.loop),
        (this._to = jt([t.to, e, s, t.from])),
        (this._from = jt([t.from, s, e]));
    }
  }
  cancel() {
    this._active && (this.tick(Date.now()), (this._active = !1), this._notify(!1));
  }
  tick(t) {
    const e = t - this._start,
      i = this._duration,
      s = this._prop,
      o = this._from,
      a = this._loop,
      r = this._to;
    let l;
    if (((this._active = o !== r && (a || e < i)), !this._active)) {
      (this._target[s] = r), this._notify(!0);
      return;
    }
    if (e < 0) {
      this._target[s] = o;
      return;
    }
    (l = (e / i) % 2),
      (l = a && l > 1 ? 2 - l : l),
      (l = this._easing(Math.min(1, Math.max(0, l)))),
      (this._target[s] = this._fn(o, r, l));
  }
  wait() {
    const t = this._promises || (this._promises = []);
    return new Promise((e, i) => {
      t.push({ res: e, rej: i });
    });
  }
  _notify(t) {
    const e = t ? "res" : "rej",
      i = this._promises || [];
    for (let s = 0; s < i.length; s++) i[s][e]();
  }
}
const _n = ["x", "y", "borderWidth", "radius", "tension"],
  yn = ["color", "borderColor", "backgroundColor"];
A.set("animation", {
  delay: void 0,
  duration: 1e3,
  easing: "easeOutQuart",
  fn: void 0,
  from: void 0,
  loop: void 0,
  to: void 0,
  type: void 0,
});
const vn = Object.keys(A.animation);
A.describe("animation", {
  _fallback: !1,
  _indexable: !1,
  _scriptable: n => n !== "onProgress" && n !== "onComplete" && n !== "fn",
});
A.set("animations", {
  colors: {
    type: "color",
    properties: yn,
  },
  numbers: {
    type: "number",
    properties: _n,
  },
});
A.describe("animations", {
  _fallback: "animation",
});
A.set("transitions", {
  active: {
    animation: {
      duration: 400,
    },
  },
  resize: {
    animation: {
      duration: 0,
    },
  },
  show: {
    animations: {
      colors: {
        from: "transparent",
      },
      visible: {
        type: "boolean",
        duration: 0,
      },
    },
  },
  hide: {
    animations: {
      colors: {
        to: "transparent",
      },
      visible: {
        type: "boolean",
        easing: "linear",
        fn: n => n | 0,
      },
    },
  },
});
class hs {
  constructor(t, e) {
    (this._chart = t), (this._properties = /* @__PURE__ */ new Map()), this.configure(e);
  }
  configure(t) {
    if (!F(t)) return;
    const e = this._properties;
    Object.getOwnPropertyNames(t).forEach(i => {
      const s = t[i];
      if (!F(s)) return;
      const o = {};
      for (const a of vn) o[a] = s[a];
      ((j(s.properties) && s.properties) || [i]).forEach(a => {
        (a === i || !e.has(a)) && e.set(a, o);
      });
    });
  }
  _animateOptions(t, e) {
    const i = e.options,
      s = Mn(t, i);
    if (!s) return [];
    const o = this._createAnimations(s, i);
    return (
      i.$shared &&
        kn(t.options.$animations, i).then(
          () => {
            t.options = i;
          },
          () => {}
        ),
      o
    );
  }
  _createAnimations(t, e) {
    const i = this._properties,
      s = [],
      o = t.$animations || (t.$animations = {}),
      a = Object.keys(e),
      r = Date.now();
    let l;
    for (l = a.length - 1; l >= 0; --l) {
      const h = a[l];
      if (h.charAt(0) === "$") continue;
      if (h === "options") {
        s.push(...this._animateOptions(t, e));
        continue;
      }
      const c = e[h];
      let d = o[h];
      const u = i.get(h);
      if (d)
        if (u && d.active()) {
          d.update(u, c, r);
          continue;
        } else d.cancel();
      if (!u || !u.duration) {
        t[h] = c;
        continue;
      }
      (o[h] = d = new xn(u, t, h, c)), s.push(d);
    }
    return s;
  }
  update(t, e) {
    if (this._properties.size === 0) {
      Object.assign(t, e);
      return;
    }
    const i = this._createAnimations(t, e);
    if (i.length) return st.add(this._chart, i), !0;
  }
}
function kn(n, t) {
  const e = [],
    i = Object.keys(t);
  for (let s = 0; s < i.length; s++) {
    const o = n[i[s]];
    o && o.active() && e.push(o.wait());
  }
  return Promise.all(e);
}
function Mn(n, t) {
  if (!t) return;
  let e = n.options;
  if (!e) {
    n.options = t;
    return;
  }
  return e.$shared && (n.options = e = Object.assign({}, e, { $shared: !1, $animations: {} })), e;
}
function ai(n, t) {
  const e = (n && n.options) || {},
    i = e.reverse,
    s = e.min === void 0 ? t : 0,
    o = e.max === void 0 ? t : 0;
  return {
    start: i ? o : s,
    end: i ? s : o,
  };
}
function Sn(n, t, e) {
  if (e === !1) return !1;
  const i = ai(n, e),
    s = ai(t, e);
  return {
    top: s.end,
    right: i.end,
    bottom: s.start,
    left: i.start,
  };
}
function wn(n) {
  let t, e, i, s;
  return (
    F(n) ? ((t = n.top), (e = n.right), (i = n.bottom), (s = n.left)) : (t = e = i = s = n),
    {
      top: t,
      right: e,
      bottom: i,
      left: s,
      disabled: n === !1,
    }
  );
}
function cs(n, t) {
  const e = [],
    i = n._getSortedDatasetMetas(t);
  let s, o;
  for (s = 0, o = i.length; s < o; ++s) e.push(i[s].index);
  return e;
}
function ri(n, t, e, i = {}) {
  const s = n.keys,
    o = i.mode === "single";
  let a, r, l, h;
  if (t !== null) {
    for (a = 0, r = s.length; a < r; ++a) {
      if (((l = +s[a]), l === e)) {
        if (i.all) continue;
        break;
      }
      (h = n.values[l]), V(h) && (o || t === 0 || ht(t) === ht(h)) && (t += h);
    }
    return t;
  }
}
function Pn(n) {
  const t = Object.keys(n),
    e = new Array(t.length);
  let i, s, o;
  for (i = 0, s = t.length; i < s; ++i)
    (o = t[i]),
      (e[i] = {
        x: o,
        y: n[o],
      });
  return e;
}
function li(n, t) {
  const e = n && n.options.stacked;
  return e || (e === void 0 && t.stack !== void 0);
}
function Dn(n, t, e) {
  return `${n.id}.${t.id}.${e.stack || e.type}`;
}
function Cn(n) {
  const { min: t, max: e, minDefined: i, maxDefined: s } = n.getUserBounds();
  return {
    min: i ? t : Number.NEGATIVE_INFINITY,
    max: s ? e : Number.POSITIVE_INFINITY,
  };
}
function An(n, t, e) {
  const i = n[t] || (n[t] = {});
  return i[e] || (i[e] = {});
}
function hi(n, t, e, i) {
  for (const s of t.getMatchingVisibleMetas(i).reverse()) {
    const o = n[s.index];
    if ((e && o > 0) || (!e && o < 0)) return s.index;
  }
  return null;
}
function ci(n, t) {
  const { chart: e, _cachedMeta: i } = n,
    s = e._stacks || (e._stacks = {}),
    { iScale: o, vScale: a, index: r } = i,
    l = o.axis,
    h = a.axis,
    c = Dn(o, a, i),
    d = t.length;
  let u;
  for (let f = 0; f < d; ++f) {
    const g = t[f],
      { [l]: p, [h]: m } = g,
      b = g._stacks || (g._stacks = {});
    (u = b[h] = An(s, c, p)),
      (u[r] = m),
      (u._top = hi(u, a, !0, i.type)),
      (u._bottom = hi(u, a, !1, i.type));
  }
}
function pe(n, t) {
  const e = n.scales;
  return Object.keys(e)
    .filter(i => e[i].axis === t)
    .shift();
}
function Ln(n, t) {
  return mt(n, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: "default",
    type: "dataset",
  });
}
function On(n, t, e) {
  return mt(n, {
    active: !1,
    dataIndex: t,
    parsed: void 0,
    raw: void 0,
    element: e,
    index: t,
    mode: "default",
    type: "data",
  });
}
function Ct(n, t) {
  const e = n.controller.index,
    i = n.vScale && n.vScale.axis;
  if (i) {
    t = t || n._parsed;
    for (const s of t) {
      const o = s._stacks;
      if (!o || o[i] === void 0 || o[i][e] === void 0) return;
      delete o[i][e];
    }
  }
}
const me = n => n === "reset" || n === "none",
  di = (n, t) => (t ? n : Object.assign({}, n)),
  Tn = (n, t, e) => n && !t.hidden && t._stacked && { keys: cs(e, !0), values: null };
class Z {
  constructor(t, e) {
    (this.chart = t),
      (this._ctx = t.ctx),
      (this.index = e),
      (this._cachedDataOpts = {}),
      (this._cachedMeta = this.getMeta()),
      (this._type = this._cachedMeta.type),
      (this.options = void 0),
      (this._parsing = !1),
      (this._data = void 0),
      (this._objectData = void 0),
      (this._sharedOptions = void 0),
      (this._drawStart = void 0),
      (this._drawCount = void 0),
      (this.enableOptionSharing = !1),
      (this.supportsDecimation = !1),
      (this.$context = void 0),
      (this._syncList = []),
      this.initialize();
  }
  initialize() {
    const t = this._cachedMeta;
    this.configure(), this.linkScales(), (t._stacked = li(t.vScale, t)), this.addElements();
  }
  updateIndex(t) {
    this.index !== t && Ct(this._cachedMeta), (this.index = t);
  }
  linkScales() {
    const t = this.chart,
      e = this._cachedMeta,
      i = this.getDataset(),
      s = (d, u, f, g) => (d === "x" ? u : d === "r" ? g : f),
      o = (e.xAxisID = C(i.xAxisID, pe(t, "x"))),
      a = (e.yAxisID = C(i.yAxisID, pe(t, "y"))),
      r = (e.rAxisID = C(i.rAxisID, pe(t, "r"))),
      l = e.indexAxis,
      h = (e.iAxisID = s(l, o, a, r)),
      c = (e.vAxisID = s(l, a, o, r));
    (e.xScale = this.getScaleForId(o)),
      (e.yScale = this.getScaleForId(a)),
      (e.rScale = this.getScaleForId(r)),
      (e.iScale = this.getScaleForId(h)),
      (e.vScale = this.getScaleForId(c));
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(t) {
    return this.chart.scales[t];
  }
  _getOtherScale(t) {
    const e = this._cachedMeta;
    return t === e.iScale ? e.vScale : e.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const t = this._cachedMeta;
    this._data && Xe(this._data, this), t._stacked && Ct(t);
  }
  _dataCheck() {
    const t = this.getDataset(),
      e = t.data || (t.data = []),
      i = this._data;
    if (F(e)) this._data = Pn(e);
    else if (i !== e) {
      if (i) {
        Xe(i, this);
        const s = this._cachedMeta;
        Ct(s), (s._parsed = []);
      }
      e && Object.isExtensible(e) && Vs(e, this), (this._syncList = []), (this._data = e);
    }
  }
  addElements() {
    const t = this._cachedMeta;
    this._dataCheck(), this.datasetElementType && (t.dataset = new this.datasetElementType());
  }
  buildOrUpdateElements(t) {
    const e = this._cachedMeta,
      i = this.getDataset();
    let s = !1;
    this._dataCheck();
    const o = e._stacked;
    (e._stacked = li(e.vScale, e)),
      e.stack !== i.stack && ((s = !0), Ct(e), (e.stack = i.stack)),
      this._resyncElements(t),
      (s || o !== e._stacked) && ci(this, e._parsed);
  }
  configure() {
    const t = this.chart.config,
      e = t.datasetScopeKeys(this._type),
      i = t.getOptionScopes(this.getDataset(), e, !0);
    (this.options = t.createResolver(i, this.getContext())),
      (this._parsing = this.options.parsing),
      (this._cachedDataOpts = {});
  }
  parse(t, e) {
    const { _cachedMeta: i, _data: s } = this,
      { iScale: o, _stacked: a } = i,
      r = o.axis;
    let l = t === 0 && e === s.length ? !0 : i._sorted,
      h = t > 0 && i._parsed[t - 1],
      c,
      d,
      u;
    if (this._parsing === !1) (i._parsed = s), (i._sorted = !0), (u = s);
    else {
      j(s[t])
        ? (u = this.parseArrayData(i, s, t, e))
        : F(s[t])
        ? (u = this.parseObjectData(i, s, t, e))
        : (u = this.parsePrimitiveData(i, s, t, e));
      const f = () => d[r] === null || (h && d[r] < h[r]);
      for (c = 0; c < e; ++c) (i._parsed[c + t] = d = u[c]), l && (f() && (l = !1), (h = d));
      i._sorted = l;
    }
    a && ci(this, u);
  }
  parsePrimitiveData(t, e, i, s) {
    const { iScale: o, vScale: a } = t,
      r = o.axis,
      l = a.axis,
      h = o.getLabels(),
      c = o === a,
      d = new Array(s);
    let u, f, g;
    for (u = 0, f = s; u < f; ++u)
      (g = u + i),
        (d[u] = {
          [r]: c || o.parse(h[g], g),
          [l]: a.parse(e[g], g),
        });
    return d;
  }
  parseArrayData(t, e, i, s) {
    const { xScale: o, yScale: a } = t,
      r = new Array(s);
    let l, h, c, d;
    for (l = 0, h = s; l < h; ++l)
      (c = l + i),
        (d = e[c]),
        (r[l] = {
          x: o.parse(d[0], c),
          y: a.parse(d[1], c),
        });
    return r;
  }
  parseObjectData(t, e, i, s) {
    const { xScale: o, yScale: a } = t,
      { xAxisKey: r = "x", yAxisKey: l = "y" } = this._parsing,
      h = new Array(s);
    let c, d, u, f;
    for (c = 0, d = s; c < d; ++c)
      (u = c + i),
        (f = e[u]),
        (h[c] = {
          x: o.parse(St(f, r), u),
          y: a.parse(St(f, l), u),
        });
    return h;
  }
  getParsed(t) {
    return this._cachedMeta._parsed[t];
  }
  getDataElement(t) {
    return this._cachedMeta.data[t];
  }
  applyStack(t, e, i) {
    const s = this.chart,
      o = this._cachedMeta,
      a = e[t.axis],
      r = {
        keys: cs(s, !0),
        values: e._stacks[t.axis],
      };
    return ri(r, a, o.index, { mode: i });
  }
  updateRangeFromParsed(t, e, i, s) {
    const o = i[e.axis];
    let a = o === null ? NaN : o;
    const r = s && i._stacks[e.axis];
    s && r && ((s.values = r), (a = ri(s, o, this._cachedMeta.index))),
      (t.min = Math.min(t.min, a)),
      (t.max = Math.max(t.max, a));
  }
  getMinMax(t, e) {
    const i = this._cachedMeta,
      s = i._parsed,
      o = i._sorted && t === i.iScale,
      a = s.length,
      r = this._getOtherScale(t),
      l = Tn(e, i, this.chart),
      h = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
      { min: c, max: d } = Cn(r);
    let u, f;
    function g() {
      f = s[u];
      const p = f[r.axis];
      return !V(f[t.axis]) || c > p || d < p;
    }
    for (u = 0; u < a && !(!g() && (this.updateRangeFromParsed(h, t, f, l), o)); ++u);
    if (o) {
      for (u = a - 1; u >= 0; --u)
        if (!g()) {
          this.updateRangeFromParsed(h, t, f, l);
          break;
        }
    }
    return h;
  }
  getAllParsedValues(t) {
    const e = this._cachedMeta._parsed,
      i = [];
    let s, o, a;
    for (s = 0, o = e.length; s < o; ++s) (a = e[s][t.axis]), V(a) && i.push(a);
    return i;
  }
  getMaxOverflow() {
    return !1;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      i = e.iScale,
      s = e.vScale,
      o = this.getParsed(t);
    return {
      label: i ? "" + i.getLabelForValue(o[i.axis]) : "",
      value: s ? "" + s.getLabelForValue(o[s.axis]) : "",
    };
  }
  _update(t) {
    const e = this._cachedMeta;
    this.update(t || "default"),
      (e._clip = wn(C(this.options.clip, Sn(e.xScale, e.yScale, this.getMaxOverflow()))));
  }
  update(t) {}
  draw() {
    const t = this._ctx,
      e = this.chart,
      i = this._cachedMeta,
      s = i.data || [],
      o = e.chartArea,
      a = [],
      r = this._drawStart || 0,
      l = this._drawCount || s.length - r,
      h = this.options.drawActiveElementsOnTop;
    let c;
    for (i.dataset && i.dataset.draw(t, o, r, l), c = r; c < r + l; ++c) {
      const d = s[c];
      d.hidden || (d.active && h ? a.push(d) : d.draw(t, o));
    }
    for (c = 0; c < a.length; ++c) a[c].draw(t, o);
  }
  getStyle(t, e) {
    const i = e ? "active" : "default";
    return t === void 0 && this._cachedMeta.dataset
      ? this.resolveDatasetElementOptions(i)
      : this.resolveDataElementOptions(t || 0, i);
  }
  getContext(t, e, i) {
    const s = this.getDataset();
    let o;
    if (t >= 0 && t < this._cachedMeta.data.length) {
      const a = this._cachedMeta.data[t];
      (o = a.$context || (a.$context = On(this.getContext(), t, a))),
        (o.parsed = this.getParsed(t)),
        (o.raw = s.data[t]),
        (o.index = o.dataIndex = t);
    } else
      (o = this.$context || (this.$context = Ln(this.chart.getContext(), this.index))),
        (o.dataset = s),
        (o.index = o.datasetIndex = this.index);
    return (o.active = !!e), (o.mode = i), o;
  }
  resolveDatasetElementOptions(t) {
    return this._resolveElementOptions(this.datasetElementType.id, t);
  }
  resolveDataElementOptions(t, e) {
    return this._resolveElementOptions(this.dataElementType.id, e, t);
  }
  _resolveElementOptions(t, e = "default", i) {
    const s = e === "active",
      o = this._cachedDataOpts,
      a = t + "-" + e,
      r = o[a],
      l = this.enableOptionSharing && It(i);
    if (r) return di(r, l);
    const h = this.chart.config,
      c = h.datasetElementScopeKeys(this._type, t),
      d = s ? [`${t}Hover`, "hover", t, ""] : [t, ""],
      u = h.getOptionScopes(this.getDataset(), c),
      f = Object.keys(A.elements[t]),
      g = () => this.getContext(i, s),
      p = h.resolveNamedOptions(u, f, g, d);
    return p.$shared && ((p.$shared = l), (o[a] = Object.freeze(di(p, l)))), p;
  }
  _resolveAnimations(t, e, i) {
    const s = this.chart,
      o = this._cachedDataOpts,
      a = `animation-${e}`,
      r = o[a];
    if (r) return r;
    let l;
    if (s.options.animation !== !1) {
      const c = this.chart.config,
        d = c.datasetAnimationScopeKeys(this._type, e),
        u = c.getOptionScopes(this.getDataset(), d);
      l = c.createResolver(u, this.getContext(t, i, e));
    }
    const h = new hs(s, l && l.animations);
    return l && l._cacheable && (o[a] = Object.freeze(h)), h;
  }
  getSharedOptions(t) {
    if (t.$shared) return this._sharedOptions || (this._sharedOptions = Object.assign({}, t));
  }
  includeOptions(t, e) {
    return !e || me(t) || this.chart._animationsDisabled;
  }
  _getSharedOptions(t, e) {
    const i = this.resolveDataElementOptions(t, e),
      s = this._sharedOptions,
      o = this.getSharedOptions(i),
      a = this.includeOptions(e, o) || o !== s;
    return this.updateSharedOptions(o, e, i), { sharedOptions: o, includeOptions: a };
  }
  updateElement(t, e, i, s) {
    me(s) ? Object.assign(t, i) : this._resolveAnimations(e, s).update(t, i);
  }
  updateSharedOptions(t, e, i) {
    t && !me(e) && this._resolveAnimations(void 0, e).update(t, i);
  }
  _setStyle(t, e, i, s) {
    t.active = s;
    const o = this.getStyle(e, s);
    this._resolveAnimations(e, i, s).update(t, {
      options: (!s && this.getSharedOptions(o)) || o,
    });
  }
  removeHoverStyle(t, e, i) {
    this._setStyle(t, i, "active", !1);
  }
  setHoverStyle(t, e, i) {
    this._setStyle(t, i, "active", !0);
  }
  _removeDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !1);
  }
  _setDatasetHoverStyle() {
    const t = this._cachedMeta.dataset;
    t && this._setStyle(t, void 0, "active", !0);
  }
  _resyncElements(t) {
    const e = this._data,
      i = this._cachedMeta.data;
    for (const [r, l, h] of this._syncList) this[r](l, h);
    this._syncList = [];
    const s = i.length,
      o = e.length,
      a = Math.min(o, s);
    a && this.parse(0, a),
      o > s ? this._insertElements(s, o - s, t) : o < s && this._removeElements(o, s - o);
  }
  _insertElements(t, e, i = !0) {
    const s = this._cachedMeta,
      o = s.data,
      a = t + e;
    let r;
    const l = h => {
      for (h.length += e, r = h.length - 1; r >= a; r--) h[r] = h[r - e];
    };
    for (l(o), r = t; r < a; ++r) o[r] = new this.dataElementType();
    this._parsing && l(s._parsed), this.parse(t, e), i && this.updateElements(o, t, e, "reset");
  }
  updateElements(t, e, i, s) {}
  _removeElements(t, e) {
    const i = this._cachedMeta;
    if (this._parsing) {
      const s = i._parsed.splice(t, e);
      i._stacked && Ct(i, s);
    }
    i.data.splice(t, e);
  }
  _sync(t) {
    if (this._parsing) this._syncList.push(t);
    else {
      const [e, i, s] = t;
      this[e](i, s);
    }
    this.chart._dataChanges.push([this.index, ...t]);
  }
  _onDataPush() {
    const t = arguments.length;
    this._sync(["_insertElements", this.getDataset().data.length - t, t]);
  }
  _onDataPop() {
    this._sync(["_removeElements", this._cachedMeta.data.length - 1, 1]);
  }
  _onDataShift() {
    this._sync(["_removeElements", 0, 1]);
  }
  _onDataSplice(t, e) {
    e && this._sync(["_removeElements", t, e]);
    const i = arguments.length - 2;
    i && this._sync(["_insertElements", t, i]);
  }
  _onDataUnshift() {
    this._sync(["_insertElements", 0, arguments.length]);
  }
}
Z.defaults = {};
Z.prototype.datasetElementType = null;
Z.prototype.dataElementType = null;
function En(n, t) {
  if (!n._cache.$bar) {
    const e = n.getMatchingVisibleMetas(t);
    let i = [];
    for (let s = 0, o = e.length; s < o; s++) i = i.concat(e[s].controller.getAllParsedValues(n));
    n._cache.$bar = ss(i.sort((s, o) => s - o));
  }
  return n._cache.$bar;
}
function Rn(n) {
  const t = n.iScale,
    e = En(t, n.type);
  let i = t._length,
    s,
    o,
    a,
    r;
  const l = () => {
    a === 32767 || a === -32768 || (It(r) && (i = Math.min(i, Math.abs(a - r) || i)), (r = a));
  };
  for (s = 0, o = e.length; s < o; ++s) (a = t.getPixelForValue(e[s])), l();
  for (r = void 0, s = 0, o = t.ticks.length; s < o; ++s) (a = t.getPixelForTick(s)), l();
  return i;
}
function Fn(n, t, e, i) {
  const s = e.barThickness;
  let o, a;
  return (
    R(s) ? ((o = t.min * e.categoryPercentage), (a = e.barPercentage)) : ((o = s * i), (a = 1)),
    {
      chunk: o / i,
      ratio: a,
      start: t.pixels[n] - o / 2,
    }
  );
}
function zn(n, t, e, i) {
  const s = t.pixels,
    o = s[n];
  let a = n > 0 ? s[n - 1] : null,
    r = n < s.length - 1 ? s[n + 1] : null;
  const l = e.categoryPercentage;
  a === null && (a = o - (r === null ? t.end - t.start : r - o)), r === null && (r = o + o - a);
  const h = o - ((o - Math.min(a, r)) / 2) * l;
  return {
    chunk: ((Math.abs(r - a) / 2) * l) / i,
    ratio: e.barPercentage,
    start: h,
  };
}
function In(n, t, e, i) {
  const s = e.parse(n[0], i),
    o = e.parse(n[1], i),
    a = Math.min(s, o),
    r = Math.max(s, o);
  let l = a,
    h = r;
  Math.abs(a) > Math.abs(r) && ((l = r), (h = a)),
    (t[e.axis] = h),
    (t._custom = {
      barStart: l,
      barEnd: h,
      start: s,
      end: o,
      min: a,
      max: r,
    });
}
function ds(n, t, e, i) {
  return j(n) ? In(n, t, e, i) : (t[e.axis] = e.parse(n, i)), t;
}
function ui(n, t, e, i) {
  const s = n.iScale,
    o = n.vScale,
    a = s.getLabels(),
    r = s === o,
    l = [];
  let h, c, d, u;
  for (h = e, c = e + i; h < c; ++h)
    (u = t[h]), (d = {}), (d[s.axis] = r || s.parse(a[h], h)), l.push(ds(u, d, o, h));
  return l;
}
function be(n) {
  return n && n.barStart !== void 0 && n.barEnd !== void 0;
}
function Bn(n, t, e) {
  return n !== 0 ? ht(n) : (t.isHorizontal() ? 1 : -1) * (t.min >= e ? 1 : -1);
}
function Vn(n) {
  let t, e, i, s, o;
  return (
    n.horizontal
      ? ((t = n.base > n.x), (e = "left"), (i = "right"))
      : ((t = n.base < n.y), (e = "bottom"), (i = "top")),
    t ? ((s = "end"), (o = "start")) : ((s = "start"), (o = "end")),
    { start: e, end: i, reverse: t, top: s, bottom: o }
  );
}
function Nn(n, t, e, i) {
  let s = t.borderSkipped;
  const o = {};
  if (!s) {
    n.borderSkipped = o;
    return;
  }
  if (s === !0) {
    n.borderSkipped = { top: !0, right: !0, bottom: !0, left: !0 };
    return;
  }
  const { start: a, end: r, reverse: l, top: h, bottom: c } = Vn(n);
  s === "middle" &&
    e &&
    ((n.enableBorderRadius = !0),
    (e._top || 0) === i
      ? (s = h)
      : (e._bottom || 0) === i
      ? (s = c)
      : ((o[fi(c, a, r, l)] = !0), (s = h))),
    (o[fi(s, a, r, l)] = !0),
    (n.borderSkipped = o);
}
function fi(n, t, e, i) {
  return i ? ((n = Wn(n, t, e)), (n = gi(n, e, t))) : (n = gi(n, t, e)), n;
}
function Wn(n, t, e) {
  return n === t ? e : n === e ? t : n;
}
function gi(n, t, e) {
  return n === "start" ? t : n === "end" ? e : n;
}
function Hn(n, { inflateAmount: t }, e) {
  n.inflateAmount = t === "auto" ? (e === 1 ? 0.33 : 0) : t;
}
class Ie extends Z {
  parsePrimitiveData(t, e, i, s) {
    return ui(t, e, i, s);
  }
  parseArrayData(t, e, i, s) {
    return ui(t, e, i, s);
  }
  parseObjectData(t, e, i, s) {
    const { iScale: o, vScale: a } = t,
      { xAxisKey: r = "x", yAxisKey: l = "y" } = this._parsing,
      h = o.axis === "x" ? r : l,
      c = a.axis === "x" ? r : l,
      d = [];
    let u, f, g, p;
    for (u = i, f = i + s; u < f; ++u)
      (p = e[u]), (g = {}), (g[o.axis] = o.parse(St(p, h), u)), d.push(ds(St(p, c), g, a, u));
    return d;
  }
  updateRangeFromParsed(t, e, i, s) {
    super.updateRangeFromParsed(t, e, i, s);
    const o = i._custom;
    o &&
      e === this._cachedMeta.vScale &&
      ((t.min = Math.min(t.min, o.min)), (t.max = Math.max(t.max, o.max)));
  }
  getMaxOverflow() {
    return 0;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      { iScale: i, vScale: s } = e,
      o = this.getParsed(t),
      a = o._custom,
      r = be(a) ? "[" + a.start + ", " + a.end + "]" : "" + s.getLabelForValue(o[s.axis]);
    return {
      label: "" + i.getLabelForValue(o[i.axis]),
      value: r,
    };
  }
  initialize() {
    (this.enableOptionSharing = !0), super.initialize();
    const t = this._cachedMeta;
    t.stack = this.getDataset().stack;
  }
  update(t) {
    const e = this._cachedMeta;
    this.updateElements(e.data, 0, e.data.length, t);
  }
  updateElements(t, e, i, s) {
    const o = s === "reset",
      {
        index: a,
        _cachedMeta: { vScale: r },
      } = this,
      l = r.getBasePixel(),
      h = r.isHorizontal(),
      c = this._getRuler(),
      { sharedOptions: d, includeOptions: u } = this._getSharedOptions(e, s);
    for (let f = e; f < e + i; f++) {
      const g = this.getParsed(f),
        p = o || R(g[r.axis]) ? { base: l, head: l } : this._calculateBarValuePixels(f),
        m = this._calculateBarIndexPixels(f, c),
        b = (g._stacks || {})[r.axis],
        x = {
          horizontal: h,
          base: p.base,
          enableBorderRadius: !b || be(g._custom) || a === b._top || a === b._bottom,
          x: h ? p.head : m.center,
          y: h ? m.center : p.head,
          height: h ? m.size : Math.abs(p.size),
          width: h ? Math.abs(p.size) : m.size,
        };
      u && (x.options = d || this.resolveDataElementOptions(f, t[f].active ? "active" : s));
      const v = x.options || t[f].options;
      Nn(x, v, b, a), Hn(x, v, c.ratio), this.updateElement(t[f], f, x, s);
    }
  }
  _getStacks(t, e) {
    const { iScale: i } = this._cachedMeta,
      s = i.getMatchingVisibleMetas(this._type).filter(l => l.controller.options.grouped),
      o = i.options.stacked,
      a = [],
      r = l => {
        const h = l.controller.getParsed(e),
          c = h && h[l.vScale.axis];
        if (R(c) || isNaN(c)) return !0;
      };
    for (const l of s)
      if (
        !(e !== void 0 && r(l)) &&
        ((o === !1 || a.indexOf(l.stack) === -1 || (o === void 0 && l.stack === void 0)) &&
          a.push(l.stack),
        l.index === t)
      )
        break;
    return a.length || a.push(void 0), a;
  }
  _getStackCount(t) {
    return this._getStacks(void 0, t).length;
  }
  _getStackIndex(t, e, i) {
    const s = this._getStacks(t, i),
      o = e !== void 0 ? s.indexOf(e) : -1;
    return o === -1 ? s.length - 1 : o;
  }
  _getRuler() {
    const t = this.options,
      e = this._cachedMeta,
      i = e.iScale,
      s = [];
    let o, a;
    for (o = 0, a = e.data.length; o < a; ++o)
      s.push(i.getPixelForValue(this.getParsed(o)[i.axis], o));
    const r = t.barThickness;
    return {
      min: r || Rn(e),
      pixels: s,
      start: i._startPixel,
      end: i._endPixel,
      stackCount: this._getStackCount(),
      scale: i,
      grouped: t.grouped,
      ratio: r ? 1 : t.categoryPercentage * t.barPercentage,
    };
  }
  _calculateBarValuePixels(t) {
    const {
        _cachedMeta: { vScale: e, _stacked: i },
        options: { base: s, minBarLength: o },
      } = this,
      a = s || 0,
      r = this.getParsed(t),
      l = r._custom,
      h = be(l);
    let c = r[e.axis],
      d = 0,
      u = i ? this.applyStack(e, r, i) : c,
      f,
      g;
    u !== c && ((d = u - c), (u = c)),
      h &&
        ((c = l.barStart),
        (u = l.barEnd - l.barStart),
        c !== 0 && ht(c) !== ht(l.barEnd) && (d = 0),
        (d += c));
    const p = !R(s) && !h ? s : d;
    let m = e.getPixelForValue(p);
    if (
      (this.chart.getDataVisibility(t) ? (f = e.getPixelForValue(d + u)) : (f = m),
      (g = f - m),
      Math.abs(g) < o)
    ) {
      (g = Bn(g, e, a) * o), c === a && (m -= g / 2);
      const b = e.getPixelForDecimal(0),
        x = e.getPixelForDecimal(1),
        v = Math.min(b, x),
        y = Math.max(b, x);
      (m = Math.max(Math.min(m, y), v)), (f = m + g);
    }
    if (m === e.getPixelForValue(a)) {
      const b = (ht(g) * e.getLineWidthForValue(a)) / 2;
      (m += b), (g -= b);
    }
    return {
      size: g,
      base: m,
      head: f,
      center: f + g / 2,
    };
  }
  _calculateBarIndexPixels(t, e) {
    const i = e.scale,
      s = this.options,
      o = s.skipNull,
      a = C(s.maxBarThickness, 1 / 0);
    let r, l;
    if (e.grouped) {
      const h = o ? this._getStackCount(t) : e.stackCount,
        c = s.barThickness === "flex" ? zn(t, e, s, h) : Fn(t, e, s, h),
        d = this._getStackIndex(this.index, this._cachedMeta.stack, o ? t : void 0);
      (r = c.start + c.chunk * d + c.chunk / 2), (l = Math.min(a, c.chunk * c.ratio));
    } else
      (r = i.getPixelForValue(this.getParsed(t)[i.axis], t)), (l = Math.min(a, e.min * e.ratio));
    return {
      base: r - l / 2,
      head: r + l / 2,
      center: r,
      size: l,
    };
  }
  draw() {
    const t = this._cachedMeta,
      e = t.vScale,
      i = t.data,
      s = i.length;
    let o = 0;
    for (; o < s; ++o) this.getParsed(o)[e.axis] !== null && i[o].draw(this._ctx);
  }
}
Ie.id = "bar";
Ie.defaults = {
  datasetElementType: !1,
  dataElementType: "bar",
  categoryPercentage: 0.8,
  barPercentage: 0.9,
  grouped: !0,
  animations: {
    numbers: {
      type: "number",
      properties: ["x", "y", "base", "width", "height"],
    },
  },
};
Ie.overrides = {
  scales: {
    _index_: {
      type: "category",
      offset: !0,
      grid: {
        offset: !0,
      },
    },
    _value_: {
      type: "linear",
      beginAtZero: !0,
    },
  },
};
class Be extends Z {
  initialize() {
    (this.enableOptionSharing = !0), super.initialize();
  }
  parsePrimitiveData(t, e, i, s) {
    const o = super.parsePrimitiveData(t, e, i, s);
    for (let a = 0; a < o.length; a++) o[a]._custom = this.resolveDataElementOptions(a + i).radius;
    return o;
  }
  parseArrayData(t, e, i, s) {
    const o = super.parseArrayData(t, e, i, s);
    for (let a = 0; a < o.length; a++) {
      const r = e[i + a];
      o[a]._custom = C(r[2], this.resolveDataElementOptions(a + i).radius);
    }
    return o;
  }
  parseObjectData(t, e, i, s) {
    const o = super.parseObjectData(t, e, i, s);
    for (let a = 0; a < o.length; a++) {
      const r = e[i + a];
      o[a]._custom = C(r && r.r && +r.r, this.resolveDataElementOptions(a + i).radius);
    }
    return o;
  }
  getMaxOverflow() {
    const t = this._cachedMeta.data;
    let e = 0;
    for (let i = t.length - 1; i >= 0; --i)
      e = Math.max(e, t[i].size(this.resolveDataElementOptions(i)) / 2);
    return e > 0 && e;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      { xScale: i, yScale: s } = e,
      o = this.getParsed(t),
      a = i.getLabelForValue(o.x),
      r = s.getLabelForValue(o.y),
      l = o._custom;
    return {
      label: e.label,
      value: "(" + a + ", " + r + (l ? ", " + l : "") + ")",
    };
  }
  update(t) {
    const e = this._cachedMeta.data;
    this.updateElements(e, 0, e.length, t);
  }
  updateElements(t, e, i, s) {
    const o = s === "reset",
      { iScale: a, vScale: r } = this._cachedMeta,
      { sharedOptions: l, includeOptions: h } = this._getSharedOptions(e, s),
      c = a.axis,
      d = r.axis;
    for (let u = e; u < e + i; u++) {
      const f = t[u],
        g = !o && this.getParsed(u),
        p = {},
        m = (p[c] = o ? a.getPixelForDecimal(0.5) : a.getPixelForValue(g[c])),
        b = (p[d] = o ? r.getBasePixel() : r.getPixelForValue(g[d]));
      (p.skip = isNaN(m) || isNaN(b)),
        h &&
          ((p.options = l || this.resolveDataElementOptions(u, f.active ? "active" : s)),
          o && (p.options.radius = 0)),
        this.updateElement(f, u, p, s);
    }
  }
  resolveDataElementOptions(t, e) {
    const i = this.getParsed(t);
    let s = super.resolveDataElementOptions(t, e);
    s.$shared && (s = Object.assign({}, s, { $shared: !1 }));
    const o = s.radius;
    return e !== "active" && (s.radius = 0), (s.radius += C(i && i._custom, o)), s;
  }
}
Be.id = "bubble";
Be.defaults = {
  datasetElementType: !1,
  dataElementType: "point",
  animations: {
    numbers: {
      type: "number",
      properties: ["x", "y", "borderWidth", "radius"],
    },
  },
};
Be.overrides = {
  scales: {
    x: {
      type: "linear",
    },
    y: {
      type: "linear",
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        title() {
          return "";
        },
      },
    },
  },
};
function jn(n, t, e) {
  let i = 1,
    s = 1,
    o = 0,
    a = 0;
  if (t < N) {
    const r = n,
      l = r + t,
      h = Math.cos(r),
      c = Math.sin(r),
      d = Math.cos(l),
      u = Math.sin(l),
      f = (v, y, _) => (Zt(v, r, l, !0) ? 1 : Math.max(y, y * e, _, _ * e)),
      g = (v, y, _) => (Zt(v, r, l, !0) ? -1 : Math.min(y, y * e, _, _ * e)),
      p = f(0, h, d),
      m = f(G, c, u),
      b = g(pt, h, d),
      x = g(pt + G, c, u);
    (i = (p - b) / 2), (s = (m - x) / 2), (o = -(p + b) / 2), (a = -(m + x) / 2);
  }
  return { ratioX: i, ratioY: s, offsetX: o, offsetY: a };
}
class Nt extends Z {
  constructor(t, e) {
    super(t, e),
      (this.enableOptionSharing = !0),
      (this.innerRadius = void 0),
      (this.outerRadius = void 0),
      (this.offsetX = void 0),
      (this.offsetY = void 0);
  }
  linkScales() {}
  parse(t, e) {
    const i = this.getDataset().data,
      s = this._cachedMeta;
    if (this._parsing === !1) s._parsed = i;
    else {
      let o = l => +i[l];
      if (F(i[t])) {
        const { key: l = "value" } = this._parsing;
        o = h => +St(i[h], l);
      }
      let a, r;
      for (a = t, r = t + e; a < r; ++a) s._parsed[a] = o(a);
    }
  }
  _getRotation() {
    return J(this.options.rotation - 90);
  }
  _getCircumference() {
    return J(this.options.circumference);
  }
  _getRotationExtents() {
    let t = N,
      e = -N;
    for (let i = 0; i < this.chart.data.datasets.length; ++i)
      if (this.chart.isDatasetVisible(i)) {
        const s = this.chart.getDatasetMeta(i).controller,
          o = s._getRotation(),
          a = s._getCircumference();
        (t = Math.min(t, o)), (e = Math.max(e, o + a));
      }
    return {
      rotation: t,
      circumference: e - t,
    };
  }
  update(t) {
    const e = this.chart,
      { chartArea: i } = e,
      s = this._cachedMeta,
      o = s.data,
      a = this.getMaxBorderWidth() + this.getMaxOffset(o) + this.options.spacing,
      r = Math.max((Math.min(i.width, i.height) - a) / 2, 0),
      l = Math.min(Ns(this.options.cutout, r), 1),
      h = this._getRingWeight(this.index),
      { circumference: c, rotation: d } = this._getRotationExtents(),
      { ratioX: u, ratioY: f, offsetX: g, offsetY: p } = jn(d, c, l),
      m = (i.width - a) / u,
      b = (i.height - a) / f,
      x = Math.max(Math.min(m, b) / 2, 0),
      v = Ws(this.options.radius, x),
      y = Math.max(v * l, 0),
      _ = (v - y) / this._getVisibleDatasetWeightTotal();
    (this.offsetX = g * v),
      (this.offsetY = p * v),
      (s.total = this.calculateTotal()),
      (this.outerRadius = v - _ * this._getRingWeightOffset(this.index)),
      (this.innerRadius = Math.max(this.outerRadius - _ * h, 0)),
      this.updateElements(o, 0, o.length, t);
  }
  _circumference(t, e) {
    const i = this.options,
      s = this._cachedMeta,
      o = this._getCircumference();
    return (e && i.animation.animateRotate) ||
      !this.chart.getDataVisibility(t) ||
      s._parsed[t] === null ||
      s.data[t].hidden
      ? 0
      : this.calculateCircumference((s._parsed[t] * o) / N);
  }
  updateElements(t, e, i, s) {
    const o = s === "reset",
      a = this.chart,
      r = a.chartArea,
      h = a.options.animation,
      c = (r.left + r.right) / 2,
      d = (r.top + r.bottom) / 2,
      u = o && h.animateScale,
      f = u ? 0 : this.innerRadius,
      g = u ? 0 : this.outerRadius,
      { sharedOptions: p, includeOptions: m } = this._getSharedOptions(e, s);
    let b = this._getRotation(),
      x;
    for (x = 0; x < e; ++x) b += this._circumference(x, o);
    for (x = e; x < e + i; ++x) {
      const v = this._circumference(x, o),
        y = t[x],
        _ = {
          x: c + this.offsetX,
          y: d + this.offsetY,
          startAngle: b,
          endAngle: b + v,
          circumference: v,
          outerRadius: g,
          innerRadius: f,
        };
      m && (_.options = p || this.resolveDataElementOptions(x, y.active ? "active" : s)),
        (b += v),
        this.updateElement(y, x, _, s);
    }
  }
  calculateTotal() {
    const t = this._cachedMeta,
      e = t.data;
    let i = 0,
      s;
    for (s = 0; s < e.length; s++) {
      const o = t._parsed[s];
      o !== null &&
        !isNaN(o) &&
        this.chart.getDataVisibility(s) &&
        !e[s].hidden &&
        (i += Math.abs(o));
    }
    return i;
  }
  calculateCircumference(t) {
    const e = this._cachedMeta.total;
    return e > 0 && !isNaN(t) ? N * (Math.abs(t) / e) : 0;
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      i = this.chart,
      s = i.data.labels || [],
      o = Vt(e._parsed[t], i.options.locale);
    return {
      label: s[t] || "",
      value: o,
    };
  }
  getMaxBorderWidth(t) {
    let e = 0;
    const i = this.chart;
    let s, o, a, r, l;
    if (!t) {
      for (s = 0, o = i.data.datasets.length; s < o; ++s)
        if (i.isDatasetVisible(s)) {
          (a = i.getDatasetMeta(s)), (t = a.data), (r = a.controller);
          break;
        }
    }
    if (!t) return 0;
    for (s = 0, o = t.length; s < o; ++s)
      (l = r.resolveDataElementOptions(s)),
        l.borderAlign !== "inner" && (e = Math.max(e, l.borderWidth || 0, l.hoverBorderWidth || 0));
    return e;
  }
  getMaxOffset(t) {
    let e = 0;
    for (let i = 0, s = t.length; i < s; ++i) {
      const o = this.resolveDataElementOptions(i);
      e = Math.max(e, o.offset || 0, o.hoverOffset || 0);
    }
    return e;
  }
  _getRingWeightOffset(t) {
    let e = 0;
    for (let i = 0; i < t; ++i) this.chart.isDatasetVisible(i) && (e += this._getRingWeight(i));
    return e;
  }
  _getRingWeight(t) {
    return Math.max(C(this.chart.data.datasets[t].weight, 1), 0);
  }
  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
  }
}
Nt.id = "doughnut";
Nt.defaults = {
  datasetElementType: !1,
  dataElementType: "arc",
  animation: {
    animateRotate: !0,
    animateScale: !1,
  },
  animations: {
    numbers: {
      type: "number",
      properties: [
        "circumference",
        "endAngle",
        "innerRadius",
        "outerRadius",
        "startAngle",
        "x",
        "y",
        "offset",
        "borderWidth",
        "spacing",
      ],
    },
  },
  cutout: "50%",
  rotation: 0,
  circumference: 360,
  radius: "100%",
  spacing: 0,
  indexAxis: "r",
};
Nt.descriptors = {
  _scriptable: n => n !== "spacing",
  _indexable: n => n !== "spacing",
};
Nt.overrides = {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(n) {
          const t = n.data;
          if (t.labels.length && t.datasets.length) {
            const {
              labels: { pointStyle: e },
            } = n.legend.options;
            return t.labels.map((i, s) => {
              const a = n.getDatasetMeta(0).controller.getStyle(s);
              return {
                text: i,
                fillStyle: a.backgroundColor,
                strokeStyle: a.borderColor,
                lineWidth: a.borderWidth,
                pointStyle: e,
                hidden: !n.getDataVisibility(s),
                index: s,
              };
            });
          }
          return [];
        },
      },
      onClick(n, t, e) {
        e.chart.toggleDataVisibility(t.index), e.chart.update();
      },
    },
    tooltip: {
      callbacks: {
        title() {
          return "";
        },
        label(n) {
          let t = n.label;
          const e = ": " + n.formattedValue;
          return j(t) ? ((t = t.slice()), (t[0] += e)) : (t += e), t;
        },
      },
    },
  },
};
class Ve extends Z {
  initialize() {
    (this.enableOptionSharing = !0), (this.supportsDecimation = !0), super.initialize();
  }
  update(t) {
    const e = this._cachedMeta,
      { dataset: i, data: s = [], _dataset: o } = e,
      a = this.chart._animationsDisabled;
    let { start: r, count: l } = qi(e, s, a);
    (this._drawStart = r),
      (this._drawCount = l),
      Ji(e) && ((r = 0), (l = s.length)),
      (i._chart = this.chart),
      (i._datasetIndex = this.index),
      (i._decimated = !!o._decimated),
      (i.points = s);
    const h = this.resolveDatasetElementOptions(t);
    this.options.showLine || (h.borderWidth = 0),
      (h.segment = this.options.segment),
      this.updateElement(
        i,
        void 0,
        {
          animated: !a,
          options: h,
        },
        t
      ),
      this.updateElements(s, r, l, t);
  }
  updateElements(t, e, i, s) {
    const o = s === "reset",
      { iScale: a, vScale: r, _stacked: l, _dataset: h } = this._cachedMeta,
      { sharedOptions: c, includeOptions: d } = this._getSharedOptions(e, s),
      u = a.axis,
      f = r.axis,
      { spanGaps: g, segment: p } = this.options,
      m = wt(g) ? g : Number.POSITIVE_INFINITY,
      b = this.chart._animationsDisabled || o || s === "none";
    let x = e > 0 && this.getParsed(e - 1);
    for (let v = e; v < e + i; ++v) {
      const y = t[v],
        _ = this.getParsed(v),
        M = b ? y : {},
        k = R(_[f]),
        P = (M[u] = a.getPixelForValue(_[u], v)),
        S = (M[f] =
          o || k ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, _, l) : _[f], v));
      (M.skip = isNaN(P) || isNaN(S) || k),
        (M.stop = v > 0 && Math.abs(_[u] - x[u]) > m),
        p && ((M.parsed = _), (M.raw = h.data[v])),
        d && (M.options = c || this.resolveDataElementOptions(v, y.active ? "active" : s)),
        b || this.updateElement(y, v, M, s),
        (x = _);
    }
  }
  getMaxOverflow() {
    const t = this._cachedMeta,
      e = t.dataset,
      i = (e.options && e.options.borderWidth) || 0,
      s = t.data || [];
    if (!s.length) return i;
    const o = s[0].size(this.resolveDataElementOptions(0)),
      a = s[s.length - 1].size(this.resolveDataElementOptions(s.length - 1));
    return Math.max(i, o, a) / 2;
  }
  draw() {
    const t = this._cachedMeta;
    t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis), super.draw();
  }
}
Ve.id = "line";
Ve.defaults = {
  datasetElementType: "line",
  dataElementType: "point",
  showLine: !0,
  spanGaps: !1,
};
Ve.overrides = {
  scales: {
    _index_: {
      type: "category",
    },
    _value_: {
      type: "linear",
    },
  },
};
class Ne extends Z {
  constructor(t, e) {
    super(t, e), (this.innerRadius = void 0), (this.outerRadius = void 0);
  }
  getLabelAndValue(t) {
    const e = this._cachedMeta,
      i = this.chart,
      s = i.data.labels || [],
      o = Vt(e._parsed[t].r, i.options.locale);
    return {
      label: s[t] || "",
      value: o,
    };
  }
  parseObjectData(t, e, i, s) {
    return ns.bind(this)(t, e, i, s);
  }
  update(t) {
    const e = this._cachedMeta.data;
    this._updateRadius(), this.updateElements(e, 0, e.length, t);
  }
  getMinMax() {
    const t = this._cachedMeta,
      e = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
    return (
      t.data.forEach((i, s) => {
        const o = this.getParsed(s).r;
        !isNaN(o) &&
          this.chart.getDataVisibility(s) &&
          (o < e.min && (e.min = o), o > e.max && (e.max = o));
      }),
      e
    );
  }
  _updateRadius() {
    const t = this.chart,
      e = t.chartArea,
      i = t.options,
      s = Math.min(e.right - e.left, e.bottom - e.top),
      o = Math.max(s / 2, 0),
      a = Math.max(i.cutoutPercentage ? (o / 100) * i.cutoutPercentage : 1, 0),
      r = (o - a) / t.getVisibleDatasetCount();
    (this.outerRadius = o - r * this.index), (this.innerRadius = this.outerRadius - r);
  }
  updateElements(t, e, i, s) {
    const o = s === "reset",
      a = this.chart,
      l = a.options.animation,
      h = this._cachedMeta.rScale,
      c = h.xCenter,
      d = h.yCenter,
      u = h.getIndexAngle(0) - 0.5 * pt;
    let f = u,
      g;
    const p = 360 / this.countVisibleElements();
    for (g = 0; g < e; ++g) f += this._computeAngle(g, s, p);
    for (g = e; g < e + i; g++) {
      const m = t[g];
      let b = f,
        x = f + this._computeAngle(g, s, p),
        v = a.getDataVisibility(g) ? h.getDistanceFromCenterForValue(this.getParsed(g).r) : 0;
      (f = x), o && (l.animateScale && (v = 0), l.animateRotate && (b = x = u));
      const y = {
        x: c,
        y: d,
        innerRadius: 0,
        outerRadius: v,
        startAngle: b,
        endAngle: x,
        options: this.resolveDataElementOptions(g, m.active ? "active" : s),
      };
      this.updateElement(m, g, y, s);
    }
  }
  countVisibleElements() {
    const t = this._cachedMeta;
    let e = 0;
    return (
      t.data.forEach((i, s) => {
        !isNaN(this.getParsed(s).r) && this.chart.getDataVisibility(s) && e++;
      }),
      e
    );
  }
  _computeAngle(t, e, i) {
    return this.chart.getDataVisibility(t) ? J(this.resolveDataElementOptions(t, e).angle || i) : 0;
  }
}
Ne.id = "polarArea";
Ne.defaults = {
  dataElementType: "arc",
  animation: {
    animateRotate: !0,
    animateScale: !0,
  },
  animations: {
    numbers: {
      type: "number",
      properties: ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"],
    },
  },
  indexAxis: "r",
  startAngle: 0,
};
Ne.overrides = {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(n) {
          const t = n.data;
          if (t.labels.length && t.datasets.length) {
            const {
              labels: { pointStyle: e },
            } = n.legend.options;
            return t.labels.map((i, s) => {
              const a = n.getDatasetMeta(0).controller.getStyle(s);
              return {
                text: i,
                fillStyle: a.backgroundColor,
                strokeStyle: a.borderColor,
                lineWidth: a.borderWidth,
                pointStyle: e,
                hidden: !n.getDataVisibility(s),
                index: s,
              };
            });
          }
          return [];
        },
      },
      onClick(n, t, e) {
        e.chart.toggleDataVisibility(t.index), e.chart.update();
      },
    },
    tooltip: {
      callbacks: {
        title() {
          return "";
        },
        label(n) {
          return n.chart.data.labels[n.dataIndex] + ": " + n.formattedValue;
        },
      },
    },
  },
  scales: {
    r: {
      type: "radialLinear",
      angleLines: {
        display: !1,
      },
      beginAtZero: !0,
      grid: {
        circular: !0,
      },
      pointLabels: {
        display: !1,
      },
      startAngle: 0,
    },
  },
};
class us extends Nt {}
us.id = "pie";
us.defaults = {
  cutout: 0,
  rotation: 0,
  circumference: 360,
  radius: "100%",
};
class We extends Z {
  getLabelAndValue(t) {
    const e = this._cachedMeta.vScale,
      i = this.getParsed(t);
    return {
      label: e.getLabels()[t],
      value: "" + e.getLabelForValue(i[e.axis]),
    };
  }
  parseObjectData(t, e, i, s) {
    return ns.bind(this)(t, e, i, s);
  }
  update(t) {
    const e = this._cachedMeta,
      i = e.dataset,
      s = e.data || [],
      o = e.iScale.getLabels();
    if (((i.points = s), t !== "resize")) {
      const a = this.resolveDatasetElementOptions(t);
      this.options.showLine || (a.borderWidth = 0);
      const r = {
        _loop: !0,
        _fullLoop: o.length === s.length,
        options: a,
      };
      this.updateElement(i, void 0, r, t);
    }
    this.updateElements(s, 0, s.length, t);
  }
  updateElements(t, e, i, s) {
    const o = this._cachedMeta.rScale,
      a = s === "reset";
    for (let r = e; r < e + i; r++) {
      const l = t[r],
        h = this.resolveDataElementOptions(r, l.active ? "active" : s),
        c = o.getPointPositionForValue(r, this.getParsed(r).r),
        d = a ? o.xCenter : c.x,
        u = a ? o.yCenter : c.y,
        f = {
          x: d,
          y: u,
          angle: c.angle,
          skip: isNaN(d) || isNaN(u),
          options: h,
        };
      this.updateElement(l, r, f, s);
    }
  }
}
We.id = "radar";
We.defaults = {
  datasetElementType: "line",
  dataElementType: "point",
  indexAxis: "r",
  showLine: !0,
  elements: {
    line: {
      fill: "start",
    },
  },
};
We.overrides = {
  aspectRatio: 1,
  scales: {
    r: {
      type: "radialLinear",
    },
  },
};
class et {
  constructor() {
    (this.x = void 0),
      (this.y = void 0),
      (this.active = !1),
      (this.options = void 0),
      (this.$animations = void 0);
  }
  tooltipPosition(t) {
    const { x: e, y: i } = this.getProps(["x", "y"], t);
    return { x: e, y: i };
  }
  hasValue() {
    return wt(this.x) && wt(this.y);
  }
  getProps(t, e) {
    const i = this.$animations;
    if (!e || !i) return this;
    const s = {};
    return (
      t.forEach(o => {
        s[o] = i[o] && i[o].active() ? i[o]._to : this[o];
      }),
      s
    );
  }
}
et.defaults = {};
et.defaultRoutes = void 0;
const fs = {
  values(n) {
    return j(n) ? n : "" + n;
  },
  numeric(n, t, e) {
    if (n === 0) return "0";
    const i = this.chart.options.locale;
    let s,
      o = n;
    if (e.length > 1) {
      const h = Math.max(Math.abs(e[0].value), Math.abs(e[e.length - 1].value));
      (h < 1e-4 || h > 1e15) && (s = "scientific"), (o = $n(n, e));
    }
    const a = q(Math.abs(o)),
      r = Math.max(Math.min(-1 * Math.floor(a), 20), 0),
      l = { notation: s, minimumFractionDigits: r, maximumFractionDigits: r };
    return Object.assign(l, this.options.ticks.format), Vt(n, i, l);
  },
  logarithmic(n, t, e) {
    if (n === 0) return "0";
    const i = n / Math.pow(10, Math.floor(q(n)));
    return i === 1 || i === 2 || i === 5 ? fs.numeric.call(this, n, t, e) : "";
  },
};
function $n(n, t) {
  let e = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return Math.abs(e) >= 1 && n !== Math.floor(n) && (e = n - Math.floor(n)), e;
}
var ae = { formatters: fs };
A.set("scale", {
  display: !0,
  offset: !1,
  reverse: !1,
  beginAtZero: !1,
  bounds: "ticks",
  grace: 0,
  grid: {
    display: !0,
    lineWidth: 1,
    drawBorder: !0,
    drawOnChartArea: !0,
    drawTicks: !0,
    tickLength: 8,
    tickWidth: (n, t) => t.lineWidth,
    tickColor: (n, t) => t.color,
    offset: !1,
    borderDash: [],
    borderDashOffset: 0,
    borderWidth: 1,
  },
  title: {
    display: !1,
    text: "",
    padding: {
      top: 4,
      bottom: 4,
    },
  },
  ticks: {
    minRotation: 0,
    maxRotation: 50,
    mirror: !1,
    textStrokeWidth: 0,
    textStrokeColor: "",
    padding: 3,
    display: !0,
    autoSkip: !0,
    autoSkipPadding: 3,
    labelOffset: 0,
    callback: ae.formatters.values,
    minor: {},
    major: {},
    align: "center",
    crossAlign: "near",
    showLabelBackdrop: !1,
    backdropColor: "rgba(255, 255, 255, 0.75)",
    backdropPadding: 2,
  },
});
A.route("scale.ticks", "color", "", "color");
A.route("scale.grid", "color", "", "borderColor");
A.route("scale.grid", "borderColor", "", "borderColor");
A.route("scale.title", "color", "", "color");
A.describe("scale", {
  _fallback: !1,
  _scriptable: n =>
    !n.startsWith("before") && !n.startsWith("after") && n !== "callback" && n !== "parser",
  _indexable: n => n !== "borderDash" && n !== "tickBorderDash",
});
A.describe("scales", {
  _fallback: "scale",
});
A.describe("scale.ticks", {
  _scriptable: n => n !== "backdropPadding" && n !== "callback",
  _indexable: n => n !== "backdropPadding",
});
function Yn(n, t) {
  const e = n.options.ticks,
    i = e.maxTicksLimit || Un(n),
    s = e.major.enabled ? Kn(t) : [],
    o = s.length,
    a = s[0],
    r = s[o - 1],
    l = [];
  if (o > i) return Gn(t, l, s, o / i), l;
  const h = Xn(s, t, i);
  if (o > 0) {
    let c, d;
    const u = o > 1 ? Math.round((r - a) / (o - 1)) : null;
    for ($t(t, l, h, R(u) ? 0 : a - u, a), c = 0, d = o - 1; c < d; c++)
      $t(t, l, h, s[c], s[c + 1]);
    return $t(t, l, h, r, R(u) ? t.length : r + u), l;
  }
  return $t(t, l, h), l;
}
function Un(n) {
  const t = n.options.offset,
    e = n._tickSize(),
    i = n._length / e + (t ? 0 : 1),
    s = n._maxLength / e;
  return Math.floor(Math.min(i, s));
}
function Xn(n, t, e) {
  const i = qn(n),
    s = t.length / e;
  if (!i) return Math.max(s, 1);
  const o = un(i);
  for (let a = 0, r = o.length - 1; a < r; a++) {
    const l = o[a];
    if (l > s) return l;
  }
  return Math.max(s, 1);
}
function Kn(n) {
  const t = [];
  let e, i;
  for (e = 0, i = n.length; e < i; e++) n[e].major && t.push(e);
  return t;
}
function Gn(n, t, e, i) {
  let s = 0,
    o = e[0],
    a;
  for (i = Math.ceil(i), a = 0; a < n.length; a++) a === o && (t.push(n[a]), s++, (o = e[s * i]));
}
function $t(n, t, e, i, s) {
  const o = C(i, 0),
    a = Math.min(C(s, n.length), n.length);
  let r = 0,
    l,
    h,
    c;
  for (e = Math.ceil(e), s && ((l = s - i), (e = l / Math.floor(l / e))), c = o; c < 0; )
    r++, (c = Math.round(o + r * e));
  for (h = Math.max(o, 0); h < a; h++) h === c && (t.push(n[h]), r++, (c = Math.round(o + r * e)));
}
function qn(n) {
  const t = n.length;
  let e, i;
  if (t < 2) return !1;
  for (i = n[0], e = 1; e < t; ++e) if (n[e] - n[e - 1] !== i) return !1;
  return i;
}
const Jn = n => (n === "left" ? "right" : n === "right" ? "left" : n),
  pi = (n, t, e) => (t === "top" || t === "left" ? n[t] + e : n[t] - e);
function mi(n, t) {
  const e = [],
    i = n.length / t,
    s = n.length;
  let o = 0;
  for (; o < s; o += i) e.push(n[Math.floor(o)]);
  return e;
}
function Zn(n, t, e) {
  const i = n.ticks.length,
    s = Math.min(t, i - 1),
    o = n._startPixel,
    a = n._endPixel,
    r = 1e-6;
  let l = n.getPixelForTick(s),
    h;
  if (
    !(
      e &&
      (i === 1
        ? (h = Math.max(l - o, a - l))
        : t === 0
        ? (h = (n.getPixelForTick(1) - l) / 2)
        : (h = (l - n.getPixelForTick(s - 1)) / 2),
      (l += s < t ? h : -h),
      l < o - r || l > a + r)
    )
  )
    return l;
}
function Qn(n, t) {
  T(n, e => {
    const i = e.gc,
      s = i.length / 2;
    let o;
    if (s > t) {
      for (o = 0; o < s; ++o) delete e.data[i[o]];
      i.splice(0, s);
    }
  });
}
function At(n) {
  return n.drawTicks ? n.tickLength : 0;
}
function bi(n, t) {
  if (!n.display) return 0;
  const e = W(n.font, t),
    i = $(n.padding);
  return (j(n.text) ? n.text.length : 1) * e.lineHeight + i.height;
}
function to(n, t) {
  return mt(n, {
    scale: t,
    type: "scale",
  });
}
function eo(n, t, e) {
  return mt(n, {
    tick: e,
    index: t,
    type: "tick",
  });
}
function io(n, t, e) {
  let i = as(n);
  return ((e && t !== "right") || (!e && t === "right")) && (i = Jn(i)), i;
}
function so(n, t, e, i) {
  const { top: s, left: o, bottom: a, right: r, chart: l } = n,
    { chartArea: h, scales: c } = l;
  let d = 0,
    u,
    f,
    g;
  const p = a - s,
    m = r - o;
  if (n.isHorizontal()) {
    if (((f = U(i, o, r)), F(e))) {
      const b = Object.keys(e)[0],
        x = e[b];
      g = c[b].getPixelForValue(x) + p - t;
    } else e === "center" ? (g = (h.bottom + h.top) / 2 + p - t) : (g = pi(n, e, t));
    u = r - o;
  } else {
    if (F(e)) {
      const b = Object.keys(e)[0],
        x = e[b];
      f = c[b].getPixelForValue(x) - m + t;
    } else e === "center" ? (f = (h.left + h.right) / 2 - m + t) : (f = pi(n, e, t));
    (g = U(i, a, s)), (d = e === "left" ? -G : G);
  }
  return { titleX: f, titleY: g, maxWidth: u, rotation: d };
}
class bt extends et {
  constructor(t) {
    super(),
      (this.id = t.id),
      (this.type = t.type),
      (this.options = void 0),
      (this.ctx = t.ctx),
      (this.chart = t.chart),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this._margins = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }),
      (this.maxWidth = void 0),
      (this.maxHeight = void 0),
      (this.paddingTop = void 0),
      (this.paddingBottom = void 0),
      (this.paddingLeft = void 0),
      (this.paddingRight = void 0),
      (this.axis = void 0),
      (this.labelRotation = void 0),
      (this.min = void 0),
      (this.max = void 0),
      (this._range = void 0),
      (this.ticks = []),
      (this._gridLineItems = null),
      (this._labelItems = null),
      (this._labelSizes = null),
      (this._length = 0),
      (this._maxLength = 0),
      (this._longestTextCache = {}),
      (this._startPixel = void 0),
      (this._endPixel = void 0),
      (this._reversePixels = !1),
      (this._userMax = void 0),
      (this._userMin = void 0),
      (this._suggestedMax = void 0),
      (this._suggestedMin = void 0),
      (this._ticksLength = 0),
      (this._borderValue = 0),
      (this._cache = {}),
      (this._dataLimitsCached = !1),
      (this.$context = void 0);
  }
  init(t) {
    (this.options = t.setContext(this.getContext())),
      (this.axis = t.axis),
      (this._userMin = this.parse(t.min)),
      (this._userMax = this.parse(t.max)),
      (this._suggestedMin = this.parse(t.suggestedMin)),
      (this._suggestedMax = this.parse(t.suggestedMax));
  }
  parse(t, e) {
    return t;
  }
  getUserBounds() {
    let { _userMin: t, _userMax: e, _suggestedMin: i, _suggestedMax: s } = this;
    return (
      (t = K(t, Number.POSITIVE_INFINITY)),
      (e = K(e, Number.NEGATIVE_INFINITY)),
      (i = K(i, Number.POSITIVE_INFINITY)),
      (s = K(s, Number.NEGATIVE_INFINITY)),
      {
        min: K(t, i),
        max: K(e, s),
        minDefined: V(t),
        maxDefined: V(e),
      }
    );
  }
  getMinMax(t) {
    let { min: e, max: i, minDefined: s, maxDefined: o } = this.getUserBounds(),
      a;
    if (s && o) return { min: e, max: i };
    const r = this.getMatchingVisibleMetas();
    for (let l = 0, h = r.length; l < h; ++l)
      (a = r[l].controller.getMinMax(this, t)),
        s || (e = Math.min(e, a.min)),
        o || (i = Math.max(i, a.max));
    return (
      (e = o && e > i ? i : e),
      (i = s && e > i ? e : i),
      {
        min: K(e, K(i, e)),
        max: K(i, K(e, i)),
      }
    );
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0,
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const t = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels || [];
  }
  beforeLayout() {
    (this._cache = {}), (this._dataLimitsCached = !1);
  }
  beforeUpdate() {
    E(this.options.beforeUpdate, [this]);
  }
  update(t, e, i) {
    const { beginAtZero: s, grace: o, ticks: a } = this.options,
      r = a.sampleSize;
    this.beforeUpdate(),
      (this.maxWidth = t),
      (this.maxHeight = e),
      (this._margins = i =
        Object.assign(
          {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
          i
        )),
      (this.ticks = null),
      (this._labelSizes = null),
      (this._gridLineItems = null),
      (this._labelItems = null),
      this.beforeSetDimensions(),
      this.setDimensions(),
      this.afterSetDimensions(),
      (this._maxLength = this.isHorizontal()
        ? this.width + i.left + i.right
        : this.height + i.top + i.bottom),
      this._dataLimitsCached ||
        (this.beforeDataLimits(),
        this.determineDataLimits(),
        this.afterDataLimits(),
        (this._range = Hs(this, o, s)),
        (this._dataLimitsCached = !0)),
      this.beforeBuildTicks(),
      (this.ticks = this.buildTicks() || []),
      this.afterBuildTicks();
    const l = r < this.ticks.length;
    this._convertTicksToLabels(l ? mi(this.ticks, r) : this.ticks),
      this.configure(),
      this.beforeCalculateLabelRotation(),
      this.calculateLabelRotation(),
      this.afterCalculateLabelRotation(),
      a.display &&
        (a.autoSkip || a.source === "auto") &&
        ((this.ticks = Yn(this, this.ticks)), (this._labelSizes = null), this.afterAutoSkip()),
      l && this._convertTicksToLabels(this.ticks),
      this.beforeFit(),
      this.fit(),
      this.afterFit(),
      this.afterUpdate();
  }
  configure() {
    let t = this.options.reverse,
      e,
      i;
    this.isHorizontal()
      ? ((e = this.left), (i = this.right))
      : ((e = this.top), (i = this.bottom), (t = !t)),
      (this._startPixel = e),
      (this._endPixel = i),
      (this._reversePixels = t),
      (this._length = i - e),
      (this._alignToPixels = this.options.alignToPixels);
  }
  afterUpdate() {
    E(this.options.afterUpdate, [this]);
  }
  beforeSetDimensions() {
    E(this.options.beforeSetDimensions, [this]);
  }
  setDimensions() {
    this.isHorizontal()
      ? ((this.width = this.maxWidth), (this.left = 0), (this.right = this.width))
      : ((this.height = this.maxHeight), (this.top = 0), (this.bottom = this.height)),
      (this.paddingLeft = 0),
      (this.paddingTop = 0),
      (this.paddingRight = 0),
      (this.paddingBottom = 0);
  }
  afterSetDimensions() {
    E(this.options.afterSetDimensions, [this]);
  }
  _callHooks(t) {
    this.chart.notifyPlugins(t, this.getContext()), E(this.options[t], [this]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {}
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    E(this.options.beforeTickToLabelConversion, [this]);
  }
  generateTickLabels(t) {
    const e = this.options.ticks;
    let i, s, o;
    for (i = 0, s = t.length; i < s; i++)
      (o = t[i]), (o.label = E(e.callback, [o.value, i, t], this));
  }
  afterTickToLabelConversion() {
    E(this.options.afterTickToLabelConversion, [this]);
  }
  beforeCalculateLabelRotation() {
    E(this.options.beforeCalculateLabelRotation, [this]);
  }
  calculateLabelRotation() {
    const t = this.options,
      e = t.ticks,
      i = this.ticks.length,
      s = e.minRotation || 0,
      o = e.maxRotation;
    let a = s,
      r,
      l,
      h;
    if (!this._isVisible() || !e.display || s >= o || i <= 1 || !this.isHorizontal()) {
      this.labelRotation = s;
      return;
    }
    const c = this._getLabelSizes(),
      d = c.widest.width,
      u = c.highest.height,
      f = X(this.chart.width - d, 0, this.maxWidth);
    (r = t.offset ? this.maxWidth / i : f / (i - 1)),
      d + 6 > r &&
        ((r = f / (i - (t.offset ? 0.5 : 1))),
        (l = this.maxHeight - At(t.grid) - e.padding - bi(t.title, this.chart.options.font)),
        (h = Math.sqrt(d * d + u * u)),
        (a = ze(
          Math.min(
            Math.asin(X((c.highest.height + 6) / r, -1, 1)),
            Math.asin(X(l / h, -1, 1)) - Math.asin(X(u / h, -1, 1))
          )
        )),
        (a = Math.max(s, Math.min(o, a)))),
      (this.labelRotation = a);
  }
  afterCalculateLabelRotation() {
    E(this.options.afterCalculateLabelRotation, [this]);
  }
  afterAutoSkip() {}
  beforeFit() {
    E(this.options.beforeFit, [this]);
  }
  fit() {
    const t = {
        width: 0,
        height: 0,
      },
      {
        chart: e,
        options: { ticks: i, title: s, grid: o },
      } = this,
      a = this._isVisible(),
      r = this.isHorizontal();
    if (a) {
      const l = bi(s, e.options.font);
      if (
        (r
          ? ((t.width = this.maxWidth), (t.height = At(o) + l))
          : ((t.height = this.maxHeight), (t.width = At(o) + l)),
        i.display && this.ticks.length)
      ) {
        const { first: h, last: c, widest: d, highest: u } = this._getLabelSizes(),
          f = i.padding * 2,
          g = J(this.labelRotation),
          p = Math.cos(g),
          m = Math.sin(g);
        if (r) {
          const b = i.mirror ? 0 : m * d.width + p * u.height;
          t.height = Math.min(this.maxHeight, t.height + b + f);
        } else {
          const b = i.mirror ? 0 : p * d.width + m * u.height;
          t.width = Math.min(this.maxWidth, t.width + b + f);
        }
        this._calculatePadding(h, c, m, p);
      }
    }
    this._handleMargins(),
      r
        ? ((this.width = this._length = e.width - this._margins.left - this._margins.right),
          (this.height = t.height))
        : ((this.width = t.width),
          (this.height = this._length = e.height - this._margins.top - this._margins.bottom));
  }
  _calculatePadding(t, e, i, s) {
    const {
        ticks: { align: o, padding: a },
        position: r,
      } = this.options,
      l = this.labelRotation !== 0,
      h = r !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const c = this.getPixelForTick(0) - this.left,
        d = this.right - this.getPixelForTick(this.ticks.length - 1);
      let u = 0,
        f = 0;
      l
        ? h
          ? ((u = s * t.width), (f = i * e.height))
          : ((u = i * t.height), (f = s * e.width))
        : o === "start"
        ? (f = e.width)
        : o === "end"
        ? (u = t.width)
        : o !== "inner" && ((u = t.width / 2), (f = e.width / 2)),
        (this.paddingLeft = Math.max(((u - c + a) * this.width) / (this.width - c), 0)),
        (this.paddingRight = Math.max(((f - d + a) * this.width) / (this.width - d), 0));
    } else {
      let c = e.height / 2,
        d = t.height / 2;
      o === "start" ? ((c = 0), (d = t.height)) : o === "end" && ((c = e.height), (d = 0)),
        (this.paddingTop = c + a),
        (this.paddingBottom = d + a);
    }
  }
  _handleMargins() {
    this._margins &&
      ((this._margins.left = Math.max(this.paddingLeft, this._margins.left)),
      (this._margins.top = Math.max(this.paddingTop, this._margins.top)),
      (this._margins.right = Math.max(this.paddingRight, this._margins.right)),
      (this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom)));
  }
  afterFit() {
    E(this.options.afterFit, [this]);
  }
  isHorizontal() {
    const { axis: t, position: e } = this.options;
    return e === "top" || e === "bottom" || t === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(t) {
    this.beforeTickToLabelConversion(), this.generateTickLabels(t);
    let e, i;
    for (e = 0, i = t.length; e < i; e++) R(t[e].label) && (t.splice(e, 1), i--, e--);
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let t = this._labelSizes;
    if (!t) {
      const e = this.options.ticks.sampleSize;
      let i = this.ticks;
      e < i.length && (i = mi(i, e)), (this._labelSizes = t = this._computeLabelSizes(i, i.length));
    }
    return t;
  }
  _computeLabelSizes(t, e) {
    const { ctx: i, _longestTextCache: s } = this,
      o = [],
      a = [];
    let r = 0,
      l = 0,
      h,
      c,
      d,
      u,
      f,
      g,
      p,
      m,
      b,
      x,
      v;
    for (h = 0; h < e; ++h) {
      if (
        ((u = t[h].label),
        (f = this._resolveTickFontOptions(h)),
        (i.font = g = f.string),
        (p = s[g] = s[g] || { data: {}, gc: [] }),
        (m = f.lineHeight),
        (b = x = 0),
        !R(u) && !j(u))
      )
        (b = Ke(i, p.data, p.gc, b, u)), (x = m);
      else if (j(u))
        for (c = 0, d = u.length; c < d; ++c)
          (v = u[c]), !R(v) && !j(v) && ((b = Ke(i, p.data, p.gc, b, v)), (x += m));
      o.push(b), a.push(x), (r = Math.max(b, r)), (l = Math.max(x, l));
    }
    Qn(s, e);
    const y = o.indexOf(r),
      _ = a.indexOf(l),
      M = k => ({ width: o[k] || 0, height: a[k] || 0 });
    return {
      first: M(0),
      last: M(e - 1),
      widest: M(y),
      highest: M(_),
      widths: o,
      heights: a,
    };
  }
  getLabelForValue(t) {
    return t;
  }
  getPixelForValue(t, e) {
    return NaN;
  }
  getValueForPixel(t) {}
  getPixelForTick(t) {
    const e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getPixelForDecimal(t) {
    this._reversePixels && (t = 1 - t);
    const e = this._startPixel + t * this._length;
    return js(this._alignToPixels ? dt(this.chart, e, 0) : e);
  }
  getDecimalForPixel(t) {
    const e = (t - this._startPixel) / this._length;
    return this._reversePixels ? 1 - e : e;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min: t, max: e } = this;
    return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0;
  }
  getContext(t) {
    const e = this.ticks || [];
    if (t >= 0 && t < e.length) {
      const i = e[t];
      return i.$context || (i.$context = eo(this.getContext(), t, i));
    }
    return this.$context || (this.$context = to(this.chart.getContext(), this));
  }
  _tickSize() {
    const t = this.options.ticks,
      e = J(this.labelRotation),
      i = Math.abs(Math.cos(e)),
      s = Math.abs(Math.sin(e)),
      o = this._getLabelSizes(),
      a = t.autoSkipPadding || 0,
      r = o ? o.widest.width + a : 0,
      l = o ? o.highest.height + a : 0;
    return this.isHorizontal() ? (l * i > r * s ? r / i : l / s) : l * s < r * i ? l / i : r / s;
  }
  _isVisible() {
    const t = this.options.display;
    return t !== "auto" ? !!t : this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(t) {
    const e = this.axis,
      i = this.chart,
      s = this.options,
      { grid: o, position: a } = s,
      r = o.offset,
      l = this.isHorizontal(),
      c = this.ticks.length + (r ? 1 : 0),
      d = At(o),
      u = [],
      f = o.setContext(this.getContext()),
      g = f.drawBorder ? f.borderWidth : 0,
      p = g / 2,
      m = function (w) {
        return dt(i, w, g);
      };
    let b, x, v, y, _, M, k, P, S, L, O, D;
    if (a === "top")
      (b = m(this.bottom)), (M = this.bottom - d), (P = b - p), (L = m(t.top) + p), (D = t.bottom);
    else if (a === "bottom")
      (b = m(this.top)), (L = t.top), (D = m(t.bottom) - p), (M = b + p), (P = this.top + d);
    else if (a === "left")
      (b = m(this.right)), (_ = this.right - d), (k = b - p), (S = m(t.left) + p), (O = t.right);
    else if (a === "right")
      (b = m(this.left)), (S = t.left), (O = m(t.right) - p), (_ = b + p), (k = this.left + d);
    else if (e === "x") {
      if (a === "center") b = m((t.top + t.bottom) / 2 + 0.5);
      else if (F(a)) {
        const w = Object.keys(a)[0],
          B = a[w];
        b = m(this.chart.scales[w].getPixelForValue(B));
      }
      (L = t.top), (D = t.bottom), (M = b + p), (P = M + d);
    } else if (e === "y") {
      if (a === "center") b = m((t.left + t.right) / 2);
      else if (F(a)) {
        const w = Object.keys(a)[0],
          B = a[w];
        b = m(this.chart.scales[w].getPixelForValue(B));
      }
      (_ = b - p), (k = _ - d), (S = t.left), (O = t.right);
    }
    const I = C(s.ticks.maxTicksLimit, c),
      H = Math.max(1, Math.ceil(c / I));
    for (x = 0; x < c; x += H) {
      const w = o.setContext(this.getContext(x)),
        B = w.lineWidth,
        z = w.color,
        ct = w.borderDash || [],
        ce = w.borderDashOffset,
        _t = w.tickWidth,
        Ht = w.tickColor,
        yt = w.tickBorderDash || [],
        Dt = w.tickBorderDashOffset;
      (v = Zn(this, x, r)),
        v !== void 0 &&
          ((y = dt(i, v, B)),
          l ? (_ = k = S = O = y) : (M = P = L = D = y),
          u.push({
            tx1: _,
            ty1: M,
            tx2: k,
            ty2: P,
            x1: S,
            y1: L,
            x2: O,
            y2: D,
            width: B,
            color: z,
            borderDash: ct,
            borderDashOffset: ce,
            tickWidth: _t,
            tickColor: Ht,
            tickBorderDash: yt,
            tickBorderDashOffset: Dt,
          }));
    }
    return (this._ticksLength = c), (this._borderValue = b), u;
  }
  _computeLabelItems(t) {
    const e = this.axis,
      i = this.options,
      { position: s, ticks: o } = i,
      a = this.isHorizontal(),
      r = this.ticks,
      { align: l, crossAlign: h, padding: c, mirror: d } = o,
      u = At(i.grid),
      f = u + c,
      g = d ? -c : f,
      p = -J(this.labelRotation),
      m = [];
    let b,
      x,
      v,
      y,
      _,
      M,
      k,
      P,
      S,
      L,
      O,
      D,
      I = "middle";
    if (s === "top") (M = this.bottom - g), (k = this._getXAxisLabelAlignment());
    else if (s === "bottom") (M = this.top + g), (k = this._getXAxisLabelAlignment());
    else if (s === "left") {
      const w = this._getYAxisLabelAlignment(u);
      (k = w.textAlign), (_ = w.x);
    } else if (s === "right") {
      const w = this._getYAxisLabelAlignment(u);
      (k = w.textAlign), (_ = w.x);
    } else if (e === "x") {
      if (s === "center") M = (t.top + t.bottom) / 2 + f;
      else if (F(s)) {
        const w = Object.keys(s)[0],
          B = s[w];
        M = this.chart.scales[w].getPixelForValue(B) + f;
      }
      k = this._getXAxisLabelAlignment();
    } else if (e === "y") {
      if (s === "center") _ = (t.left + t.right) / 2 - f;
      else if (F(s)) {
        const w = Object.keys(s)[0],
          B = s[w];
        _ = this.chart.scales[w].getPixelForValue(B);
      }
      k = this._getYAxisLabelAlignment(u).textAlign;
    }
    e === "y" && (l === "start" ? (I = "top") : l === "end" && (I = "bottom"));
    const H = this._getLabelSizes();
    for (b = 0, x = r.length; b < x; ++b) {
      (v = r[b]), (y = v.label);
      const w = o.setContext(this.getContext(b));
      (P = this.getPixelForTick(b) + o.labelOffset),
        (S = this._resolveTickFontOptions(b)),
        (L = S.lineHeight),
        (O = j(y) ? y.length : 1);
      const B = O / 2,
        z = w.color,
        ct = w.textStrokeColor,
        ce = w.textStrokeWidth;
      let _t = k;
      a
        ? ((_ = P),
          k === "inner" &&
            (b === x - 1
              ? (_t = this.options.reverse ? "left" : "right")
              : b === 0
              ? (_t = this.options.reverse ? "right" : "left")
              : (_t = "center")),
          s === "top"
            ? h === "near" || p !== 0
              ? (D = -O * L + L / 2)
              : h === "center"
              ? (D = -H.highest.height / 2 - B * L + L)
              : (D = -H.highest.height + L / 2)
            : h === "near" || p !== 0
            ? (D = L / 2)
            : h === "center"
            ? (D = H.highest.height / 2 - B * L)
            : (D = H.highest.height - O * L),
          d && (D *= -1))
        : ((M = P), (D = ((1 - O) * L) / 2));
      let Ht;
      if (w.showLabelBackdrop) {
        const yt = $(w.backdropPadding),
          Dt = H.heights[b],
          de = H.widths[b];
        let ue = M + D - yt.top,
          fe = _ - yt.left;
        switch (I) {
          case "middle":
            ue -= Dt / 2;
            break;
          case "bottom":
            ue -= Dt;
            break;
        }
        switch (k) {
          case "center":
            fe -= de / 2;
            break;
          case "right":
            fe -= de;
            break;
        }
        Ht = {
          left: fe,
          top: ue,
          width: de + yt.width,
          height: Dt + yt.height,
          color: w.backdropColor,
        };
      }
      m.push({
        rotation: p,
        label: y,
        font: S,
        color: z,
        strokeColor: ct,
        strokeWidth: ce,
        textOffset: D,
        textAlign: _t,
        textBaseline: I,
        translation: [_, M],
        backdrop: Ht,
      });
    }
    return m;
  }
  _getXAxisLabelAlignment() {
    const { position: t, ticks: e } = this.options;
    if (-J(this.labelRotation)) return t === "top" ? "left" : "right";
    let s = "center";
    return (
      e.align === "start"
        ? (s = "left")
        : e.align === "end"
        ? (s = "right")
        : e.align === "inner" && (s = "inner"),
      s
    );
  }
  _getYAxisLabelAlignment(t) {
    const {
        position: e,
        ticks: { crossAlign: i, mirror: s, padding: o },
      } = this.options,
      a = this._getLabelSizes(),
      r = t + o,
      l = a.widest.width;
    let h, c;
    return (
      e === "left"
        ? s
          ? ((c = this.right + o),
            i === "near"
              ? (h = "left")
              : i === "center"
              ? ((h = "center"), (c += l / 2))
              : ((h = "right"), (c += l)))
          : ((c = this.right - r),
            i === "near"
              ? (h = "right")
              : i === "center"
              ? ((h = "center"), (c -= l / 2))
              : ((h = "left"), (c = this.left)))
        : e === "right"
        ? s
          ? ((c = this.left + o),
            i === "near"
              ? (h = "right")
              : i === "center"
              ? ((h = "center"), (c -= l / 2))
              : ((h = "left"), (c -= l)))
          : ((c = this.left + r),
            i === "near"
              ? (h = "left")
              : i === "center"
              ? ((h = "center"), (c += l / 2))
              : ((h = "right"), (c = this.right)))
        : (h = "right"),
      { textAlign: h, x: c }
    );
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror) return;
    const t = this.chart,
      e = this.options.position;
    if (e === "left" || e === "right")
      return { top: 0, left: this.left, bottom: t.height, right: this.right };
    if (e === "top" || e === "bottom")
      return { top: this.top, left: 0, bottom: this.bottom, right: t.width };
  }
  drawBackground() {
    const {
      ctx: t,
      options: { backgroundColor: e },
      left: i,
      top: s,
      width: o,
      height: a,
    } = this;
    e && (t.save(), (t.fillStyle = e), t.fillRect(i, s, o, a), t.restore());
  }
  getLineWidthForValue(t) {
    const e = this.options.grid;
    if (!this._isVisible() || !e.display) return 0;
    const s = this.ticks.findIndex(o => o.value === t);
    return s >= 0 ? e.setContext(this.getContext(s)).lineWidth : 0;
  }
  drawGrid(t) {
    const e = this.options.grid,
      i = this.ctx,
      s = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(t));
    let o, a;
    const r = (l, h, c) => {
      !c.width ||
        !c.color ||
        (i.save(),
        (i.lineWidth = c.width),
        (i.strokeStyle = c.color),
        i.setLineDash(c.borderDash || []),
        (i.lineDashOffset = c.borderDashOffset),
        i.beginPath(),
        i.moveTo(l.x, l.y),
        i.lineTo(h.x, h.y),
        i.stroke(),
        i.restore());
    };
    if (e.display)
      for (o = 0, a = s.length; o < a; ++o) {
        const l = s[o];
        e.drawOnChartArea && r({ x: l.x1, y: l.y1 }, { x: l.x2, y: l.y2 }, l),
          e.drawTicks &&
            r(
              { x: l.tx1, y: l.ty1 },
              { x: l.tx2, y: l.ty2 },
              {
                color: l.tickColor,
                width: l.tickWidth,
                borderDash: l.tickBorderDash,
                borderDashOffset: l.tickBorderDashOffset,
              }
            );
      }
  }
  drawBorder() {
    const {
        chart: t,
        ctx: e,
        options: { grid: i },
      } = this,
      s = i.setContext(this.getContext()),
      o = i.drawBorder ? s.borderWidth : 0;
    if (!o) return;
    const a = i.setContext(this.getContext(0)).lineWidth,
      r = this._borderValue;
    let l, h, c, d;
    this.isHorizontal()
      ? ((l = dt(t, this.left, o) - o / 2), (h = dt(t, this.right, a) + a / 2), (c = d = r))
      : ((c = dt(t, this.top, o) - o / 2), (d = dt(t, this.bottom, a) + a / 2), (l = h = r)),
      e.save(),
      (e.lineWidth = s.borderWidth),
      (e.strokeStyle = s.borderColor),
      e.beginPath(),
      e.moveTo(l, c),
      e.lineTo(h, d),
      e.stroke(),
      e.restore();
  }
  drawLabels(t) {
    if (!this.options.ticks.display) return;
    const i = this.ctx,
      s = this._computeLabelArea();
    s && se(i, s);
    const o = this._labelItems || (this._labelItems = this._computeLabelItems(t));
    let a, r;
    for (a = 0, r = o.length; a < r; ++a) {
      const l = o[a],
        h = l.font,
        c = l.label;
      l.backdrop &&
        ((i.fillStyle = l.backdrop.color),
        i.fillRect(l.backdrop.left, l.backdrop.top, l.backdrop.width, l.backdrop.height));
      let d = l.textOffset;
      Mt(i, c, 0, d, h, l);
    }
    s && ne(i);
  }
  drawTitle() {
    const {
      ctx: t,
      options: { position: e, title: i, reverse: s },
    } = this;
    if (!i.display) return;
    const o = W(i.font),
      a = $(i.padding),
      r = i.align;
    let l = o.lineHeight / 2;
    e === "bottom" || e === "center" || F(e)
      ? ((l += a.bottom), j(i.text) && (l += o.lineHeight * (i.text.length - 1)))
      : (l += a.top);
    const { titleX: h, titleY: c, maxWidth: d, rotation: u } = so(this, l, e, r);
    Mt(t, i.text, 0, 0, o, {
      color: i.color,
      maxWidth: d,
      rotation: u,
      textAlign: io(r, e, s),
      textBaseline: "middle",
      translation: [h, c],
    });
  }
  draw(t) {
    this._isVisible() &&
      (this.drawBackground(),
      this.drawGrid(t),
      this.drawBorder(),
      this.drawTitle(),
      this.drawLabels(t));
  }
  _layers() {
    const t = this.options,
      e = (t.ticks && t.ticks.z) || 0,
      i = C(t.grid && t.grid.z, -1);
    return !this._isVisible() || this.draw !== bt.prototype.draw
      ? [
          {
            z: e,
            draw: s => {
              this.draw(s);
            },
          },
        ]
      : [
          {
            z: i,
            draw: s => {
              this.drawBackground(), this.drawGrid(s), this.drawTitle();
            },
          },
          {
            z: i + 1,
            draw: () => {
              this.drawBorder();
            },
          },
          {
            z: e,
            draw: s => {
              this.drawLabels(s);
            },
          },
        ];
  }
  getMatchingVisibleMetas(t) {
    const e = this.chart.getSortedVisibleDatasetMetas(),
      i = this.axis + "AxisID",
      s = [];
    let o, a;
    for (o = 0, a = e.length; o < a; ++o) {
      const r = e[o];
      r[i] === this.id && (!t || r.type === t) && s.push(r);
    }
    return s;
  }
  _resolveTickFontOptions(t) {
    const e = this.options.ticks.setContext(this.getContext(t));
    return W(e.font);
  }
  _maxDigits() {
    const t = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / t;
  }
}
class Yt {
  constructor(t, e, i) {
    (this.type = t),
      (this.scope = e),
      (this.override = i),
      (this.items = /* @__PURE__ */ Object.create(null));
  }
  isForType(t) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype);
  }
  register(t) {
    const e = Object.getPrototypeOf(t);
    let i;
    ao(e) && (i = this.register(e));
    const s = this.items,
      o = t.id,
      a = this.scope + "." + o;
    if (!o) throw new Error("class does not have id: " + t);
    return o in s || ((s[o] = t), no(t, a, i), this.override && A.override(t.id, t.overrides)), a;
  }
  get(t) {
    return this.items[t];
  }
  unregister(t) {
    const e = this.items,
      i = t.id,
      s = this.scope;
    i in e && delete e[i], s && i in A[s] && (delete A[s][i], this.override && delete Pt[i]);
  }
}
function no(n, t, e) {
  const i = an(/* @__PURE__ */ Object.create(null), [e ? A.get(e) : {}, A.get(t), n.defaults]);
  A.set(t, i),
    n.defaultRoutes && oo(t, n.defaultRoutes),
    n.descriptors && A.describe(t, n.descriptors);
}
function oo(n, t) {
  Object.keys(t).forEach(e => {
    const i = e.split("."),
      s = i.pop(),
      o = [n].concat(i).join("."),
      a = t[e].split("."),
      r = a.pop(),
      l = a.join(".");
    A.route(o, s, l, r);
  });
}
function ao(n) {
  return "id" in n && "defaults" in n;
}
class ro {
  constructor() {
    (this.controllers = new Yt(Z, "datasets", !0)),
      (this.elements = new Yt(et, "elements")),
      (this.plugins = new Yt(Object, "plugins")),
      (this.scales = new Yt(bt, "scales")),
      (this._typedRegistries = [this.controllers, this.scales, this.elements]);
  }
  add(...t) {
    this._each("register", t);
  }
  remove(...t) {
    this._each("unregister", t);
  }
  addControllers(...t) {
    this._each("register", t, this.controllers);
  }
  addElements(...t) {
    this._each("register", t, this.elements);
  }
  addPlugins(...t) {
    this._each("register", t, this.plugins);
  }
  addScales(...t) {
    this._each("register", t, this.scales);
  }
  getController(t) {
    return this._get(t, this.controllers, "controller");
  }
  getElement(t) {
    return this._get(t, this.elements, "element");
  }
  getPlugin(t) {
    return this._get(t, this.plugins, "plugin");
  }
  getScale(t) {
    return this._get(t, this.scales, "scale");
  }
  removeControllers(...t) {
    this._each("unregister", t, this.controllers);
  }
  removeElements(...t) {
    this._each("unregister", t, this.elements);
  }
  removePlugins(...t) {
    this._each("unregister", t, this.plugins);
  }
  removeScales(...t) {
    this._each("unregister", t, this.scales);
  }
  _each(t, e, i) {
    [...e].forEach(s => {
      const o = i || this._getRegistryForType(s);
      i || o.isForType(s) || (o === this.plugins && s.id)
        ? this._exec(t, o, s)
        : T(s, a => {
            const r = i || this._getRegistryForType(a);
            this._exec(t, r, a);
          });
    });
  }
  _exec(t, e, i) {
    const s = Js(t);
    E(i["before" + s], [], i), e[t](i), E(i["after" + s], [], i);
  }
  _getRegistryForType(t) {
    for (let e = 0; e < this._typedRegistries.length; e++) {
      const i = this._typedRegistries[e];
      if (i.isForType(t)) return i;
    }
    return this.plugins;
  }
  _get(t, e, i) {
    const s = e.get(t);
    if (s === void 0) throw new Error('"' + t + '" is not a registered ' + i + ".");
    return s;
  }
}
var tt = new ro();
class He extends Z {
  update(t) {
    const e = this._cachedMeta,
      { data: i = [] } = e,
      s = this.chart._animationsDisabled;
    let { start: o, count: a } = qi(e, i, s);
    if (
      ((this._drawStart = o),
      (this._drawCount = a),
      Ji(e) && ((o = 0), (a = i.length)),
      this.options.showLine)
    ) {
      const { dataset: r, _dataset: l } = e;
      (r._chart = this.chart),
        (r._datasetIndex = this.index),
        (r._decimated = !!l._decimated),
        (r.points = i);
      const h = this.resolveDatasetElementOptions(t);
      (h.segment = this.options.segment),
        this.updateElement(
          r,
          void 0,
          {
            animated: !s,
            options: h,
          },
          t
        );
    }
    this.updateElements(i, o, a, t);
  }
  addElements() {
    const { showLine: t } = this.options;
    !this.datasetElementType && t && (this.datasetElementType = tt.getElement("line")),
      super.addElements();
  }
  updateElements(t, e, i, s) {
    const o = s === "reset",
      { iScale: a, vScale: r, _stacked: l, _dataset: h } = this._cachedMeta,
      c = this.resolveDataElementOptions(e, s),
      d = this.getSharedOptions(c),
      u = this.includeOptions(s, d),
      f = a.axis,
      g = r.axis,
      { spanGaps: p, segment: m } = this.options,
      b = wt(p) ? p : Number.POSITIVE_INFINITY,
      x = this.chart._animationsDisabled || o || s === "none";
    let v = e > 0 && this.getParsed(e - 1);
    for (let y = e; y < e + i; ++y) {
      const _ = t[y],
        M = this.getParsed(y),
        k = x ? _ : {},
        P = R(M[g]),
        S = (k[f] = a.getPixelForValue(M[f], y)),
        L = (k[g] =
          o || P ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, M, l) : M[g], y));
      (k.skip = isNaN(S) || isNaN(L) || P),
        (k.stop = y > 0 && Math.abs(M[f] - v[f]) > b),
        m && ((k.parsed = M), (k.raw = h.data[y])),
        u && (k.options = d || this.resolveDataElementOptions(y, _.active ? "active" : s)),
        x || this.updateElement(_, y, k, s),
        (v = M);
    }
    this.updateSharedOptions(d, s, c);
  }
  getMaxOverflow() {
    const t = this._cachedMeta,
      e = t.data || [];
    if (!this.options.showLine) {
      let r = 0;
      for (let l = e.length - 1; l >= 0; --l)
        r = Math.max(r, e[l].size(this.resolveDataElementOptions(l)) / 2);
      return r > 0 && r;
    }
    const i = t.dataset,
      s = (i.options && i.options.borderWidth) || 0;
    if (!e.length) return s;
    const o = e[0].size(this.resolveDataElementOptions(0)),
      a = e[e.length - 1].size(this.resolveDataElementOptions(e.length - 1));
    return Math.max(s, o, a) / 2;
  }
}
He.id = "scatter";
He.defaults = {
  datasetElementType: !1,
  dataElementType: "point",
  showLine: !1,
  fill: !1,
};
He.overrides = {
  interaction: {
    mode: "point",
  },
  plugins: {
    tooltip: {
      callbacks: {
        title() {
          return "";
        },
        label(n) {
          return "(" + n.label + ", " + n.formattedValue + ")";
        },
      },
    },
  },
  scales: {
    x: {
      type: "linear",
    },
    y: {
      type: "linear",
    },
  },
};
function ut() {
  throw new Error(
    "This method is not implemented: Check that a complete date adapter is provided."
  );
}
class Pe {
  constructor(t) {
    this.options = t || {};
  }
  init(t) {}
  formats() {
    return ut();
  }
  parse(t, e) {
    return ut();
  }
  format(t, e) {
    return ut();
  }
  add(t, e, i) {
    return ut();
  }
  diff(t, e, i) {
    return ut();
  }
  startOf(t, e, i) {
    return ut();
  }
  endOf(t, e) {
    return ut();
  }
}
Pe.override = function (n) {
  Object.assign(Pe.prototype, n);
};
var lo = {
  _date: Pe,
};
function ho(n, t, e, i) {
  const { controller: s, data: o, _sorted: a } = n,
    r = s._cachedMeta.iScale;
  if (r && t === r.axis && t !== "r" && a && o.length) {
    const l = r._reversePixels ? gn : we;
    if (i) {
      if (s._sharedOptions) {
        const h = o[0],
          c = typeof h.getRange == "function" && h.getRange(t);
        if (c) {
          const d = l(o, t, e - c),
            u = l(o, t, e + c);
          return { lo: d.lo, hi: u.hi };
        }
      }
    } else return l(o, t, e);
  }
  return { lo: 0, hi: o.length - 1 };
}
function Wt(n, t, e, i, s) {
  const o = n.getSortedVisibleDatasetMetas(),
    a = e[t];
  for (let r = 0, l = o.length; r < l; ++r) {
    const { index: h, data: c } = o[r],
      { lo: d, hi: u } = ho(o[r], t, a, s);
    for (let f = d; f <= u; ++f) {
      const g = c[f];
      g.skip || i(g, h, f);
    }
  }
}
function co(n) {
  const t = n.indexOf("x") !== -1,
    e = n.indexOf("y") !== -1;
  return function (i, s) {
    const o = t ? Math.abs(i.x - s.x) : 0,
      a = e ? Math.abs(i.y - s.y) : 0;
    return Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2));
  };
}
function xe(n, t, e, i, s) {
  const o = [];
  return (
    (!s && !n.isPointInArea(t)) ||
      Wt(
        n,
        e,
        t,
        function (r, l, h) {
          (!s && !Fe(r, n.chartArea, 0)) ||
            (r.inRange(t.x, t.y, i) && o.push({ element: r, datasetIndex: l, index: h }));
        },
        !0
      ),
    o
  );
}
function uo(n, t, e, i) {
  let s = [];
  function o(a, r, l) {
    const { startAngle: h, endAngle: c } = a.getProps(["startAngle", "endAngle"], i),
      { angle: d } = Zi(a, { x: t.x, y: t.y });
    Zt(d, h, c) && s.push({ element: a, datasetIndex: r, index: l });
  }
  return Wt(n, e, t, o), s;
}
function fo(n, t, e, i, s, o) {
  let a = [];
  const r = co(e);
  let l = Number.POSITIVE_INFINITY;
  function h(c, d, u) {
    const f = c.inRange(t.x, t.y, s);
    if (i && !f) return;
    const g = c.getCenterPoint(s);
    if (!(!!o || n.isPointInArea(g)) && !f) return;
    const m = r(t, g);
    m < l
      ? ((a = [{ element: c, datasetIndex: d, index: u }]), (l = m))
      : m === l && a.push({ element: c, datasetIndex: d, index: u });
  }
  return Wt(n, e, t, h), a;
}
function _e(n, t, e, i, s, o) {
  return !o && !n.isPointInArea(t) ? [] : e === "r" && !i ? uo(n, t, e, s) : fo(n, t, e, i, s, o);
}
function xi(n, t, e, i, s) {
  const o = [],
    a = e === "x" ? "inXRange" : "inYRange";
  let r = !1;
  return (
    Wt(n, e, t, (l, h, c) => {
      l[a](t[e], s) &&
        (o.push({ element: l, datasetIndex: h, index: c }), (r = r || l.inRange(t.x, t.y, s)));
    }),
    i && !r ? [] : o
  );
}
var go = {
  evaluateInteractionItems: Wt,
  modes: {
    index(n, t, e, i) {
      const s = ft(t, n),
        o = e.axis || "x",
        a = e.includeInvisible || !1,
        r = e.intersect ? xe(n, s, o, i, a) : _e(n, s, o, !1, i, a),
        l = [];
      return r.length
        ? (n.getSortedVisibleDatasetMetas().forEach(h => {
            const c = r[0].index,
              d = h.data[c];
            d && !d.skip && l.push({ element: d, datasetIndex: h.index, index: c });
          }),
          l)
        : [];
    },
    dataset(n, t, e, i) {
      const s = ft(t, n),
        o = e.axis || "xy",
        a = e.includeInvisible || !1;
      let r = e.intersect ? xe(n, s, o, i, a) : _e(n, s, o, !1, i, a);
      if (r.length > 0) {
        const l = r[0].datasetIndex,
          h = n.getDatasetMeta(l).data;
        r = [];
        for (let c = 0; c < h.length; ++c) r.push({ element: h[c], datasetIndex: l, index: c });
      }
      return r;
    },
    point(n, t, e, i) {
      const s = ft(t, n),
        o = e.axis || "xy",
        a = e.includeInvisible || !1;
      return xe(n, s, o, i, a);
    },
    nearest(n, t, e, i) {
      const s = ft(t, n),
        o = e.axis || "xy",
        a = e.includeInvisible || !1;
      return _e(n, s, o, e.intersect, i, a);
    },
    x(n, t, e, i) {
      const s = ft(t, n);
      return xi(n, s, "x", e.intersect, i);
    },
    y(n, t, e, i) {
      const s = ft(t, n);
      return xi(n, s, "y", e.intersect, i);
    },
  },
};
const gs = ["left", "top", "right", "bottom"];
function Lt(n, t) {
  return n.filter(e => e.pos === t);
}
function _i(n, t) {
  return n.filter(e => gs.indexOf(e.pos) === -1 && e.box.axis === t);
}
function Ot(n, t) {
  return n.sort((e, i) => {
    const s = t ? i : e,
      o = t ? e : i;
    return s.weight === o.weight ? s.index - o.index : s.weight - o.weight;
  });
}
function po(n) {
  const t = [];
  let e, i, s, o, a, r;
  for (e = 0, i = (n || []).length; e < i; ++e)
    (s = n[e]),
      ({
        position: o,
        options: { stack: a, stackWeight: r = 1 },
      } = s),
      t.push({
        index: e,
        box: s,
        pos: o,
        horizontal: s.isHorizontal(),
        weight: s.weight,
        stack: a && o + a,
        stackWeight: r,
      });
  return t;
}
function mo(n) {
  const t = {};
  for (const e of n) {
    const { stack: i, pos: s, stackWeight: o } = e;
    if (!i || !gs.includes(s)) continue;
    const a = t[i] || (t[i] = { count: 0, placed: 0, weight: 0, size: 0 });
    a.count++, (a.weight += o);
  }
  return t;
}
function bo(n, t) {
  const e = mo(n),
    { vBoxMaxWidth: i, hBoxMaxHeight: s } = t;
  let o, a, r;
  for (o = 0, a = n.length; o < a; ++o) {
    r = n[o];
    const { fullSize: l } = r.box,
      h = e[r.stack],
      c = h && r.stackWeight / h.weight;
    r.horizontal
      ? ((r.width = c ? c * i : l && t.availableWidth), (r.height = s))
      : ((r.width = i), (r.height = c ? c * s : l && t.availableHeight));
  }
  return e;
}
function xo(n) {
  const t = po(n),
    e = Ot(
      t.filter(h => h.box.fullSize),
      !0
    ),
    i = Ot(Lt(t, "left"), !0),
    s = Ot(Lt(t, "right")),
    o = Ot(Lt(t, "top"), !0),
    a = Ot(Lt(t, "bottom")),
    r = _i(t, "x"),
    l = _i(t, "y");
  return {
    fullSize: e,
    leftAndTop: i.concat(o),
    rightAndBottom: s.concat(l).concat(a).concat(r),
    chartArea: Lt(t, "chartArea"),
    vertical: i.concat(s).concat(l),
    horizontal: o.concat(a).concat(r),
  };
}
function yi(n, t, e, i) {
  return Math.max(n[e], t[e]) + Math.max(n[i], t[i]);
}
function ps(n, t) {
  (n.top = Math.max(n.top, t.top)),
    (n.left = Math.max(n.left, t.left)),
    (n.bottom = Math.max(n.bottom, t.bottom)),
    (n.right = Math.max(n.right, t.right));
}
function _o(n, t, e, i) {
  const { pos: s, box: o } = e,
    a = n.maxPadding;
  if (!F(s)) {
    e.size && (n[s] -= e.size);
    const d = i[e.stack] || { size: 0, count: 1 };
    (d.size = Math.max(d.size, e.horizontal ? o.height : o.width)),
      (e.size = d.size / d.count),
      (n[s] += e.size);
  }
  o.getPadding && ps(a, o.getPadding());
  const r = Math.max(0, t.outerWidth - yi(a, n, "left", "right")),
    l = Math.max(0, t.outerHeight - yi(a, n, "top", "bottom")),
    h = r !== n.w,
    c = l !== n.h;
  return (n.w = r), (n.h = l), e.horizontal ? { same: h, other: c } : { same: c, other: h };
}
function yo(n) {
  const t = n.maxPadding;
  function e(i) {
    const s = Math.max(t[i] - n[i], 0);
    return (n[i] += s), s;
  }
  (n.y += e("top")), (n.x += e("left")), e("right"), e("bottom");
}
function vo(n, t) {
  const e = t.maxPadding;
  function i(s) {
    const o = { left: 0, top: 0, right: 0, bottom: 0 };
    return (
      s.forEach(a => {
        o[a] = Math.max(t[a], e[a]);
      }),
      o
    );
  }
  return i(n ? ["left", "right"] : ["top", "bottom"]);
}
function Et(n, t, e, i) {
  const s = [];
  let o, a, r, l, h, c;
  for (o = 0, a = n.length, h = 0; o < a; ++o) {
    (r = n[o]), (l = r.box), l.update(r.width || t.w, r.height || t.h, vo(r.horizontal, t));
    const { same: d, other: u } = _o(t, e, r, i);
    (h |= d && s.length), (c = c || u), l.fullSize || s.push(r);
  }
  return (h && Et(s, t, e, i)) || c;
}
function Ut(n, t, e, i, s) {
  (n.top = e), (n.left = t), (n.right = t + i), (n.bottom = e + s), (n.width = i), (n.height = s);
}
function vi(n, t, e, i) {
  const s = e.padding;
  let { x: o, y: a } = t;
  for (const r of n) {
    const l = r.box,
      h = i[r.stack] || { count: 1, placed: 0, weight: 1 },
      c = r.stackWeight / h.weight || 1;
    if (r.horizontal) {
      const d = t.w * c,
        u = h.size || l.height;
      It(h.start) && (a = h.start),
        l.fullSize
          ? Ut(l, s.left, a, e.outerWidth - s.right - s.left, u)
          : Ut(l, t.left + h.placed, a, d, u),
        (h.start = a),
        (h.placed += d),
        (a = l.bottom);
    } else {
      const d = t.h * c,
        u = h.size || l.width;
      It(h.start) && (o = h.start),
        l.fullSize
          ? Ut(l, o, s.top, u, e.outerHeight - s.bottom - s.top)
          : Ut(l, o, t.top + h.placed, u, d),
        (h.start = o),
        (h.placed += d),
        (o = l.right);
    }
  }
  (t.x = o), (t.y = a);
}
A.set("layout", {
  autoPadding: !0,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
var rt = {
  addBox(n, t) {
    n.boxes || (n.boxes = []),
      (t.fullSize = t.fullSize || !1),
      (t.position = t.position || "top"),
      (t.weight = t.weight || 0),
      (t._layers =
        t._layers ||
        function () {
          return [
            {
              z: 0,
              draw(e) {
                t.draw(e);
              },
            },
          ];
        }),
      n.boxes.push(t);
  },
  removeBox(n, t) {
    const e = n.boxes ? n.boxes.indexOf(t) : -1;
    e !== -1 && n.boxes.splice(e, 1);
  },
  configure(n, t, e) {
    (t.fullSize = e.fullSize), (t.position = e.position), (t.weight = e.weight);
  },
  update(n, t, e, i) {
    if (!n) return;
    const s = $(n.options.layout.padding),
      o = Math.max(t - s.width, 0),
      a = Math.max(e - s.height, 0),
      r = xo(n.boxes),
      l = r.vertical,
      h = r.horizontal;
    T(n.boxes, p => {
      typeof p.beforeLayout == "function" && p.beforeLayout();
    });
    const c =
        l.reduce((p, m) => (m.box.options && m.box.options.display === !1 ? p : p + 1), 0) || 1,
      d = Object.freeze({
        outerWidth: t,
        outerHeight: e,
        padding: s,
        availableWidth: o,
        availableHeight: a,
        vBoxMaxWidth: o / 2 / c,
        hBoxMaxHeight: a / 2,
      }),
      u = Object.assign({}, s);
    ps(u, $(i));
    const f = Object.assign(
        {
          maxPadding: u,
          w: o,
          h: a,
          x: s.left,
          y: s.top,
        },
        s
      ),
      g = bo(l.concat(h), d);
    Et(r.fullSize, f, d, g),
      Et(l, f, d, g),
      Et(h, f, d, g) && Et(l, f, d, g),
      yo(f),
      vi(r.leftAndTop, f, d, g),
      (f.x += f.w),
      (f.y += f.h),
      vi(r.rightAndBottom, f, d, g),
      (n.chartArea = {
        left: f.left,
        top: f.top,
        right: f.left + f.w,
        bottom: f.top + f.h,
        height: f.h,
        width: f.w,
      }),
      T(r.chartArea, p => {
        const m = p.box;
        Object.assign(m, n.chartArea), m.update(f.w, f.h, { left: 0, top: 0, right: 0, bottom: 0 });
      });
  },
};
class ms {
  acquireContext(t, e) {}
  releaseContext(t) {
    return !1;
  }
  addEventListener(t, e, i) {}
  removeEventListener(t, e, i) {}
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(t, e, i, s) {
    return (
      (e = Math.max(0, e || t.width)),
      (i = i || t.height),
      {
        width: e,
        height: Math.max(0, s ? Math.floor(e / s) : i),
      }
    );
  }
  isAttached(t) {
    return !0;
  }
  updateConfig(t) {}
}
class ko extends ms {
  acquireContext(t) {
    return (t && t.getContext && t.getContext("2d")) || null;
  }
  updateConfig(t) {
    t.options.animation = !1;
  }
}
const Jt = "$chartjs",
  Mo = {
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup",
    pointerenter: "mouseenter",
    pointerdown: "mousedown",
    pointermove: "mousemove",
    pointerup: "mouseup",
    pointerleave: "mouseout",
    pointerout: "mouseout",
  },
  ki = n => n === null || n === "";
function So(n, t) {
  const e = n.style,
    i = n.getAttribute("height"),
    s = n.getAttribute("width");
  if (
    ((n[Jt] = {
      initial: {
        height: i,
        width: s,
        style: {
          display: e.display,
          height: e.height,
          width: e.width,
        },
      },
    }),
    (e.display = e.display || "block"),
    (e.boxSizing = e.boxSizing || "border-box"),
    ki(s))
  ) {
    const o = ni(n, "width");
    o !== void 0 && (n.width = o);
  }
  if (ki(i))
    if (n.style.height === "") n.height = n.width / (t || 2);
    else {
      const o = ni(n, "height");
      o !== void 0 && (n.height = o);
    }
  return n;
}
const bs = pn ? { passive: !0 } : !1;
function wo(n, t, e) {
  n.addEventListener(t, e, bs);
}
function Po(n, t, e) {
  n.canvas.removeEventListener(t, e, bs);
}
function Do(n, t) {
  const e = Mo[n.type] || n.type,
    { x: i, y: s } = ft(n, t);
  return {
    type: e,
    chart: t,
    native: n,
    x: i !== void 0 ? i : null,
    y: s !== void 0 ? s : null,
  };
}
function te(n, t) {
  for (const e of n) if (e === t || e.contains(t)) return !0;
}
function Co(n, t, e) {
  const i = n.canvas,
    s = new MutationObserver(o => {
      let a = !1;
      for (const r of o) (a = a || te(r.addedNodes, i)), (a = a && !te(r.removedNodes, i));
      a && e();
    });
  return s.observe(document, { childList: !0, subtree: !0 }), s;
}
function Ao(n, t, e) {
  const i = n.canvas,
    s = new MutationObserver(o => {
      let a = !1;
      for (const r of o) (a = a || te(r.removedNodes, i)), (a = a && !te(r.addedNodes, i));
      a && e();
    });
  return s.observe(document, { childList: !0, subtree: !0 }), s;
}
const Bt = /* @__PURE__ */ new Map();
let Mi = 0;
function xs() {
  const n = window.devicePixelRatio;
  n !== Mi &&
    ((Mi = n),
    Bt.forEach((t, e) => {
      e.currentDevicePixelRatio !== n && t();
    }));
}
function Lo(n, t) {
  Bt.size || window.addEventListener("resize", xs), Bt.set(n, t);
}
function Oo(n) {
  Bt.delete(n), Bt.size || window.removeEventListener("resize", xs);
}
function To(n, t, e) {
  const i = n.canvas,
    s = i && rs(i);
  if (!s) return;
  const o = ls((r, l) => {
      const h = s.clientWidth;
      e(r, l), h < s.clientWidth && e();
    }, window),
    a = new ResizeObserver(r => {
      const l = r[0],
        h = l.contentRect.width,
        c = l.contentRect.height;
      (h === 0 && c === 0) || o(h, c);
    });
  return a.observe(s), Lo(n, o), a;
}
function ye(n, t, e) {
  e && e.disconnect(), t === "resize" && Oo(n);
}
function Eo(n, t, e) {
  const i = n.canvas,
    s = ls(
      o => {
        n.ctx !== null && e(Do(o, n));
      },
      n,
      o => {
        const a = o[0];
        return [a, a.offsetX, a.offsetY];
      }
    );
  return wo(i, t, s), s;
}
class Ro extends ms {
  acquireContext(t, e) {
    const i = t && t.getContext && t.getContext("2d");
    return i && i.canvas === t ? (So(t, e), i) : null;
  }
  releaseContext(t) {
    const e = t.canvas;
    if (!e[Jt]) return !1;
    const i = e[Jt].initial;
    ["height", "width"].forEach(o => {
      const a = i[o];
      R(a) ? e.removeAttribute(o) : e.setAttribute(o, a);
    });
    const s = i.style || {};
    return (
      Object.keys(s).forEach(o => {
        e.style[o] = s[o];
      }),
      (e.width = e.width),
      delete e[Jt],
      !0
    );
  }
  addEventListener(t, e, i) {
    this.removeEventListener(t, e);
    const s = t.$proxies || (t.$proxies = {}),
      a =
        {
          attach: Co,
          detach: Ao,
          resize: To,
        }[e] || Eo;
    s[e] = a(t, e, i);
  }
  removeEventListener(t, e) {
    const i = t.$proxies || (t.$proxies = {}),
      s = i[e];
    if (!s) return;
    (
      ({
        attach: ye,
        detach: ye,
        resize: ye,
      })[e] || Po
    )(t, e, s),
      (i[e] = void 0);
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(t, e, i, s) {
    return rn(t, e, i, s);
  }
  isAttached(t) {
    const e = rs(t);
    return !!(e && e.isConnected);
  }
}
function Fo(n) {
  return !os() || (typeof OffscreenCanvas < "u" && n instanceof OffscreenCanvas) ? ko : Ro;
}
class zo {
  constructor() {
    this._init = [];
  }
  notify(t, e, i, s) {
    e === "beforeInit" &&
      ((this._init = this._createDescriptors(t, !0)), this._notify(this._init, t, "install"));
    const o = s ? this._descriptors(t).filter(s) : this._descriptors(t),
      a = this._notify(o, t, e, i);
    return (
      e === "afterDestroy" &&
        (this._notify(o, t, "stop"), this._notify(this._init, t, "uninstall")),
      a
    );
  }
  _notify(t, e, i, s) {
    s = s || {};
    for (const o of t) {
      const a = o.plugin,
        r = a[i],
        l = [e, s, o.options];
      if (E(r, l, a) === !1 && s.cancelable) return !1;
    }
    return !0;
  }
  invalidate() {
    R(this._cache) || ((this._oldCache = this._cache), (this._cache = void 0));
  }
  _descriptors(t) {
    if (this._cache) return this._cache;
    const e = (this._cache = this._createDescriptors(t));
    return this._notifyStateChanges(t), e;
  }
  _createDescriptors(t, e) {
    const i = t && t.config,
      s = C(i.options && i.options.plugins, {}),
      o = Io(i);
    return s === !1 && !e ? [] : Vo(t, o, s, e);
  }
  _notifyStateChanges(t) {
    const e = this._oldCache || [],
      i = this._cache,
      s = (o, a) => o.filter(r => !a.some(l => r.plugin.id === l.plugin.id));
    this._notify(s(e, i), t, "stop"), this._notify(s(i, e), t, "start");
  }
}
function Io(n) {
  const t = {},
    e = [],
    i = Object.keys(tt.plugins.items);
  for (let o = 0; o < i.length; o++) e.push(tt.getPlugin(i[o]));
  const s = n.plugins || [];
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    e.indexOf(a) === -1 && (e.push(a), (t[a.id] = !0));
  }
  return { plugins: e, localIds: t };
}
function Bo(n, t) {
  return !t && n === !1 ? null : n === !0 ? {} : n;
}
function Vo(n, { plugins: t, localIds: e }, i, s) {
  const o = [],
    a = n.getContext();
  for (const r of t) {
    const l = r.id,
      h = Bo(i[l], s);
    h !== null &&
      o.push({
        plugin: r,
        options: No(n.config, { plugin: r, local: e[l] }, h, a),
      });
  }
  return o;
}
function No(n, { plugin: t, local: e }, i, s) {
  const o = n.pluginScopeKeys(t),
    a = n.getOptionScopes(i, o);
  return (
    e && t.defaults && a.push(t.defaults),
    n.createResolver(a, s, [""], {
      scriptable: !1,
      indexable: !1,
      allKeys: !0,
    })
  );
}
function De(n, t) {
  const e = A.datasets[n] || {};
  return ((t.datasets || {})[n] || {}).indexAxis || t.indexAxis || e.indexAxis || "x";
}
function Wo(n, t) {
  let e = n;
  return n === "_index_" ? (e = t) : n === "_value_" && (e = t === "x" ? "y" : "x"), e;
}
function Ho(n, t) {
  return n === t ? "_index_" : "_value_";
}
function jo(n) {
  if (n === "top" || n === "bottom") return "x";
  if (n === "left" || n === "right") return "y";
}
function Ce(n, t) {
  return n === "x" || n === "y" ? n : t.axis || jo(t.position) || n.charAt(0).toLowerCase();
}
function $o(n, t) {
  const e = Pt[n.type] || { scales: {} },
    i = t.scales || {},
    s = De(n.type, t),
    o = /* @__PURE__ */ Object.create(null),
    a = /* @__PURE__ */ Object.create(null);
  return (
    Object.keys(i).forEach(r => {
      const l = i[r];
      if (!F(l)) return console.error(`Invalid scale configuration for scale: ${r}`);
      if (l._proxy) return console.warn(`Ignoring resolver passed as options for scale: ${r}`);
      const h = Ce(r, l),
        c = Ho(h, s),
        d = e.scales || {};
      (o[h] = o[h] || r),
        (a[r] = qt(/* @__PURE__ */ Object.create(null), [{ axis: h }, l, d[h], d[c]]));
    }),
    n.data.datasets.forEach(r => {
      const l = r.type || n.type,
        h = r.indexAxis || De(l, t),
        d = (Pt[l] || {}).scales || {};
      Object.keys(d).forEach(u => {
        const f = Wo(u, h),
          g = r[f + "AxisID"] || o[f] || f;
        (a[g] = a[g] || /* @__PURE__ */ Object.create(null)), qt(a[g], [{ axis: f }, i[g], d[u]]);
      });
    }),
    Object.keys(a).forEach(r => {
      const l = a[r];
      qt(l, [A.scales[l.type], A.scale]);
    }),
    a
  );
}
function _s(n) {
  const t = n.options || (n.options = {});
  (t.plugins = C(t.plugins, {})), (t.scales = $o(n, t));
}
function ys(n) {
  return (n = n || {}), (n.datasets = n.datasets || []), (n.labels = n.labels || []), n;
}
function Yo(n) {
  return (n = n || {}), (n.data = ys(n.data)), _s(n), n;
}
const Si = /* @__PURE__ */ new Map(),
  vs = /* @__PURE__ */ new Set();
function Xt(n, t) {
  let e = Si.get(n);
  return e || ((e = t()), Si.set(n, e), vs.add(e)), e;
}
const Tt = (n, t, e) => {
  const i = St(t, e);
  i !== void 0 && n.add(i);
};
class Uo {
  constructor(t) {
    (this._config = Yo(t)),
      (this._scopeCache = /* @__PURE__ */ new Map()),
      (this._resolverCache = /* @__PURE__ */ new Map());
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(t) {
    this._config.type = t;
  }
  get data() {
    return this._config.data;
  }
  set data(t) {
    this._config.data = ys(t);
  }
  get options() {
    return this._config.options;
  }
  set options(t) {
    this._config.options = t;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const t = this._config;
    this.clearCache(), _s(t);
  }
  clearCache() {
    this._scopeCache.clear(), this._resolverCache.clear();
  }
  datasetScopeKeys(t) {
    return Xt(t, () => [[`datasets.${t}`, ""]]);
  }
  datasetAnimationScopeKeys(t, e) {
    return Xt(`${t}.transition.${e}`, () => [
      [`datasets.${t}.transitions.${e}`, `transitions.${e}`],
      [`datasets.${t}`, ""],
    ]);
  }
  datasetElementScopeKeys(t, e) {
    return Xt(`${t}-${e}`, () => [
      [`datasets.${t}.elements.${e}`, `datasets.${t}`, `elements.${e}`, ""],
    ]);
  }
  pluginScopeKeys(t) {
    const e = t.id,
      i = this.type;
    return Xt(`${i}-plugin-${e}`, () => [[`plugins.${e}`, ...(t.additionalOptionScopes || [])]]);
  }
  _cachedScopes(t, e) {
    const i = this._scopeCache;
    let s = i.get(t);
    return (!s || e) && ((s = /* @__PURE__ */ new Map()), i.set(t, s)), s;
  }
  getOptionScopes(t, e, i) {
    const { options: s, type: o } = this,
      a = this._cachedScopes(t, i),
      r = a.get(e);
    if (r) return r;
    const l = /* @__PURE__ */ new Set();
    e.forEach(c => {
      t && (l.add(t), c.forEach(d => Tt(l, t, d))),
        c.forEach(d => Tt(l, s, d)),
        c.forEach(d => Tt(l, Pt[o] || {}, d)),
        c.forEach(d => Tt(l, A, d)),
        c.forEach(d => Tt(l, Qe, d));
    });
    const h = Array.from(l);
    return (
      h.length === 0 && h.push(/* @__PURE__ */ Object.create(null)), vs.has(e) && a.set(e, h), h
    );
  }
  chartOptionScopes() {
    const { options: t, type: e } = this;
    return [t, Pt[e] || {}, A.datasets[e] || {}, { type: e }, A, Qe];
  }
  resolveNamedOptions(t, e, i, s = [""]) {
    const o = { $shared: !0 },
      { resolver: a, subPrefixes: r } = wi(this._resolverCache, t, s);
    let l = a;
    if (Ko(a, e)) {
      (o.$shared = !1), (i = oe(i) ? i() : i);
      const h = this.createResolver(t, i, r);
      l = ti(a, i, h);
    }
    for (const h of e) o[h] = l[h];
    return o;
  }
  createResolver(t, e, i = [""], s) {
    const { resolver: o } = wi(this._resolverCache, t, i);
    return F(e) ? ti(o, e, void 0, s) : o;
  }
}
function wi(n, t, e) {
  let i = n.get(t);
  i || ((i = /* @__PURE__ */ new Map()), n.set(t, i));
  const s = e.join();
  let o = i.get(s);
  return (
    o ||
      ((o = {
        resolver: Zs(t, e),
        subPrefixes: e.filter(r => !r.toLowerCase().includes("hover")),
      }),
      i.set(s, o)),
    o
  );
}
const Xo = n => F(n) && Object.getOwnPropertyNames(n).reduce((t, e) => t || oe(n[e]), !1);
function Ko(n, t) {
  const { isScriptable: e, isIndexable: i } = Qs(n);
  for (const s of t) {
    const o = e(s),
      a = i(s),
      r = (a || o) && n[s];
    if ((o && (oe(r) || Xo(r))) || (a && j(r))) return !0;
  }
  return !1;
}
var Go = "3.9.1";
const qo = ["top", "bottom", "left", "right", "chartArea"];
function Pi(n, t) {
  return n === "top" || n === "bottom" || (qo.indexOf(n) === -1 && t === "x");
}
function Di(n, t) {
  return function (e, i) {
    return e[n] === i[n] ? e[t] - i[t] : e[n] - i[n];
  };
}
function Ci(n) {
  const t = n.chart,
    e = t.options.animation;
  t.notifyPlugins("afterRender"), E(e && e.onComplete, [n], t);
}
function Jo(n) {
  const t = n.chart,
    e = t.options.animation;
  E(e && e.onProgress, [n], t);
}
function ks(n) {
  return (
    os() && typeof n == "string" ? (n = document.getElementById(n)) : n && n.length && (n = n[0]),
    n && n.canvas && (n = n.canvas),
    n
  );
}
const ee = {},
  Ms = n => {
    const t = ks(n);
    return Object.values(ee)
      .filter(e => e.canvas === t)
      .pop();
  };
function Zo(n, t, e) {
  const i = Object.keys(n);
  for (const s of i) {
    const o = +s;
    if (o >= t) {
      const a = n[s];
      delete n[s], (e > 0 || o > t) && (n[o + e] = a);
    }
  }
}
function Qo(n, t, e, i) {
  return !e || n.type === "mouseout" ? null : i ? t : n;
}
class Ss {
  constructor(t, e) {
    const i = (this.config = new Uo(e)),
      s = ks(t),
      o = Ms(s);
    if (o)
      throw new Error(
        "Canvas is already in use. Chart with ID '" +
          o.id +
          "' must be destroyed before the canvas with ID '" +
          o.canvas.id +
          "' can be reused."
      );
    const a = i.createResolver(i.chartOptionScopes(), this.getContext());
    (this.platform = new (i.platform || Fo(s))()), this.platform.updateConfig(i);
    const r = this.platform.acquireContext(s, a.aspectRatio),
      l = r && r.canvas,
      h = l && l.height,
      c = l && l.width;
    if (
      ((this.id = $s()),
      (this.ctx = r),
      (this.canvas = l),
      (this.width = c),
      (this.height = h),
      (this._options = a),
      (this._aspectRatio = this.aspectRatio),
      (this._layers = []),
      (this._metasets = []),
      (this._stacks = void 0),
      (this.boxes = []),
      (this.currentDevicePixelRatio = void 0),
      (this.chartArea = void 0),
      (this._active = []),
      (this._lastEvent = void 0),
      (this._listeners = {}),
      (this._responsiveListeners = void 0),
      (this._sortedMetasets = []),
      (this.scales = {}),
      (this._plugins = new zo()),
      (this.$proxies = {}),
      (this._hiddenIndices = {}),
      (this.attached = !1),
      (this._animationsDisabled = void 0),
      (this.$context = void 0),
      (this._doResize = Ys(d => this.update(d), a.resizeDelay || 0)),
      (this._dataChanges = []),
      (ee[this.id] = this),
      !r || !l)
    ) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    st.listen(this, "complete", Ci),
      st.listen(this, "progress", Jo),
      this._initialize(),
      this.attached && this.update();
  }
  get aspectRatio() {
    const {
      options: { aspectRatio: t, maintainAspectRatio: e },
      width: i,
      height: s,
      _aspectRatio: o,
    } = this;
    return R(t) ? (e && o ? o : s ? i / s : null) : t;
  }
  get data() {
    return this.config.data;
  }
  set data(t) {
    this.config.data = t;
  }
  get options() {
    return this._options;
  }
  set options(t) {
    this.config.options = t;
  }
  _initialize() {
    return (
      this.notifyPlugins("beforeInit"),
      this.options.responsive ? this.resize() : Ge(this, this.options.devicePixelRatio),
      this.bindEvents(),
      this.notifyPlugins("afterInit"),
      this
    );
  }
  clear() {
    return qe(this.canvas, this.ctx), this;
  }
  stop() {
    return st.stop(this), this;
  }
  resize(t, e) {
    st.running(this) ? (this._resizeBeforeDraw = { width: t, height: e }) : this._resize(t, e);
  }
  _resize(t, e) {
    const i = this.options,
      s = this.canvas,
      o = i.maintainAspectRatio && this.aspectRatio,
      a = this.platform.getMaximumSize(s, t, e, o),
      r = i.devicePixelRatio || this.platform.getDevicePixelRatio(),
      l = this.width ? "resize" : "attach";
    (this.width = a.width),
      (this.height = a.height),
      (this._aspectRatio = this.aspectRatio),
      Ge(this, r, !0) &&
        (this.notifyPlugins("resize", { size: a }),
        E(i.onResize, [this, a], this),
        this.attached && this._doResize(l) && this.render());
  }
  ensureScalesHaveIDs() {
    const e = this.options.scales || {};
    T(e, (i, s) => {
      i.id = s;
    });
  }
  buildOrUpdateScales() {
    const t = this.options,
      e = t.scales,
      i = this.scales,
      s = Object.keys(i).reduce((a, r) => ((a[r] = !1), a), {});
    let o = [];
    e &&
      (o = o.concat(
        Object.keys(e).map(a => {
          const r = e[a],
            l = Ce(a, r),
            h = l === "r",
            c = l === "x";
          return {
            options: r,
            dposition: h ? "chartArea" : c ? "bottom" : "left",
            dtype: h ? "radialLinear" : c ? "category" : "linear",
          };
        })
      )),
      T(o, a => {
        const r = a.options,
          l = r.id,
          h = Ce(l, r),
          c = C(r.type, a.dtype);
        (r.position === void 0 || Pi(r.position, h) !== Pi(a.dposition)) &&
          (r.position = a.dposition),
          (s[l] = !0);
        let d = null;
        if (l in i && i[l].type === c) d = i[l];
        else {
          const u = tt.getScale(c);
          (d = new u({
            id: l,
            type: c,
            ctx: this.ctx,
            chart: this,
          })),
            (i[d.id] = d);
        }
        d.init(r, t);
      }),
      T(s, (a, r) => {
        a || delete i[r];
      }),
      T(i, a => {
        rt.configure(this, a, a.options), rt.addBox(this, a);
      });
  }
  _updateMetasets() {
    const t = this._metasets,
      e = this.data.datasets.length,
      i = t.length;
    if ((t.sort((s, o) => s.index - o.index), i > e)) {
      for (let s = e; s < i; ++s) this._destroyDatasetMeta(s);
      t.splice(e, i - e);
    }
    this._sortedMetasets = t.slice(0).sort(Di("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const {
      _metasets: t,
      data: { datasets: e },
    } = this;
    t.length > e.length && delete this._stacks,
      t.forEach((i, s) => {
        e.filter(o => o === i._dataset).length === 0 && this._destroyDatasetMeta(s);
      });
  }
  buildOrUpdateControllers() {
    const t = [],
      e = this.data.datasets;
    let i, s;
    for (this._removeUnreferencedMetasets(), i = 0, s = e.length; i < s; i++) {
      const o = e[i];
      let a = this.getDatasetMeta(i);
      const r = o.type || this.config.type;
      if (
        (a.type && a.type !== r && (this._destroyDatasetMeta(i), (a = this.getDatasetMeta(i))),
        (a.type = r),
        (a.indexAxis = o.indexAxis || De(r, this.options)),
        (a.order = o.order || 0),
        (a.index = i),
        (a.label = "" + o.label),
        (a.visible = this.isDatasetVisible(i)),
        a.controller)
      )
        a.controller.updateIndex(i), a.controller.linkScales();
      else {
        const l = tt.getController(r),
          { datasetElementType: h, dataElementType: c } = A.datasets[r];
        Object.assign(l.prototype, {
          dataElementType: tt.getElement(c),
          datasetElementType: h && tt.getElement(h),
        }),
          (a.controller = new l(this, i)),
          t.push(a.controller);
      }
    }
    return this._updateMetasets(), t;
  }
  _resetElements() {
    T(
      this.data.datasets,
      (t, e) => {
        this.getDatasetMeta(e).controller.reset();
      },
      this
    );
  }
  reset() {
    this._resetElements(), this.notifyPlugins("reset");
  }
  update(t) {
    const e = this.config;
    e.update();
    const i = (this._options = e.createResolver(e.chartOptionScopes(), this.getContext())),
      s = (this._animationsDisabled = !i.animation);
    if (
      (this._updateScales(),
      this._checkEventBindings(),
      this._updateHiddenIndices(),
      this._plugins.invalidate(),
      this.notifyPlugins("beforeUpdate", { mode: t, cancelable: !0 }) === !1)
    )
      return;
    const o = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let a = 0;
    for (let h = 0, c = this.data.datasets.length; h < c; h++) {
      const { controller: d } = this.getDatasetMeta(h),
        u = !s && o.indexOf(d) === -1;
      d.buildOrUpdateElements(u), (a = Math.max(+d.getMaxOverflow(), a));
    }
    (a = this._minPadding = i.layout.autoPadding ? a : 0),
      this._updateLayout(a),
      s ||
        T(o, h => {
          h.reset();
        }),
      this._updateDatasets(t),
      this.notifyPlugins("afterUpdate", { mode: t }),
      this._layers.sort(Di("z", "_idx"));
    const { _active: r, _lastEvent: l } = this;
    l ? this._eventHandler(l, !0) : r.length && this._updateHoverStyles(r, r, !0), this.render();
  }
  _updateScales() {
    T(this.scales, t => {
      rt.removeBox(this, t);
    }),
      this.ensureScalesHaveIDs(),
      this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const t = this.options,
      e = new Set(Object.keys(this._listeners)),
      i = new Set(t.events);
    (!Je(e, i) || !!this._responsiveListeners !== t.responsive) &&
      (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    const { _hiddenIndices: t } = this,
      e = this._getUniformDataChanges() || [];
    for (const { method: i, start: s, count: o } of e) {
      const a = i === "_removeElements" ? -o : o;
      Zo(t, s, a);
    }
  }
  _getUniformDataChanges() {
    const t = this._dataChanges;
    if (!t || !t.length) return;
    this._dataChanges = [];
    const e = this.data.datasets.length,
      i = o => new Set(t.filter(a => a[0] === o).map((a, r) => r + "," + a.splice(1).join(","))),
      s = i(0);
    for (let o = 1; o < e; o++) if (!Je(s, i(o))) return;
    return Array.from(s)
      .map(o => o.split(","))
      .map(o => ({ method: o[1], start: +o[2], count: +o[3] }));
  }
  _updateLayout(t) {
    if (this.notifyPlugins("beforeLayout", { cancelable: !0 }) === !1) return;
    rt.update(this, this.width, this.height, t);
    const e = this.chartArea,
      i = e.width <= 0 || e.height <= 0;
    (this._layers = []),
      T(
        this.boxes,
        s => {
          (i && s.position === "chartArea") ||
            (s.configure && s.configure(), this._layers.push(...s._layers()));
        },
        this
      ),
      this._layers.forEach((s, o) => {
        s._idx = o;
      }),
      this.notifyPlugins("afterLayout");
  }
  _updateDatasets(t) {
    if (this.notifyPlugins("beforeDatasetsUpdate", { mode: t, cancelable: !0 }) !== !1) {
      for (let e = 0, i = this.data.datasets.length; e < i; ++e)
        this.getDatasetMeta(e).controller.configure();
      for (let e = 0, i = this.data.datasets.length; e < i; ++e)
        this._updateDataset(e, oe(t) ? t({ datasetIndex: e }) : t);
      this.notifyPlugins("afterDatasetsUpdate", { mode: t });
    }
  }
  _updateDataset(t, e) {
    const i = this.getDatasetMeta(t),
      s = { meta: i, index: t, mode: e, cancelable: !0 };
    this.notifyPlugins("beforeDatasetUpdate", s) !== !1 &&
      (i.controller._update(e), (s.cancelable = !1), this.notifyPlugins("afterDatasetUpdate", s));
  }
  render() {
    this.notifyPlugins("beforeRender", { cancelable: !0 }) !== !1 &&
      (st.has(this)
        ? this.attached && !st.running(this) && st.start(this)
        : (this.draw(), Ci({ chart: this })));
  }
  draw() {
    let t;
    if (this._resizeBeforeDraw) {
      const { width: i, height: s } = this._resizeBeforeDraw;
      this._resize(i, s), (this._resizeBeforeDraw = null);
    }
    if (
      (this.clear(),
      this.width <= 0 ||
        this.height <= 0 ||
        this.notifyPlugins("beforeDraw", { cancelable: !0 }) === !1)
    )
      return;
    const e = this._layers;
    for (t = 0; t < e.length && e[t].z <= 0; ++t) e[t].draw(this.chartArea);
    for (this._drawDatasets(); t < e.length; ++t) e[t].draw(this.chartArea);
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(t) {
    const e = this._sortedMetasets,
      i = [];
    let s, o;
    for (s = 0, o = e.length; s < o; ++s) {
      const a = e[s];
      (!t || a.visible) && i.push(a);
    }
    return i;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 }) === !1) return;
    const t = this.getSortedVisibleDatasetMetas();
    for (let e = t.length - 1; e >= 0; --e) this._drawDataset(t[e]);
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(t) {
    const e = this.ctx,
      i = t._clip,
      s = !i.disabled,
      o = this.chartArea,
      a = {
        meta: t,
        index: t.index,
        cancelable: !0,
      };
    this.notifyPlugins("beforeDatasetDraw", a) !== !1 &&
      (s &&
        se(e, {
          left: i.left === !1 ? 0 : o.left - i.left,
          right: i.right === !1 ? this.width : o.right + i.right,
          top: i.top === !1 ? 0 : o.top - i.top,
          bottom: i.bottom === !1 ? this.height : o.bottom + i.bottom,
        }),
      t.controller.draw(),
      s && ne(e),
      (a.cancelable = !1),
      this.notifyPlugins("afterDatasetDraw", a));
  }
  isPointInArea(t) {
    return Fe(t, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(t, e, i, s) {
    const o = go.modes[e];
    return typeof o == "function" ? o(this, t, i, s) : [];
  }
  getDatasetMeta(t) {
    const e = this.data.datasets[t],
      i = this._metasets;
    let s = i.filter(o => o && o._dataset === e).pop();
    return (
      s ||
        ((s = {
          type: null,
          data: [],
          dataset: null,
          controller: null,
          hidden: null,
          xAxisID: null,
          yAxisID: null,
          order: (e && e.order) || 0,
          index: t,
          _dataset: e,
          _parsed: [],
          _sorted: !1,
        }),
        i.push(s)),
      s
    );
  }
  getContext() {
    return this.$context || (this.$context = mt(null, { chart: this, type: "chart" }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(t) {
    const e = this.data.datasets[t];
    if (!e) return !1;
    const i = this.getDatasetMeta(t);
    return typeof i.hidden == "boolean" ? !i.hidden : !e.hidden;
  }
  setDatasetVisibility(t, e) {
    const i = this.getDatasetMeta(t);
    i.hidden = !e;
  }
  toggleDataVisibility(t) {
    this._hiddenIndices[t] = !this._hiddenIndices[t];
  }
  getDataVisibility(t) {
    return !this._hiddenIndices[t];
  }
  _updateVisibility(t, e, i) {
    const s = i ? "show" : "hide",
      o = this.getDatasetMeta(t),
      a = o.controller._resolveAnimations(void 0, s);
    It(e)
      ? ((o.data[e].hidden = !i), this.update())
      : (this.setDatasetVisibility(t, i),
        a.update(o, { visible: i }),
        this.update(r => (r.datasetIndex === t ? s : void 0)));
  }
  hide(t, e) {
    this._updateVisibility(t, e, !1);
  }
  show(t, e) {
    this._updateVisibility(t, e, !0);
  }
  _destroyDatasetMeta(t) {
    const e = this._metasets[t];
    e && e.controller && e.controller._destroy(), delete this._metasets[t];
  }
  _stop() {
    let t, e;
    for (this.stop(), st.remove(this), t = 0, e = this.data.datasets.length; t < e; ++t)
      this._destroyDatasetMeta(t);
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas: t, ctx: e } = this;
    this._stop(),
      this.config.clearCache(),
      t &&
        (this.unbindEvents(),
        qe(t, e),
        this.platform.releaseContext(e),
        (this.canvas = null),
        (this.ctx = null)),
      this.notifyPlugins("destroy"),
      delete ee[this.id],
      this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...t) {
    return this.canvas.toDataURL(...t);
  }
  bindEvents() {
    this.bindUserEvents(),
      this.options.responsive ? this.bindResponsiveEvents() : (this.attached = !0);
  }
  bindUserEvents() {
    const t = this._listeners,
      e = this.platform,
      i = (o, a) => {
        e.addEventListener(this, o, a), (t[o] = a);
      },
      s = (o, a, r) => {
        (o.offsetX = a), (o.offsetY = r), this._eventHandler(o);
      };
    T(this.options.events, o => i(o, s));
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {});
    const t = this._responsiveListeners,
      e = this.platform,
      i = (l, h) => {
        e.addEventListener(this, l, h), (t[l] = h);
      },
      s = (l, h) => {
        t[l] && (e.removeEventListener(this, l, h), delete t[l]);
      },
      o = (l, h) => {
        this.canvas && this.resize(l, h);
      };
    let a;
    const r = () => {
      s("attach", r), (this.attached = !0), this.resize(), i("resize", o), i("detach", a);
    };
    (a = () => {
      (this.attached = !1), s("resize", o), this._stop(), this._resize(0, 0), i("attach", r);
    }),
      e.isAttached(this.canvas) ? r() : a();
  }
  unbindEvents() {
    T(this._listeners, (t, e) => {
      this.platform.removeEventListener(this, e, t);
    }),
      (this._listeners = {}),
      T(this._responsiveListeners, (t, e) => {
        this.platform.removeEventListener(this, e, t);
      }),
      (this._responsiveListeners = void 0);
  }
  updateHoverStyle(t, e, i) {
    const s = i ? "set" : "remove";
    let o, a, r, l;
    for (
      e === "dataset" &&
        ((o = this.getDatasetMeta(t[0].datasetIndex)),
        o.controller["_" + s + "DatasetHoverStyle"]()),
        r = 0,
        l = t.length;
      r < l;
      ++r
    ) {
      a = t[r];
      const h = a && this.getDatasetMeta(a.datasetIndex).controller;
      h && h[s + "HoverStyle"](a.element, a.datasetIndex, a.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t) {
    const e = this._active || [],
      i = t.map(({ datasetIndex: o, index: a }) => {
        const r = this.getDatasetMeta(o);
        if (!r) throw new Error("No dataset found at index " + o);
        return {
          datasetIndex: o,
          element: r.data[a],
          index: a,
        };
      });
    !Qt(i, e) && ((this._active = i), (this._lastEvent = null), this._updateHoverStyles(i, e));
  }
  notifyPlugins(t, e, i) {
    return this._plugins.notify(this, t, e, i);
  }
  _updateHoverStyles(t, e, i) {
    const s = this.options.hover,
      o = (l, h) =>
        l.filter(c => !h.some(d => c.datasetIndex === d.datasetIndex && c.index === d.index)),
      a = o(e, t),
      r = i ? t : o(t, e);
    a.length && this.updateHoverStyle(a, s.mode, !1),
      r.length && s.mode && this.updateHoverStyle(r, s.mode, !0);
  }
  _eventHandler(t, e) {
    const i = {
        event: t,
        replay: e,
        cancelable: !0,
        inChartArea: this.isPointInArea(t),
      },
      s = a => (a.options.events || this.options.events).includes(t.native.type);
    if (this.notifyPlugins("beforeEvent", i, s) === !1) return;
    const o = this._handleEvent(t, e, i.inChartArea);
    return (
      (i.cancelable = !1),
      this.notifyPlugins("afterEvent", i, s),
      (o || i.changed) && this.render(),
      this
    );
  }
  _handleEvent(t, e, i) {
    const { _active: s = [], options: o } = this,
      a = e,
      r = this._getActiveElements(t, s, i, a),
      l = Us(t),
      h = Qo(t, this._lastEvent, i, l);
    i &&
      ((this._lastEvent = null),
      E(o.onHover, [t, r, this], this),
      l && E(o.onClick, [t, r, this], this));
    const c = !Qt(r, s);
    return (
      (c || e) && ((this._active = r), this._updateHoverStyles(r, s, e)), (this._lastEvent = h), c
    );
  }
  _getActiveElements(t, e, i, s) {
    if (t.type === "mouseout") return [];
    if (!i) return e;
    const o = this.options.hover;
    return this.getElementsAtEventForMode(t, o.mode, o, s);
  }
}
const Ai = () => T(Ss.instances, n => n._plugins.invalidate()),
  ot = !0;
Object.defineProperties(Ss, {
  defaults: {
    enumerable: ot,
    value: A,
  },
  instances: {
    enumerable: ot,
    value: ee,
  },
  overrides: {
    enumerable: ot,
    value: Pt,
  },
  registry: {
    enumerable: ot,
    value: tt,
  },
  version: {
    enumerable: ot,
    value: Go,
  },
  getChart: {
    enumerable: ot,
    value: Ms,
  },
  register: {
    enumerable: ot,
    value: (...n) => {
      tt.add(...n), Ai();
    },
  },
  unregister: {
    enumerable: ot,
    value: (...n) => {
      tt.remove(...n), Ai();
    },
  },
});
function ws(n, t, e) {
  const { startAngle: i, pixelMargin: s, x: o, y: a, outerRadius: r, innerRadius: l } = t;
  let h = s / r;
  n.beginPath(),
    n.arc(o, a, r, i - h, e + h),
    l > s ? ((h = s / l), n.arc(o, a, l, e + h, i - h, !0)) : n.arc(o, a, s, e + G, i - G),
    n.closePath(),
    n.clip();
}
function ta(n) {
  return fn(n, ["outerStart", "outerEnd", "innerStart", "innerEnd"]);
}
function ea(n, t, e, i) {
  const s = ta(n.options.borderRadius),
    o = (e - t) / 2,
    a = Math.min(o, (i * t) / 2),
    r = l => {
      const h = ((e - Math.min(o, l)) * i) / 2;
      return X(l, 0, Math.min(o, h));
    };
  return {
    outerStart: r(s.outerStart),
    outerEnd: r(s.outerEnd),
    innerStart: X(s.innerStart, 0, a),
    innerEnd: X(s.innerEnd, 0, a),
  };
}
function vt(n, t, e, i) {
  return {
    x: e + n * Math.cos(t),
    y: i + n * Math.sin(t),
  };
}
function Ae(n, t, e, i, s, o) {
  const { x: a, y: r, startAngle: l, pixelMargin: h, innerRadius: c } = t,
    d = Math.max(t.outerRadius + i + e - h, 0),
    u = c > 0 ? c + i + e + h : 0;
  let f = 0;
  const g = s - l;
  if (i) {
    const w = c > 0 ? c - i : 0,
      B = d > 0 ? d - i : 0,
      z = (w + B) / 2,
      ct = z !== 0 ? (g * z) / (z + i) : g;
    f = (g - ct) / 2;
  }
  const p = Math.max(1e-3, g * d - e / pt) / d,
    m = (g - p) / 2,
    b = l + m + f,
    x = s - m - f,
    { outerStart: v, outerEnd: y, innerStart: _, innerEnd: M } = ea(t, u, d, x - b),
    k = d - v,
    P = d - y,
    S = b + v / k,
    L = x - y / P,
    O = u + _,
    D = u + M,
    I = b + _ / O,
    H = x - M / D;
  if ((n.beginPath(), o)) {
    if ((n.arc(a, r, d, S, L), y > 0)) {
      const z = vt(P, L, a, r);
      n.arc(z.x, z.y, y, L, x + G);
    }
    const w = vt(D, x, a, r);
    if ((n.lineTo(w.x, w.y), M > 0)) {
      const z = vt(D, H, a, r);
      n.arc(z.x, z.y, M, x + G, H + Math.PI);
    }
    if ((n.arc(a, r, u, x - M / u, b + _ / u, !0), _ > 0)) {
      const z = vt(O, I, a, r);
      n.arc(z.x, z.y, _, I + Math.PI, b - G);
    }
    const B = vt(k, b, a, r);
    if ((n.lineTo(B.x, B.y), v > 0)) {
      const z = vt(k, S, a, r);
      n.arc(z.x, z.y, v, b - G, S);
    }
  } else {
    n.moveTo(a, r);
    const w = Math.cos(S) * d + a,
      B = Math.sin(S) * d + r;
    n.lineTo(w, B);
    const z = Math.cos(L) * d + a,
      ct = Math.sin(L) * d + r;
    n.lineTo(z, ct);
  }
  n.closePath();
}
function ia(n, t, e, i, s) {
  const { fullCircles: o, startAngle: a, circumference: r } = t;
  let l = t.endAngle;
  if (o) {
    Ae(n, t, e, i, a + N, s);
    for (let h = 0; h < o; ++h) n.fill();
    isNaN(r) || ((l = a + (r % N)), r % N === 0 && (l += N));
  }
  return Ae(n, t, e, i, l, s), n.fill(), l;
}
function sa(n, t, e) {
  const { x: i, y: s, startAngle: o, pixelMargin: a, fullCircles: r } = t,
    l = Math.max(t.outerRadius - a, 0),
    h = t.innerRadius + a;
  let c;
  for (e && ws(n, t, o + N), n.beginPath(), n.arc(i, s, h, o + N, o, !0), c = 0; c < r; ++c)
    n.stroke();
  for (n.beginPath(), n.arc(i, s, l, o, o + N), c = 0; c < r; ++c) n.stroke();
}
function na(n, t, e, i, s, o) {
  const { options: a } = t,
    { borderWidth: r, borderJoinStyle: l } = a,
    h = a.borderAlign === "inner";
  r &&
    (h
      ? ((n.lineWidth = r * 2), (n.lineJoin = l || "round"))
      : ((n.lineWidth = r), (n.lineJoin = l || "bevel")),
    t.fullCircles && sa(n, t, h),
    h && ws(n, t, s),
    Ae(n, t, e, i, s, o),
    n.stroke());
}
class je extends et {
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.circumference = void 0),
      (this.startAngle = void 0),
      (this.endAngle = void 0),
      (this.innerRadius = void 0),
      (this.outerRadius = void 0),
      (this.pixelMargin = 0),
      (this.fullCircles = 0),
      t && Object.assign(this, t);
  }
  inRange(t, e, i) {
    const s = this.getProps(["x", "y"], i),
      { angle: o, distance: a } = Zi(s, { x: t, y: e }),
      {
        startAngle: r,
        endAngle: l,
        innerRadius: h,
        outerRadius: c,
        circumference: d,
      } = this.getProps(
        ["startAngle", "endAngle", "innerRadius", "outerRadius", "circumference"],
        i
      ),
      u = this.options.spacing / 2,
      g = C(d, l - r) >= N || Zt(o, r, l),
      p = at(a, h + u, c + u);
    return g && p;
  }
  getCenterPoint(t) {
    const {
        x: e,
        y: i,
        startAngle: s,
        endAngle: o,
        innerRadius: a,
        outerRadius: r,
      } = this.getProps(
        ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius", "circumference"],
        t
      ),
      { offset: l, spacing: h } = this.options,
      c = (s + o) / 2,
      d = (a + r + h + l) / 2;
    return {
      x: e + Math.cos(c) * d,
      y: i + Math.sin(c) * d,
    };
  }
  tooltipPosition(t) {
    return this.getCenterPoint(t);
  }
  draw(t) {
    const { options: e, circumference: i } = this,
      s = (e.offset || 0) / 2,
      o = (e.spacing || 0) / 2,
      a = e.circular;
    if (
      ((this.pixelMargin = e.borderAlign === "inner" ? 0.33 : 0),
      (this.fullCircles = i > N ? Math.floor(i / N) : 0),
      i === 0 || this.innerRadius < 0 || this.outerRadius < 0)
    )
      return;
    t.save();
    let r = 0;
    if (s) {
      r = s / 2;
      const h = (this.startAngle + this.endAngle) / 2;
      t.translate(Math.cos(h) * r, Math.sin(h) * r), this.circumference >= pt && (r = s);
    }
    (t.fillStyle = e.backgroundColor), (t.strokeStyle = e.borderColor);
    const l = ia(t, this, r, o, a);
    na(t, this, r, o, l, a), t.restore();
  }
}
je.id = "arc";
je.defaults = {
  borderAlign: "center",
  borderColor: "#fff",
  borderJoinStyle: void 0,
  borderRadius: 0,
  borderWidth: 2,
  offset: 0,
  spacing: 0,
  angle: void 0,
  circular: !0,
};
je.defaultRoutes = {
  backgroundColor: "backgroundColor",
};
function Ps(n, t, e = t) {
  (n.lineCap = C(e.borderCapStyle, t.borderCapStyle)),
    n.setLineDash(C(e.borderDash, t.borderDash)),
    (n.lineDashOffset = C(e.borderDashOffset, t.borderDashOffset)),
    (n.lineJoin = C(e.borderJoinStyle, t.borderJoinStyle)),
    (n.lineWidth = C(e.borderWidth, t.borderWidth)),
    (n.strokeStyle = C(e.borderColor, t.borderColor));
}
function oa(n, t, e) {
  n.lineTo(e.x, e.y);
}
function aa(n) {
  return n.stepped ? ln : n.tension || n.cubicInterpolationMode === "monotone" ? hn : oa;
}
function Ds(n, t, e = {}) {
  const i = n.length,
    { start: s = 0, end: o = i - 1 } = e,
    { start: a, end: r } = t,
    l = Math.max(s, a),
    h = Math.min(o, r),
    c = (s < a && o < a) || (s > r && o > r);
  return {
    count: i,
    start: l,
    loop: t.loop,
    ilen: h < l && !c ? i + h - l : h - l,
  };
}
function ra(n, t, e, i) {
  const { points: s, options: o } = t,
    { count: a, start: r, loop: l, ilen: h } = Ds(s, e, i),
    c = aa(o);
  let { move: d = !0, reverse: u } = i || {},
    f,
    g,
    p;
  for (f = 0; f <= h; ++f)
    (g = s[(r + (u ? h - f : f)) % a]),
      !g.skip && (d ? (n.moveTo(g.x, g.y), (d = !1)) : c(n, p, g, u, o.stepped), (p = g));
  return l && ((g = s[(r + (u ? h : 0)) % a]), c(n, p, g, u, o.stepped)), !!l;
}
function la(n, t, e, i) {
  const s = t.points,
    { count: o, start: a, ilen: r } = Ds(s, e, i),
    { move: l = !0, reverse: h } = i || {};
  let c = 0,
    d = 0,
    u,
    f,
    g,
    p,
    m,
    b;
  const x = y => (a + (h ? r - y : y)) % o,
    v = () => {
      p !== m && (n.lineTo(c, m), n.lineTo(c, p), n.lineTo(c, b));
    };
  for (l && ((f = s[x(0)]), n.moveTo(f.x, f.y)), u = 0; u <= r; ++u) {
    if (((f = s[x(u)]), f.skip)) continue;
    const y = f.x,
      _ = f.y,
      M = y | 0;
    M === g
      ? (_ < p ? (p = _) : _ > m && (m = _), (c = (d * c + y) / ++d))
      : (v(), n.lineTo(y, _), (g = M), (d = 0), (p = m = _)),
      (b = _);
  }
  v();
}
function Le(n) {
  const t = n.options,
    e = t.borderDash && t.borderDash.length;
  return !n._decimated &&
    !n._loop &&
    !t.tension &&
    t.cubicInterpolationMode !== "monotone" &&
    !t.stepped &&
    !e
    ? la
    : ra;
}
function ha(n) {
  return n.stepped ? Xs : n.tension || n.cubicInterpolationMode === "monotone" ? Ks : Gs;
}
function ca(n, t, e, i) {
  let s = t._path;
  s || ((s = t._path = new Path2D()), t.path(s, e, i) && s.closePath()),
    Ps(n, t.options),
    n.stroke(s);
}
function da(n, t, e, i) {
  const { segments: s, options: o } = t,
    a = Le(t);
  for (const r of s)
    Ps(n, o, r.style),
      n.beginPath(),
      a(n, t, r, { start: e, end: e + i - 1 }) && n.closePath(),
      n.stroke();
}
const ua = typeof Path2D == "function";
function fa(n, t, e, i) {
  ua && !t.options.segment ? ca(n, t, e, i) : da(n, t, e, i);
}
class xt extends et {
  constructor(t) {
    super(),
      (this.animated = !0),
      (this.options = void 0),
      (this._chart = void 0),
      (this._loop = void 0),
      (this._fullLoop = void 0),
      (this._path = void 0),
      (this._points = void 0),
      (this._segments = void 0),
      (this._decimated = !1),
      (this._pointsUpdated = !1),
      (this._datasetIndex = void 0),
      t && Object.assign(this, t);
  }
  updateControlPoints(t, e) {
    const i = this.options;
    if (
      (i.tension || i.cubicInterpolationMode === "monotone") &&
      !i.stepped &&
      !this._pointsUpdated
    ) {
      const s = i.spanGaps ? this._loop : this._fullLoop;
      Fs(this._points, i, t, s, e), (this._pointsUpdated = !0);
    }
  }
  set points(t) {
    (this._points = t), delete this._segments, delete this._path, (this._pointsUpdated = !1);
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = zs(this, this.options.segment));
  }
  first() {
    const t = this.segments,
      e = this.points;
    return t.length && e[t[0].start];
  }
  last() {
    const t = this.segments,
      e = this.points,
      i = t.length;
    return i && e[t[i - 1].end];
  }
  interpolate(t, e) {
    const i = this.options,
      s = t[e],
      o = this.points,
      a = Qi(this, { property: e, start: s, end: s });
    if (!a.length) return;
    const r = [],
      l = ha(i);
    let h, c;
    for (h = 0, c = a.length; h < c; ++h) {
      const { start: d, end: u } = a[h],
        f = o[d],
        g = o[u];
      if (f === g) {
        r.push(f);
        continue;
      }
      const p = Math.abs((s - f[e]) / (g[e] - f[e])),
        m = l(f, g, p, i.stepped);
      (m[e] = t[e]), r.push(m);
    }
    return r.length === 1 ? r[0] : r;
  }
  pathSegment(t, e, i) {
    return Le(this)(t, this, e, i);
  }
  path(t, e, i) {
    const s = this.segments,
      o = Le(this);
    let a = this._loop;
    (e = e || 0), (i = i || this.points.length - e);
    for (const r of s) a &= o(t, this, r, { start: e, end: e + i - 1 });
    return !!a;
  }
  draw(t, e, i, s) {
    const o = this.options || {};
    (this.points || []).length && o.borderWidth && (t.save(), fa(t, this, i, s), t.restore()),
      this.animated && ((this._pointsUpdated = !1), (this._path = void 0));
  }
}
xt.id = "line";
xt.defaults = {
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderWidth: 3,
  capBezierPoints: !0,
  cubicInterpolationMode: "default",
  fill: !1,
  spanGaps: !1,
  stepped: !1,
  tension: 0,
};
xt.defaultRoutes = {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor",
};
xt.descriptors = {
  _scriptable: !0,
  _indexable: n => n !== "borderDash" && n !== "fill",
};
function Li(n, t, e, i) {
  const s = n.options,
    { [e]: o } = n.getProps([e], i);
  return Math.abs(t - o) < s.radius + s.hitRadius;
}
class $e extends et {
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.parsed = void 0),
      (this.skip = void 0),
      (this.stop = void 0),
      t && Object.assign(this, t);
  }
  inRange(t, e, i) {
    const s = this.options,
      { x: o, y: a } = this.getProps(["x", "y"], i);
    return Math.pow(t - o, 2) + Math.pow(e - a, 2) < Math.pow(s.hitRadius + s.radius, 2);
  }
  inXRange(t, e) {
    return Li(this, t, "x", e);
  }
  inYRange(t, e) {
    return Li(this, t, "y", e);
  }
  getCenterPoint(t) {
    const { x: e, y: i } = this.getProps(["x", "y"], t);
    return { x: e, y: i };
  }
  size(t) {
    t = t || this.options || {};
    let e = t.radius || 0;
    e = Math.max(e, (e && t.hoverRadius) || 0);
    const i = (e && t.borderWidth) || 0;
    return (e + i) * 2;
  }
  draw(t, e) {
    const i = this.options;
    this.skip ||
      i.radius < 0.1 ||
      !Fe(this, e, this.size(i) / 2) ||
      ((t.strokeStyle = i.borderColor),
      (t.lineWidth = i.borderWidth),
      (t.fillStyle = i.backgroundColor),
      Se(t, i, this.x, this.y));
  }
  getRange() {
    const t = this.options || {};
    return t.radius + t.hitRadius;
  }
}
$e.id = "point";
$e.defaults = {
  borderWidth: 1,
  hitRadius: 1,
  hoverBorderWidth: 1,
  hoverRadius: 4,
  pointStyle: "circle",
  radius: 3,
  rotation: 0,
};
$e.defaultRoutes = {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor",
};
function Cs(n, t) {
  const {
    x: e,
    y: i,
    base: s,
    width: o,
    height: a,
  } = n.getProps(["x", "y", "base", "width", "height"], t);
  let r, l, h, c, d;
  return (
    n.horizontal
      ? ((d = a / 2), (r = Math.min(e, s)), (l = Math.max(e, s)), (h = i - d), (c = i + d))
      : ((d = o / 2), (r = e - d), (l = e + d), (h = Math.min(i, s)), (c = Math.max(i, s))),
    { left: r, top: h, right: l, bottom: c }
  );
}
function lt(n, t, e, i) {
  return n ? 0 : X(t, e, i);
}
function ga(n, t, e) {
  const i = n.options.borderWidth,
    s = n.borderSkipped,
    o = tn(i);
  return {
    t: lt(s.top, o.top, 0, e),
    r: lt(s.right, o.right, 0, t),
    b: lt(s.bottom, o.bottom, 0, e),
    l: lt(s.left, o.left, 0, t),
  };
}
function pa(n, t, e) {
  const { enableBorderRadius: i } = n.getProps(["enableBorderRadius"]),
    s = n.options.borderRadius,
    o = gt(s),
    a = Math.min(t, e),
    r = n.borderSkipped,
    l = i || F(s);
  return {
    topLeft: lt(!l || r.top || r.left, o.topLeft, 0, a),
    topRight: lt(!l || r.top || r.right, o.topRight, 0, a),
    bottomLeft: lt(!l || r.bottom || r.left, o.bottomLeft, 0, a),
    bottomRight: lt(!l || r.bottom || r.right, o.bottomRight, 0, a),
  };
}
function ma(n) {
  const t = Cs(n),
    e = t.right - t.left,
    i = t.bottom - t.top,
    s = ga(n, e / 2, i / 2),
    o = pa(n, e / 2, i / 2);
  return {
    outer: {
      x: t.left,
      y: t.top,
      w: e,
      h: i,
      radius: o,
    },
    inner: {
      x: t.left + s.l,
      y: t.top + s.t,
      w: e - s.l - s.r,
      h: i - s.t - s.b,
      radius: {
        topLeft: Math.max(0, o.topLeft - Math.max(s.t, s.l)),
        topRight: Math.max(0, o.topRight - Math.max(s.t, s.r)),
        bottomLeft: Math.max(0, o.bottomLeft - Math.max(s.b, s.l)),
        bottomRight: Math.max(0, o.bottomRight - Math.max(s.b, s.r)),
      },
    },
  };
}
function ve(n, t, e, i) {
  const s = t === null,
    o = e === null,
    r = n && !(s && o) && Cs(n, i);
  return r && (s || at(t, r.left, r.right)) && (o || at(e, r.top, r.bottom));
}
function ba(n) {
  return n.topLeft || n.topRight || n.bottomLeft || n.bottomRight;
}
function xa(n, t) {
  n.rect(t.x, t.y, t.w, t.h);
}
function ke(n, t, e = {}) {
  const i = n.x !== e.x ? -t : 0,
    s = n.y !== e.y ? -t : 0,
    o = (n.x + n.w !== e.x + e.w ? t : 0) - i,
    a = (n.y + n.h !== e.y + e.h ? t : 0) - s;
  return {
    x: n.x + i,
    y: n.y + s,
    w: n.w + o,
    h: n.h + a,
    radius: n.radius,
  };
}
class Ye extends et {
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.horizontal = void 0),
      (this.base = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.inflateAmount = void 0),
      t && Object.assign(this, t);
  }
  draw(t) {
    const {
        inflateAmount: e,
        options: { borderColor: i, backgroundColor: s },
      } = this,
      { inner: o, outer: a } = ma(this),
      r = ba(a.radius) ? Ft : xa;
    t.save(),
      (a.w !== o.w || a.h !== o.h) &&
        (t.beginPath(),
        r(t, ke(a, e, o)),
        t.clip(),
        r(t, ke(o, -e, a)),
        (t.fillStyle = i),
        t.fill("evenodd")),
      t.beginPath(),
      r(t, ke(o, e)),
      (t.fillStyle = s),
      t.fill(),
      t.restore();
  }
  inRange(t, e, i) {
    return ve(this, t, e, i);
  }
  inXRange(t, e) {
    return ve(this, t, null, e);
  }
  inYRange(t, e) {
    return ve(this, null, t, e);
  }
  getCenterPoint(t) {
    const {
      x: e,
      y: i,
      base: s,
      horizontal: o,
    } = this.getProps(["x", "y", "base", "horizontal"], t);
    return {
      x: o ? (e + s) / 2 : e,
      y: o ? i : (i + s) / 2,
    };
  }
  getRange(t) {
    return t === "x" ? this.width / 2 : this.height / 2;
  }
}
Ye.id = "bar";
Ye.defaults = {
  borderSkipped: "start",
  borderWidth: 0,
  borderRadius: 0,
  inflateAmount: "auto",
  pointStyle: void 0,
};
Ye.defaultRoutes = {
  backgroundColor: "backgroundColor",
  borderColor: "borderColor",
};
function _a(n, t, e) {
  const i = n.segments,
    s = n.points,
    o = t.points,
    a = [];
  for (const r of i) {
    let { start: l, end: h } = r;
    h = Ue(l, h, s);
    const c = Oe(e, s[l], s[h], r.loop);
    if (!t.segments) {
      a.push({
        source: r,
        target: c,
        start: s[l],
        end: s[h],
      });
      continue;
    }
    const d = Qi(t, c);
    for (const u of d) {
      const f = Oe(e, o[u.start], o[u.end], u.loop),
        g = cn(r, s, f);
      for (const p of g)
        a.push({
          source: p,
          target: u,
          start: {
            [e]: Oi(c, f, "start", Math.max),
          },
          end: {
            [e]: Oi(c, f, "end", Math.min),
          },
        });
    }
  }
  return a;
}
function Oe(n, t, e, i) {
  if (i) return;
  let s = t[n],
    o = e[n];
  return n === "angle" && ((s = zt(s)), (o = zt(o))), { property: n, start: s, end: o };
}
function ya(n, t) {
  const { x: e = null, y: i = null } = n || {},
    s = t.points,
    o = [];
  return (
    t.segments.forEach(({ start: a, end: r }) => {
      r = Ue(a, r, s);
      const l = s[a],
        h = s[r];
      i !== null
        ? (o.push({ x: l.x, y: i }), o.push({ x: h.x, y: i }))
        : e !== null && (o.push({ x: e, y: l.y }), o.push({ x: e, y: h.y }));
    }),
    o
  );
}
function Ue(n, t, e) {
  for (; t > n; t--) {
    const i = e[t];
    if (!isNaN(i.x) && !isNaN(i.y)) break;
  }
  return t;
}
function Oi(n, t, e, i) {
  return n && t ? i(n[e], t[e]) : n ? n[e] : t ? t[e] : 0;
}
function As(n, t) {
  let e = [],
    i = !1;
  return (
    j(n) ? ((i = !0), (e = n)) : (e = ya(n, t)),
    e.length
      ? new xt({
          points: e,
          options: { tension: 0 },
          _loop: i,
          _fullLoop: i,
        })
      : null
  );
}
function Ti(n) {
  return n && n.fill !== !1;
}
function va(n, t, e) {
  let s = n[t].fill;
  const o = [t];
  let a;
  if (!e) return s;
  for (; s !== !1 && o.indexOf(s) === -1; ) {
    if (!V(s)) return s;
    if (((a = n[s]), !a)) return !1;
    if (a.visible) return s;
    o.push(s), (s = a.fill);
  }
  return !1;
}
function ka(n, t, e) {
  const i = Pa(n);
  if (F(i)) return isNaN(i.value) ? !1 : i;
  let s = parseFloat(i);
  return V(s) && Math.floor(s) === s
    ? Ma(i[0], t, s, e)
    : ["origin", "start", "end", "stack", "shape"].indexOf(i) >= 0 && i;
}
function Ma(n, t, e, i) {
  return (n === "-" || n === "+") && (e = t + e), e === t || e < 0 || e >= i ? !1 : e;
}
function Sa(n, t) {
  let e = null;
  return (
    n === "start"
      ? (e = t.bottom)
      : n === "end"
      ? (e = t.top)
      : F(n)
      ? (e = t.getPixelForValue(n.value))
      : t.getBasePixel && (e = t.getBasePixel()),
    e
  );
}
function wa(n, t, e) {
  let i;
  return (
    n === "start"
      ? (i = e)
      : n === "end"
      ? (i = t.options.reverse ? t.min : t.max)
      : F(n)
      ? (i = n.value)
      : (i = t.getBaseValue()),
    i
  );
}
function Pa(n) {
  const t = n.options,
    e = t.fill;
  let i = C(e && e.target, e);
  return (
    i === void 0 && (i = !!t.backgroundColor), i === !1 || i === null ? !1 : i === !0 ? "origin" : i
  );
}
function Da(n) {
  const { scale: t, index: e, line: i } = n,
    s = [],
    o = i.segments,
    a = i.points,
    r = Ca(t, e);
  r.push(As({ x: null, y: t.bottom }, i));
  for (let l = 0; l < o.length; l++) {
    const h = o[l];
    for (let c = h.start; c <= h.end; c++) Aa(s, a[c], r);
  }
  return new xt({ points: s, options: {} });
}
function Ca(n, t) {
  const e = [],
    i = n.getMatchingVisibleMetas("line");
  for (let s = 0; s < i.length; s++) {
    const o = i[s];
    if (o.index === t) break;
    o.hidden || e.unshift(o.dataset);
  }
  return e;
}
function Aa(n, t, e) {
  const i = [];
  for (let s = 0; s < e.length; s++) {
    const o = e[s],
      { first: a, last: r, point: l } = La(o, t, "x");
    if (!(!l || (a && r))) {
      if (a) i.unshift(l);
      else if ((n.push(l), !r)) break;
    }
  }
  n.push(...i);
}
function La(n, t, e) {
  const i = n.interpolate(t, e);
  if (!i) return {};
  const s = i[e],
    o = n.segments,
    a = n.points;
  let r = !1,
    l = !1;
  for (let h = 0; h < o.length; h++) {
    const c = o[h],
      d = a[c.start][e],
      u = a[c.end][e];
    if (at(s, d, u)) {
      (r = s === d), (l = s === u);
      break;
    }
  }
  return { first: r, last: l, point: i };
}
class Ls {
  constructor(t) {
    (this.x = t.x), (this.y = t.y), (this.radius = t.radius);
  }
  pathSegment(t, e, i) {
    const { x: s, y: o, radius: a } = this;
    return (e = e || { start: 0, end: N }), t.arc(s, o, a, e.end, e.start, !0), !i.bounds;
  }
  interpolate(t) {
    const { x: e, y: i, radius: s } = this,
      o = t.angle;
    return {
      x: e + Math.cos(o) * s,
      y: i + Math.sin(o) * s,
      angle: o,
    };
  }
}
function Oa(n) {
  const { chart: t, fill: e, line: i } = n;
  if (V(e)) return Ta(t, e);
  if (e === "stack") return Da(n);
  if (e === "shape") return !0;
  const s = Ea(n);
  return s instanceof Ls ? s : As(s, i);
}
function Ta(n, t) {
  const e = n.getDatasetMeta(t);
  return e && n.isDatasetVisible(t) ? e.dataset : null;
}
function Ea(n) {
  return (n.scale || {}).getPointPositionForValue ? Fa(n) : Ra(n);
}
function Ra(n) {
  const { scale: t = {}, fill: e } = n,
    i = Sa(e, t);
  if (V(i)) {
    const s = t.isHorizontal();
    return {
      x: s ? i : null,
      y: s ? null : i,
    };
  }
  return null;
}
function Fa(n) {
  const { scale: t, fill: e } = n,
    i = t.options,
    s = t.getLabels().length,
    o = i.reverse ? t.max : t.min,
    a = wa(e, t, o),
    r = [];
  if (i.grid.circular) {
    const l = t.getPointPositionForValue(0, o);
    return new Ls({
      x: l.x,
      y: l.y,
      radius: t.getDistanceFromCenterForValue(a),
    });
  }
  for (let l = 0; l < s; ++l) r.push(t.getPointPositionForValue(l, a));
  return r;
}
function Me(n, t, e) {
  const i = Oa(t),
    { line: s, scale: o, axis: a } = t,
    r = s.options,
    l = r.fill,
    h = r.backgroundColor,
    { above: c = h, below: d = h } = l || {};
  i &&
    s.points.length &&
    (se(n, e),
    za(n, { line: s, target: i, above: c, below: d, area: e, scale: o, axis: a }),
    ne(n));
}
function za(n, t) {
  const { line: e, target: i, above: s, below: o, area: a, scale: r } = t,
    l = e._loop ? "angle" : t.axis;
  n.save(),
    l === "x" &&
      o !== s &&
      (Ei(n, i, a.top),
      Ri(n, { line: e, target: i, color: s, scale: r, property: l }),
      n.restore(),
      n.save(),
      Ei(n, i, a.bottom)),
    Ri(n, { line: e, target: i, color: o, scale: r, property: l }),
    n.restore();
}
function Ei(n, t, e) {
  const { segments: i, points: s } = t;
  let o = !0,
    a = !1;
  n.beginPath();
  for (const r of i) {
    const { start: l, end: h } = r,
      c = s[l],
      d = s[Ue(l, h, s)];
    o ? (n.moveTo(c.x, c.y), (o = !1)) : (n.lineTo(c.x, e), n.lineTo(c.x, c.y)),
      (a = !!t.pathSegment(n, r, { move: a })),
      a ? n.closePath() : n.lineTo(d.x, e);
  }
  n.lineTo(t.first().x, e), n.closePath(), n.clip();
}
function Ri(n, t) {
  const { line: e, target: i, property: s, color: o, scale: a } = t,
    r = _a(e, i, s);
  for (const { source: l, target: h, start: c, end: d } of r) {
    const { style: { backgroundColor: u = o } = {} } = l,
      f = i !== !0;
    n.save(), (n.fillStyle = u), Ia(n, a, f && Oe(s, c, d)), n.beginPath();
    const g = !!e.pathSegment(n, l);
    let p;
    if (f) {
      g ? n.closePath() : Fi(n, i, d, s);
      const m = !!i.pathSegment(n, h, { move: g, reverse: !0 });
      (p = g && m), p || Fi(n, i, c, s);
    }
    n.closePath(), n.fill(p ? "evenodd" : "nonzero"), n.restore();
  }
}
function Ia(n, t, e) {
  const { top: i, bottom: s } = t.chart.chartArea,
    { property: o, start: a, end: r } = e || {};
  o === "x" && (n.beginPath(), n.rect(a, i, r - a, s - i), n.clip());
}
function Fi(n, t, e, i) {
  const s = t.interpolate(e, i);
  s && n.lineTo(s.x, s.y);
}
var fr = {
  id: "filler",
  afterDatasetsUpdate(n, t, e) {
    const i = (n.data.datasets || []).length,
      s = [];
    let o, a, r, l;
    for (a = 0; a < i; ++a)
      (o = n.getDatasetMeta(a)),
        (r = o.dataset),
        (l = null),
        r &&
          r.options &&
          r instanceof xt &&
          (l = {
            visible: n.isDatasetVisible(a),
            index: a,
            fill: ka(r, a, i),
            chart: n,
            axis: o.controller.options.indexAxis,
            scale: o.vScale,
            line: r,
          }),
        (o.$filler = l),
        s.push(l);
    for (a = 0; a < i; ++a) (l = s[a]), !(!l || l.fill === !1) && (l.fill = va(s, a, e.propagate));
  },
  beforeDraw(n, t, e) {
    const i = e.drawTime === "beforeDraw",
      s = n.getSortedVisibleDatasetMetas(),
      o = n.chartArea;
    for (let a = s.length - 1; a >= 0; --a) {
      const r = s[a].$filler;
      r && (r.line.updateControlPoints(o, r.axis), i && r.fill && Me(n.ctx, r, o));
    }
  },
  beforeDatasetsDraw(n, t, e) {
    if (e.drawTime !== "beforeDatasetsDraw") return;
    const i = n.getSortedVisibleDatasetMetas();
    for (let s = i.length - 1; s >= 0; --s) {
      const o = i[s].$filler;
      Ti(o) && Me(n.ctx, o, n.chartArea);
    }
  },
  beforeDatasetDraw(n, t, e) {
    const i = t.meta.$filler;
    !Ti(i) || e.drawTime !== "beforeDatasetDraw" || Me(n.ctx, i, n.chartArea);
  },
  defaults: {
    propagate: !0,
    drawTime: "beforeDatasetDraw",
  },
};
const zi = (n, t) => {
    let { boxHeight: e = t, boxWidth: i = t } = n;
    return (
      n.usePointStyle && ((e = Math.min(e, t)), (i = n.pointStyleWidth || Math.min(i, t))),
      {
        boxWidth: i,
        boxHeight: e,
        itemHeight: Math.max(t, e),
      }
    );
  },
  Ba = (n, t) =>
    n !== null && t !== null && n.datasetIndex === t.datasetIndex && n.index === t.index;
class Ii extends et {
  constructor(t) {
    super(),
      (this._added = !1),
      (this.legendHitBoxes = []),
      (this._hoveredItem = null),
      (this.doughnutMode = !1),
      (this.chart = t.chart),
      (this.options = t.options),
      (this.ctx = t.ctx),
      (this.legendItems = void 0),
      (this.columnSizes = void 0),
      (this.lineWidths = void 0),
      (this.maxHeight = void 0),
      (this.maxWidth = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.left = void 0),
      (this.right = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this._margins = void 0),
      (this.position = void 0),
      (this.weight = void 0),
      (this.fullSize = void 0);
  }
  update(t, e, i) {
    (this.maxWidth = t),
      (this.maxHeight = e),
      (this._margins = i),
      this.setDimensions(),
      this.buildLabels(),
      this.fit();
  }
  setDimensions() {
    this.isHorizontal()
      ? ((this.width = this.maxWidth), (this.left = this._margins.left), (this.right = this.width))
      : ((this.height = this.maxHeight),
        (this.top = this._margins.top),
        (this.bottom = this.height));
  }
  buildLabels() {
    const t = this.options.labels || {};
    let e = E(t.generateLabels, [this.chart], this) || [];
    t.filter && (e = e.filter(i => t.filter(i, this.chart.data))),
      t.sort && (e = e.sort((i, s) => t.sort(i, s, this.chart.data))),
      this.options.reverse && e.reverse(),
      (this.legendItems = e);
  }
  fit() {
    const { options: t, ctx: e } = this;
    if (!t.display) {
      this.width = this.height = 0;
      return;
    }
    const i = t.labels,
      s = W(i.font),
      o = s.size,
      a = this._computeTitleHeight(),
      { boxWidth: r, itemHeight: l } = zi(i, o);
    let h, c;
    (e.font = s.string),
      this.isHorizontal()
        ? ((h = this.maxWidth), (c = this._fitRows(a, o, r, l) + 10))
        : ((c = this.maxHeight), (h = this._fitCols(a, o, r, l) + 10)),
      (this.width = Math.min(h, t.maxWidth || this.maxWidth)),
      (this.height = Math.min(c, t.maxHeight || this.maxHeight));
  }
  _fitRows(t, e, i, s) {
    const {
        ctx: o,
        maxWidth: a,
        options: {
          labels: { padding: r },
        },
      } = this,
      l = (this.legendHitBoxes = []),
      h = (this.lineWidths = [0]),
      c = s + r;
    let d = t;
    (o.textAlign = "left"), (o.textBaseline = "middle");
    let u = -1,
      f = -c;
    return (
      this.legendItems.forEach((g, p) => {
        const m = i + e / 2 + o.measureText(g.text).width;
        (p === 0 || h[h.length - 1] + m + 2 * r > a) &&
          ((d += c), (h[h.length - (p > 0 ? 0 : 1)] = 0), (f += c), u++),
          (l[p] = { left: 0, top: f, row: u, width: m, height: s }),
          (h[h.length - 1] += m + r);
      }),
      d
    );
  }
  _fitCols(t, e, i, s) {
    const {
        ctx: o,
        maxHeight: a,
        options: {
          labels: { padding: r },
        },
      } = this,
      l = (this.legendHitBoxes = []),
      h = (this.columnSizes = []),
      c = a - t;
    let d = r,
      u = 0,
      f = 0,
      g = 0,
      p = 0;
    return (
      this.legendItems.forEach((m, b) => {
        const x = i + e / 2 + o.measureText(m.text).width;
        b > 0 &&
          f + s + 2 * r > c &&
          ((d += u + r), h.push({ width: u, height: f }), (g += u + r), p++, (u = f = 0)),
          (l[b] = { left: g, top: f, col: p, width: x, height: s }),
          (u = Math.max(u, x)),
          (f += s + r);
      }),
      (d += u),
      h.push({ width: u, height: f }),
      d
    );
  }
  adjustHitBoxes() {
    if (!this.options.display) return;
    const t = this._computeTitleHeight(),
      {
        legendHitBoxes: e,
        options: {
          align: i,
          labels: { padding: s },
          rtl: o,
        },
      } = this,
      a = kt(o, this.left, this.width);
    if (this.isHorizontal()) {
      let r = 0,
        l = U(i, this.left + s, this.right - this.lineWidths[r]);
      for (const h of e)
        r !== h.row && ((r = h.row), (l = U(i, this.left + s, this.right - this.lineWidths[r]))),
          (h.top += this.top + t + s),
          (h.left = a.leftForLtr(a.x(l), h.width)),
          (l += h.width + s);
    } else {
      let r = 0,
        l = U(i, this.top + t + s, this.bottom - this.columnSizes[r].height);
      for (const h of e)
        h.col !== r &&
          ((r = h.col), (l = U(i, this.top + t + s, this.bottom - this.columnSizes[r].height))),
          (h.top = l),
          (h.left += this.left + s),
          (h.left = a.leftForLtr(a.x(h.left), h.width)),
          (l += h.height + s);
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const t = this.ctx;
      se(t, this), this._draw(), ne(t);
    }
  }
  _draw() {
    const { options: t, columnSizes: e, lineWidths: i, ctx: s } = this,
      { align: o, labels: a } = t,
      r = A.color,
      l = kt(t.rtl, this.left, this.width),
      h = W(a.font),
      { color: c, padding: d } = a,
      u = h.size,
      f = u / 2;
    let g;
    this.drawTitle(),
      (s.textAlign = l.textAlign("left")),
      (s.textBaseline = "middle"),
      (s.lineWidth = 0.5),
      (s.font = h.string);
    const { boxWidth: p, boxHeight: m, itemHeight: b } = zi(a, u),
      x = function (k, P, S) {
        if (isNaN(p) || p <= 0 || isNaN(m) || m < 0) return;
        s.save();
        const L = C(S.lineWidth, 1);
        if (
          ((s.fillStyle = C(S.fillStyle, r)),
          (s.lineCap = C(S.lineCap, "butt")),
          (s.lineDashOffset = C(S.lineDashOffset, 0)),
          (s.lineJoin = C(S.lineJoin, "miter")),
          (s.lineWidth = L),
          (s.strokeStyle = C(S.strokeStyle, r)),
          s.setLineDash(C(S.lineDash, [])),
          a.usePointStyle)
        ) {
          const O = {
              radius: (m * Math.SQRT2) / 2,
              pointStyle: S.pointStyle,
              rotation: S.rotation,
              borderWidth: L,
            },
            D = l.xPlus(k, p / 2),
            I = P + f;
          dn(s, O, D, I, a.pointStyleWidth && p);
        } else {
          const O = P + Math.max((u - m) / 2, 0),
            D = l.leftForLtr(k, p),
            I = gt(S.borderRadius);
          s.beginPath(),
            Object.values(I).some(H => H !== 0)
              ? Ft(s, {
                  x: D,
                  y: O,
                  w: p,
                  h: m,
                  radius: I,
                })
              : s.rect(D, O, p, m),
            s.fill(),
            L !== 0 && s.stroke();
        }
        s.restore();
      },
      v = function (k, P, S) {
        Mt(s, S.text, k, P + b / 2, h, {
          strikethrough: S.hidden,
          textAlign: l.textAlign(S.textAlign),
        });
      },
      y = this.isHorizontal(),
      _ = this._computeTitleHeight();
    y
      ? (g = {
          x: U(o, this.left + d, this.right - i[0]),
          y: this.top + d + _,
          line: 0,
        })
      : (g = {
          x: this.left + d,
          y: U(o, this.top + _ + d, this.bottom - e[0].height),
          line: 0,
        }),
      ts(this.ctx, t.textDirection);
    const M = b + d;
    this.legendItems.forEach((k, P) => {
      (s.strokeStyle = k.fontColor || c), (s.fillStyle = k.fontColor || c);
      const S = s.measureText(k.text).width,
        L = l.textAlign(k.textAlign || (k.textAlign = a.textAlign)),
        O = p + f + S;
      let D = g.x,
        I = g.y;
      l.setWidth(this.width),
        y
          ? P > 0 &&
            D + O + d > this.right &&
            ((I = g.y += M), g.line++, (D = g.x = U(o, this.left + d, this.right - i[g.line])))
          : P > 0 &&
            I + M > this.bottom &&
            ((D = g.x = D + e[g.line].width + d),
            g.line++,
            (I = g.y = U(o, this.top + _ + d, this.bottom - e[g.line].height)));
      const H = l.x(D);
      x(H, I, k),
        (D = en(L, D + p + f, y ? D + O : this.right, t.rtl)),
        v(l.x(D), I, k),
        y ? (g.x += O + d) : (g.y += M);
    }),
      es(this.ctx, t.textDirection);
  }
  drawTitle() {
    const t = this.options,
      e = t.title,
      i = W(e.font),
      s = $(e.padding);
    if (!e.display) return;
    const o = kt(t.rtl, this.left, this.width),
      a = this.ctx,
      r = e.position,
      l = i.size / 2,
      h = s.top + l;
    let c,
      d = this.left,
      u = this.width;
    if (this.isHorizontal())
      (u = Math.max(...this.lineWidths)), (c = this.top + h), (d = U(t.align, d, this.right - u));
    else {
      const g = this.columnSizes.reduce((p, m) => Math.max(p, m.height), 0);
      c = h + U(t.align, this.top, this.bottom - g - t.labels.padding - this._computeTitleHeight());
    }
    const f = U(r, d, d + u);
    (a.textAlign = o.textAlign(as(r))),
      (a.textBaseline = "middle"),
      (a.strokeStyle = e.color),
      (a.fillStyle = e.color),
      (a.font = i.string),
      Mt(a, e.text, f, c, i);
  }
  _computeTitleHeight() {
    const t = this.options.title,
      e = W(t.font),
      i = $(t.padding);
    return t.display ? e.lineHeight + i.height : 0;
  }
  _getLegendItemAt(t, e) {
    let i, s, o;
    if (at(t, this.left, this.right) && at(e, this.top, this.bottom)) {
      for (o = this.legendHitBoxes, i = 0; i < o.length; ++i)
        if (((s = o[i]), at(t, s.left, s.left + s.width) && at(e, s.top, s.top + s.height)))
          return this.legendItems[i];
    }
    return null;
  }
  handleEvent(t) {
    const e = this.options;
    if (!Va(t.type, e)) return;
    const i = this._getLegendItemAt(t.x, t.y);
    if (t.type === "mousemove" || t.type === "mouseout") {
      const s = this._hoveredItem,
        o = Ba(s, i);
      s && !o && E(e.onLeave, [t, s, this], this),
        (this._hoveredItem = i),
        i && !o && E(e.onHover, [t, i, this], this);
    } else i && E(e.onClick, [t, i, this], this);
  }
}
function Va(n, t) {
  return !!(
    ((n === "mousemove" || n === "mouseout") && (t.onHover || t.onLeave)) ||
    (t.onClick && (n === "click" || n === "mouseup"))
  );
}
var gr = {
  id: "legend",
  _element: Ii,
  start(n, t, e) {
    const i = (n.legend = new Ii({ ctx: n.ctx, options: e, chart: n }));
    rt.configure(n, i, e), rt.addBox(n, i);
  },
  stop(n) {
    rt.removeBox(n, n.legend), delete n.legend;
  },
  beforeUpdate(n, t, e) {
    const i = n.legend;
    rt.configure(n, i, e), (i.options = e);
  },
  afterUpdate(n) {
    const t = n.legend;
    t.buildLabels(), t.adjustHitBoxes();
  },
  afterEvent(n, t) {
    t.replay || n.legend.handleEvent(t.event);
  },
  defaults: {
    display: !0,
    position: "top",
    align: "center",
    fullSize: !0,
    reverse: !1,
    weight: 1e3,
    onClick(n, t, e) {
      const i = t.datasetIndex,
        s = e.chart;
      s.isDatasetVisible(i) ? (s.hide(i), (t.hidden = !0)) : (s.show(i), (t.hidden = !1));
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: n => n.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(n) {
        const t = n.data.datasets,
          {
            labels: { usePointStyle: e, pointStyle: i, textAlign: s, color: o },
          } = n.legend.options;
        return n._getSortedDatasetMetas().map(a => {
          const r = a.controller.getStyle(e ? 0 : void 0),
            l = $(r.borderWidth);
          return {
            text: t[a.index].label,
            fillStyle: r.backgroundColor,
            fontColor: o,
            hidden: !a.visible,
            lineCap: r.borderCapStyle,
            lineDash: r.borderDash,
            lineDashOffset: r.borderDashOffset,
            lineJoin: r.borderJoinStyle,
            lineWidth: (l.width + l.height) / 4,
            strokeStyle: r.borderColor,
            pointStyle: i || r.pointStyle,
            rotation: r.rotation,
            textAlign: s || r.textAlign,
            borderRadius: 0,
            datasetIndex: a.index,
          };
        }, this);
      },
    },
    title: {
      color: n => n.chart.options.color,
      display: !1,
      position: "center",
      text: "",
    },
  },
  descriptors: {
    _scriptable: n => !n.startsWith("on"),
    labels: {
      _scriptable: n => !["generateLabels", "filter", "sort"].includes(n),
    },
  },
};
const Rt = {
  average(n) {
    if (!n.length) return !1;
    let t,
      e,
      i = 0,
      s = 0,
      o = 0;
    for (t = 0, e = n.length; t < e; ++t) {
      const a = n[t].element;
      if (a && a.hasValue()) {
        const r = a.tooltipPosition();
        (i += r.x), (s += r.y), ++o;
      }
    }
    return {
      x: i / o,
      y: s / o,
    };
  },
  nearest(n, t) {
    if (!n.length) return !1;
    let e = t.x,
      i = t.y,
      s = Number.POSITIVE_INFINITY,
      o,
      a,
      r;
    for (o = 0, a = n.length; o < a; ++o) {
      const l = n[o].element;
      if (l && l.hasValue()) {
        const h = l.getCenterPoint(),
          c = Is(t, h);
        c < s && ((s = c), (r = l));
      }
    }
    if (r) {
      const l = r.tooltipPosition();
      (e = l.x), (i = l.y);
    }
    return {
      x: e,
      y: i,
    };
  },
};
function Q(n, t) {
  return t && (j(t) ? Array.prototype.push.apply(n, t) : n.push(t)), n;
}
function nt(n) {
  return (typeof n == "string" || n instanceof String) &&
    n.indexOf(`
`) > -1
    ? n.split(`
`)
    : n;
}
function Na(n, t) {
  const { element: e, datasetIndex: i, index: s } = t,
    o = n.getDatasetMeta(i).controller,
    { label: a, value: r } = o.getLabelAndValue(s);
  return {
    chart: n,
    label: a,
    parsed: o.getParsed(s),
    raw: n.data.datasets[i].data[s],
    formattedValue: r,
    dataset: o.getDataset(),
    dataIndex: s,
    datasetIndex: i,
    element: e,
  };
}
function Bi(n, t) {
  const e = n.chart.ctx,
    { body: i, footer: s, title: o } = n,
    { boxWidth: a, boxHeight: r } = t,
    l = W(t.bodyFont),
    h = W(t.titleFont),
    c = W(t.footerFont),
    d = o.length,
    u = s.length,
    f = i.length,
    g = $(t.padding);
  let p = g.height,
    m = 0,
    b = i.reduce((y, _) => y + _.before.length + _.lines.length + _.after.length, 0);
  if (
    ((b += n.beforeBody.length + n.afterBody.length),
    d && (p += d * h.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom),
    b)
  ) {
    const y = t.displayColors ? Math.max(r, l.lineHeight) : l.lineHeight;
    p += f * y + (b - f) * l.lineHeight + (b - 1) * t.bodySpacing;
  }
  u && (p += t.footerMarginTop + u * c.lineHeight + (u - 1) * t.footerSpacing);
  let x = 0;
  const v = function (y) {
    m = Math.max(m, e.measureText(y).width + x);
  };
  return (
    e.save(),
    (e.font = h.string),
    T(n.title, v),
    (e.font = l.string),
    T(n.beforeBody.concat(n.afterBody), v),
    (x = t.displayColors ? a + 2 + t.boxPadding : 0),
    T(i, y => {
      T(y.before, v), T(y.lines, v), T(y.after, v);
    }),
    (x = 0),
    (e.font = c.string),
    T(n.footer, v),
    e.restore(),
    (m += g.width),
    { width: m, height: p }
  );
}
function Wa(n, t) {
  const { y: e, height: i } = t;
  return e < i / 2 ? "top" : e > n.height - i / 2 ? "bottom" : "center";
}
function Ha(n, t, e, i) {
  const { x: s, width: o } = i,
    a = e.caretSize + e.caretPadding;
  if ((n === "left" && s + o + a > t.width) || (n === "right" && s - o - a < 0)) return !0;
}
function ja(n, t, e, i) {
  const { x: s, width: o } = e,
    {
      width: a,
      chartArea: { left: r, right: l },
    } = n;
  let h = "center";
  return (
    i === "center"
      ? (h = s <= (r + l) / 2 ? "left" : "right")
      : s <= o / 2
      ? (h = "left")
      : s >= a - o / 2 && (h = "right"),
    Ha(h, n, t, e) && (h = "center"),
    h
  );
}
function Vi(n, t, e) {
  const i = e.yAlign || t.yAlign || Wa(n, e);
  return {
    xAlign: e.xAlign || t.xAlign || ja(n, t, e, i),
    yAlign: i,
  };
}
function $a(n, t) {
  let { x: e, width: i } = n;
  return t === "right" ? (e -= i) : t === "center" && (e -= i / 2), e;
}
function Ya(n, t, e) {
  let { y: i, height: s } = n;
  return t === "top" ? (i += e) : t === "bottom" ? (i -= s + e) : (i -= s / 2), i;
}
function Ni(n, t, e, i) {
  const { caretSize: s, caretPadding: o, cornerRadius: a } = n,
    { xAlign: r, yAlign: l } = e,
    h = s + o,
    { topLeft: c, topRight: d, bottomLeft: u, bottomRight: f } = gt(a);
  let g = $a(t, r);
  const p = Ya(t, l, h);
  return (
    l === "center"
      ? r === "left"
        ? (g += h)
        : r === "right" && (g -= h)
      : r === "left"
      ? (g -= Math.max(c, u) + s)
      : r === "right" && (g += Math.max(d, f) + s),
    {
      x: X(g, 0, i.width - t.width),
      y: X(p, 0, i.height - t.height),
    }
  );
}
function Kt(n, t, e) {
  const i = $(e.padding);
  return t === "center"
    ? n.x + n.width / 2
    : t === "right"
    ? n.x + n.width - i.right
    : n.x + i.left;
}
function Wi(n) {
  return Q([], nt(n));
}
function Ua(n, t, e) {
  return mt(n, {
    tooltip: t,
    tooltipItems: e,
    type: "tooltip",
  });
}
function Hi(n, t) {
  const e = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return e ? n.override(e) : n;
}
class Te extends et {
  constructor(t) {
    super(),
      (this.opacity = 0),
      (this._active = []),
      (this._eventPosition = void 0),
      (this._size = void 0),
      (this._cachedAnimations = void 0),
      (this._tooltipItems = []),
      (this.$animations = void 0),
      (this.$context = void 0),
      (this.chart = t.chart || t._chart),
      (this._chart = this.chart),
      (this.options = t.options),
      (this.dataPoints = void 0),
      (this.title = void 0),
      (this.beforeBody = void 0),
      (this.body = void 0),
      (this.afterBody = void 0),
      (this.footer = void 0),
      (this.xAlign = void 0),
      (this.yAlign = void 0),
      (this.x = void 0),
      (this.y = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this.caretX = void 0),
      (this.caretY = void 0),
      (this.labelColors = void 0),
      (this.labelPointStyles = void 0),
      (this.labelTextColors = void 0);
  }
  initialize(t) {
    (this.options = t), (this._cachedAnimations = void 0), (this.$context = void 0);
  }
  _resolveAnimations() {
    const t = this._cachedAnimations;
    if (t) return t;
    const e = this.chart,
      i = this.options.setContext(this.getContext()),
      s = i.enabled && e.options.animation && i.animations,
      o = new hs(this.chart, s);
    return s._cacheable && (this._cachedAnimations = Object.freeze(o)), o;
  }
  getContext() {
    return this.$context || (this.$context = Ua(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(t, e) {
    const { callbacks: i } = e,
      s = i.beforeTitle.apply(this, [t]),
      o = i.title.apply(this, [t]),
      a = i.afterTitle.apply(this, [t]);
    let r = [];
    return (r = Q(r, nt(s))), (r = Q(r, nt(o))), (r = Q(r, nt(a))), r;
  }
  getBeforeBody(t, e) {
    return Wi(e.callbacks.beforeBody.apply(this, [t]));
  }
  getBody(t, e) {
    const { callbacks: i } = e,
      s = [];
    return (
      T(t, o => {
        const a = {
            before: [],
            lines: [],
            after: [],
          },
          r = Hi(i, o);
        Q(a.before, nt(r.beforeLabel.call(this, o))),
          Q(a.lines, r.label.call(this, o)),
          Q(a.after, nt(r.afterLabel.call(this, o))),
          s.push(a);
      }),
      s
    );
  }
  getAfterBody(t, e) {
    return Wi(e.callbacks.afterBody.apply(this, [t]));
  }
  getFooter(t, e) {
    const { callbacks: i } = e,
      s = i.beforeFooter.apply(this, [t]),
      o = i.footer.apply(this, [t]),
      a = i.afterFooter.apply(this, [t]);
    let r = [];
    return (r = Q(r, nt(s))), (r = Q(r, nt(o))), (r = Q(r, nt(a))), r;
  }
  _createItems(t) {
    const e = this._active,
      i = this.chart.data,
      s = [],
      o = [],
      a = [];
    let r = [],
      l,
      h;
    for (l = 0, h = e.length; l < h; ++l) r.push(Na(this.chart, e[l]));
    return (
      t.filter && (r = r.filter((c, d, u) => t.filter(c, d, u, i))),
      t.itemSort && (r = r.sort((c, d) => t.itemSort(c, d, i))),
      T(r, c => {
        const d = Hi(t.callbacks, c);
        s.push(d.labelColor.call(this, c)),
          o.push(d.labelPointStyle.call(this, c)),
          a.push(d.labelTextColor.call(this, c));
      }),
      (this.labelColors = s),
      (this.labelPointStyles = o),
      (this.labelTextColors = a),
      (this.dataPoints = r),
      r
    );
  }
  update(t, e) {
    const i = this.options.setContext(this.getContext()),
      s = this._active;
    let o,
      a = [];
    if (!s.length)
      this.opacity !== 0 &&
        (o = {
          opacity: 0,
        });
    else {
      const r = Rt[i.position].call(this, s, this._eventPosition);
      (a = this._createItems(i)),
        (this.title = this.getTitle(a, i)),
        (this.beforeBody = this.getBeforeBody(a, i)),
        (this.body = this.getBody(a, i)),
        (this.afterBody = this.getAfterBody(a, i)),
        (this.footer = this.getFooter(a, i));
      const l = (this._size = Bi(this, i)),
        h = Object.assign({}, r, l),
        c = Vi(this.chart, i, h),
        d = Ni(i, h, c, this.chart);
      (this.xAlign = c.xAlign),
        (this.yAlign = c.yAlign),
        (o = {
          opacity: 1,
          x: d.x,
          y: d.y,
          width: l.width,
          height: l.height,
          caretX: r.x,
          caretY: r.y,
        });
    }
    (this._tooltipItems = a),
      (this.$context = void 0),
      o && this._resolveAnimations().update(this, o),
      t && i.external && i.external.call(this, { chart: this.chart, tooltip: this, replay: e });
  }
  drawCaret(t, e, i, s) {
    const o = this.getCaretPosition(t, i, s);
    e.lineTo(o.x1, o.y1), e.lineTo(o.x2, o.y2), e.lineTo(o.x3, o.y3);
  }
  getCaretPosition(t, e, i) {
    const { xAlign: s, yAlign: o } = this,
      { caretSize: a, cornerRadius: r } = i,
      { topLeft: l, topRight: h, bottomLeft: c, bottomRight: d } = gt(r),
      { x: u, y: f } = t,
      { width: g, height: p } = e;
    let m, b, x, v, y, _;
    return (
      o === "center"
        ? ((y = f + p / 2),
          s === "left"
            ? ((m = u), (b = m - a), (v = y + a), (_ = y - a))
            : ((m = u + g), (b = m + a), (v = y - a), (_ = y + a)),
          (x = m))
        : (s === "left"
            ? (b = u + Math.max(l, c) + a)
            : s === "right"
            ? (b = u + g - Math.max(h, d) - a)
            : (b = this.caretX),
          o === "top"
            ? ((v = f), (y = v - a), (m = b - a), (x = b + a))
            : ((v = f + p), (y = v + a), (m = b + a), (x = b - a)),
          (_ = v)),
      { x1: m, x2: b, x3: x, y1: v, y2: y, y3: _ }
    );
  }
  drawTitle(t, e, i) {
    const s = this.title,
      o = s.length;
    let a, r, l;
    if (o) {
      const h = kt(i.rtl, this.x, this.width);
      for (
        t.x = Kt(this, i.titleAlign, i),
          e.textAlign = h.textAlign(i.titleAlign),
          e.textBaseline = "middle",
          a = W(i.titleFont),
          r = i.titleSpacing,
          e.fillStyle = i.titleColor,
          e.font = a.string,
          l = 0;
        l < o;
        ++l
      )
        e.fillText(s[l], h.x(t.x), t.y + a.lineHeight / 2),
          (t.y += a.lineHeight + r),
          l + 1 === o && (t.y += i.titleMarginBottom - r);
    }
  }
  _drawColorBox(t, e, i, s, o) {
    const a = this.labelColors[i],
      r = this.labelPointStyles[i],
      { boxHeight: l, boxWidth: h, boxPadding: c } = o,
      d = W(o.bodyFont),
      u = Kt(this, "left", o),
      f = s.x(u),
      g = l < d.lineHeight ? (d.lineHeight - l) / 2 : 0,
      p = e.y + g;
    if (o.usePointStyle) {
      const m = {
          radius: Math.min(h, l) / 2,
          pointStyle: r.pointStyle,
          rotation: r.rotation,
          borderWidth: 1,
        },
        b = s.leftForLtr(f, h) + h / 2,
        x = p + l / 2;
      (t.strokeStyle = o.multiKeyBackground),
        (t.fillStyle = o.multiKeyBackground),
        Se(t, m, b, x),
        (t.strokeStyle = a.borderColor),
        (t.fillStyle = a.backgroundColor),
        Se(t, m, b, x);
    } else {
      (t.lineWidth = F(a.borderWidth)
        ? Math.max(...Object.values(a.borderWidth))
        : a.borderWidth || 1),
        (t.strokeStyle = a.borderColor),
        t.setLineDash(a.borderDash || []),
        (t.lineDashOffset = a.borderDashOffset || 0);
      const m = s.leftForLtr(f, h - c),
        b = s.leftForLtr(s.xPlus(f, 1), h - c - 2),
        x = gt(a.borderRadius);
      Object.values(x).some(v => v !== 0)
        ? (t.beginPath(),
          (t.fillStyle = o.multiKeyBackground),
          Ft(t, {
            x: m,
            y: p,
            w: h,
            h: l,
            radius: x,
          }),
          t.fill(),
          t.stroke(),
          (t.fillStyle = a.backgroundColor),
          t.beginPath(),
          Ft(t, {
            x: b,
            y: p + 1,
            w: h - 2,
            h: l - 2,
            radius: x,
          }),
          t.fill())
        : ((t.fillStyle = o.multiKeyBackground),
          t.fillRect(m, p, h, l),
          t.strokeRect(m, p, h, l),
          (t.fillStyle = a.backgroundColor),
          t.fillRect(b, p + 1, h - 2, l - 2));
    }
    t.fillStyle = this.labelTextColors[i];
  }
  drawBody(t, e, i) {
    const { body: s } = this,
      {
        bodySpacing: o,
        bodyAlign: a,
        displayColors: r,
        boxHeight: l,
        boxWidth: h,
        boxPadding: c,
      } = i,
      d = W(i.bodyFont);
    let u = d.lineHeight,
      f = 0;
    const g = kt(i.rtl, this.x, this.width),
      p = function (P) {
        e.fillText(P, g.x(t.x + f), t.y + u / 2), (t.y += u + o);
      },
      m = g.textAlign(a);
    let b, x, v, y, _, M, k;
    for (
      e.textAlign = a,
        e.textBaseline = "middle",
        e.font = d.string,
        t.x = Kt(this, m, i),
        e.fillStyle = i.bodyColor,
        T(this.beforeBody, p),
        f = r && m !== "right" ? (a === "center" ? h / 2 + c : h + 2 + c) : 0,
        y = 0,
        M = s.length;
      y < M;
      ++y
    ) {
      for (
        b = s[y],
          x = this.labelTextColors[y],
          e.fillStyle = x,
          T(b.before, p),
          v = b.lines,
          r && v.length && (this._drawColorBox(e, t, y, g, i), (u = Math.max(d.lineHeight, l))),
          _ = 0,
          k = v.length;
        _ < k;
        ++_
      )
        p(v[_]), (u = d.lineHeight);
      T(b.after, p);
    }
    (f = 0), (u = d.lineHeight), T(this.afterBody, p), (t.y -= o);
  }
  drawFooter(t, e, i) {
    const s = this.footer,
      o = s.length;
    let a, r;
    if (o) {
      const l = kt(i.rtl, this.x, this.width);
      for (
        t.x = Kt(this, i.footerAlign, i),
          t.y += i.footerMarginTop,
          e.textAlign = l.textAlign(i.footerAlign),
          e.textBaseline = "middle",
          a = W(i.footerFont),
          e.fillStyle = i.footerColor,
          e.font = a.string,
          r = 0;
        r < o;
        ++r
      )
        e.fillText(s[r], l.x(t.x), t.y + a.lineHeight / 2), (t.y += a.lineHeight + i.footerSpacing);
    }
  }
  drawBackground(t, e, i, s) {
    const { xAlign: o, yAlign: a } = this,
      { x: r, y: l } = t,
      { width: h, height: c } = i,
      { topLeft: d, topRight: u, bottomLeft: f, bottomRight: g } = gt(s.cornerRadius);
    (e.fillStyle = s.backgroundColor),
      (e.strokeStyle = s.borderColor),
      (e.lineWidth = s.borderWidth),
      e.beginPath(),
      e.moveTo(r + d, l),
      a === "top" && this.drawCaret(t, e, i, s),
      e.lineTo(r + h - u, l),
      e.quadraticCurveTo(r + h, l, r + h, l + u),
      a === "center" && o === "right" && this.drawCaret(t, e, i, s),
      e.lineTo(r + h, l + c - g),
      e.quadraticCurveTo(r + h, l + c, r + h - g, l + c),
      a === "bottom" && this.drawCaret(t, e, i, s),
      e.lineTo(r + f, l + c),
      e.quadraticCurveTo(r, l + c, r, l + c - f),
      a === "center" && o === "left" && this.drawCaret(t, e, i, s),
      e.lineTo(r, l + d),
      e.quadraticCurveTo(r, l, r + d, l),
      e.closePath(),
      e.fill(),
      s.borderWidth > 0 && e.stroke();
  }
  _updateAnimationTarget(t) {
    const e = this.chart,
      i = this.$animations,
      s = i && i.x,
      o = i && i.y;
    if (s || o) {
      const a = Rt[t.position].call(this, this._active, this._eventPosition);
      if (!a) return;
      const r = (this._size = Bi(this, t)),
        l = Object.assign({}, a, this._size),
        h = Vi(e, t, l),
        c = Ni(t, l, h, e);
      (s._to !== c.x || o._to !== c.y) &&
        ((this.xAlign = h.xAlign),
        (this.yAlign = h.yAlign),
        (this.width = r.width),
        (this.height = r.height),
        (this.caretX = a.x),
        (this.caretY = a.y),
        this._resolveAnimations().update(this, c));
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(t) {
    const e = this.options.setContext(this.getContext());
    let i = this.opacity;
    if (!i) return;
    this._updateAnimationTarget(e);
    const s = {
        width: this.width,
        height: this.height,
      },
      o = {
        x: this.x,
        y: this.y,
      };
    i = Math.abs(i) < 1e-3 ? 0 : i;
    const a = $(e.padding),
      r =
        this.title.length ||
        this.beforeBody.length ||
        this.body.length ||
        this.afterBody.length ||
        this.footer.length;
    e.enabled &&
      r &&
      (t.save(),
      (t.globalAlpha = i),
      this.drawBackground(o, t, s, e),
      ts(t, e.textDirection),
      (o.y += a.top),
      this.drawTitle(o, t, e),
      this.drawBody(o, t, e),
      this.drawFooter(o, t, e),
      es(t, e.textDirection),
      t.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(t, e) {
    const i = this._active,
      s = t.map(({ datasetIndex: r, index: l }) => {
        const h = this.chart.getDatasetMeta(r);
        if (!h) throw new Error("Cannot find a dataset at index " + r);
        return {
          datasetIndex: r,
          element: h.data[l],
          index: l,
        };
      }),
      o = !Qt(i, s),
      a = this._positionChanged(s, e);
    (o || a) &&
      ((this._active = s),
      (this._eventPosition = e),
      (this._ignoreReplayEvents = !0),
      this.update(!0));
  }
  handleEvent(t, e, i = !0) {
    if (e && this._ignoreReplayEvents) return !1;
    this._ignoreReplayEvents = !1;
    const s = this.options,
      o = this._active || [],
      a = this._getActiveElements(t, o, e, i),
      r = this._positionChanged(a, t),
      l = e || !Qt(a, o) || r;
    return (
      l &&
        ((this._active = a),
        (s.enabled || s.external) &&
          ((this._eventPosition = {
            x: t.x,
            y: t.y,
          }),
          this.update(!0, e))),
      l
    );
  }
  _getActiveElements(t, e, i, s) {
    const o = this.options;
    if (t.type === "mouseout") return [];
    if (!s) return e;
    const a = this.chart.getElementsAtEventForMode(t, o.mode, o, i);
    return o.reverse && a.reverse(), a;
  }
  _positionChanged(t, e) {
    const { caretX: i, caretY: s, options: o } = this,
      a = Rt[o.position].call(this, t, e);
    return a !== !1 && (i !== a.x || s !== a.y);
  }
}
Te.positioners = Rt;
var pr = {
  id: "tooltip",
  _element: Te,
  positioners: Rt,
  afterInit(n, t, e) {
    e && (n.tooltip = new Te({ chart: n, options: e }));
  },
  beforeUpdate(n, t, e) {
    n.tooltip && n.tooltip.initialize(e);
  },
  reset(n, t, e) {
    n.tooltip && n.tooltip.initialize(e);
  },
  afterDraw(n) {
    const t = n.tooltip;
    if (t && t._willRender()) {
      const e = {
        tooltip: t,
      };
      if (n.notifyPlugins("beforeTooltipDraw", e) === !1) return;
      t.draw(n.ctx), n.notifyPlugins("afterTooltipDraw", e);
    }
  },
  afterEvent(n, t) {
    if (n.tooltip) {
      const e = t.replay;
      n.tooltip.handleEvent(t.event, e, t.inChartArea) && (t.changed = !0);
    }
  },
  defaults: {
    enabled: !0,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: {
      weight: "bold",
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: "bold",
    },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (n, t) => t.bodyFont.size,
    boxWidth: (n, t) => t.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: !0,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: "easeOutQuart",
    },
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "width", "height", "caretX", "caretY"],
      },
      opacity: {
        easing: "linear",
        duration: 200,
      },
    },
    callbacks: {
      beforeTitle: it,
      title(n) {
        if (n.length > 0) {
          const t = n[0],
            e = t.chart.data.labels,
            i = e ? e.length : 0;
          if (this && this.options && this.options.mode === "dataset") return t.dataset.label || "";
          if (t.label) return t.label;
          if (i > 0 && t.dataIndex < i) return e[t.dataIndex];
        }
        return "";
      },
      afterTitle: it,
      beforeBody: it,
      beforeLabel: it,
      label(n) {
        if (this && this.options && this.options.mode === "dataset")
          return n.label + ": " + n.formattedValue || n.formattedValue;
        let t = n.dataset.label || "";
        t && (t += ": ");
        const e = n.formattedValue;
        return R(e) || (t += e), t;
      },
      labelColor(n) {
        const e = n.chart.getDatasetMeta(n.datasetIndex).controller.getStyle(n.dataIndex);
        return {
          borderColor: e.borderColor,
          backgroundColor: e.backgroundColor,
          borderWidth: e.borderWidth,
          borderDash: e.borderDash,
          borderDashOffset: e.borderDashOffset,
          borderRadius: 0,
        };
      },
      labelTextColor() {
        return this.options.bodyColor;
      },
      labelPointStyle(n) {
        const e = n.chart.getDatasetMeta(n.datasetIndex).controller.getStyle(n.dataIndex);
        return {
          pointStyle: e.pointStyle,
          rotation: e.rotation,
        };
      },
      afterLabel: it,
      afterBody: it,
      beforeFooter: it,
      footer: it,
      afterFooter: it,
    },
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font",
  },
  descriptors: {
    _scriptable: n => n !== "filter" && n !== "itemSort" && n !== "external",
    _indexable: !1,
    callbacks: {
      _scriptable: !1,
      _indexable: !1,
    },
    animation: {
      _fallback: !1,
    },
    animations: {
      _fallback: "animation",
    },
  },
  additionalOptionScopes: ["interaction"],
};
const Xa = (n, t, e, i) => (
  typeof t == "string"
    ? ((e = n.push(t) - 1), i.unshift({ index: e, label: t }))
    : isNaN(t) && (e = null),
  e
);
function Ka(n, t, e, i) {
  const s = n.indexOf(t);
  if (s === -1) return Xa(n, t, e, i);
  const o = n.lastIndexOf(t);
  return s !== o ? e : s;
}
const Ga = (n, t) => (n === null ? null : X(Math.round(n), 0, t));
class Ee extends bt {
  constructor(t) {
    super(t), (this._startValue = void 0), (this._valueRange = 0), (this._addedLabels = []);
  }
  init(t) {
    const e = this._addedLabels;
    if (e.length) {
      const i = this.getLabels();
      for (const { index: s, label: o } of e) i[s] === o && i.splice(s, 1);
      this._addedLabels = [];
    }
    super.init(t);
  }
  parse(t, e) {
    if (R(t)) return null;
    const i = this.getLabels();
    return (
      (e = isFinite(e) && i[e] === t ? e : Ka(i, t, C(e, t), this._addedLabels)),
      Ga(e, i.length - 1)
    );
  }
  determineDataLimits() {
    const { minDefined: t, maxDefined: e } = this.getUserBounds();
    let { min: i, max: s } = this.getMinMax(!0);
    this.options.bounds === "ticks" && (t || (i = 0), e || (s = this.getLabels().length - 1)),
      (this.min = i),
      (this.max = s);
  }
  buildTicks() {
    const t = this.min,
      e = this.max,
      i = this.options.offset,
      s = [];
    let o = this.getLabels();
    (o = t === 0 && e === o.length - 1 ? o : o.slice(t, e + 1)),
      (this._valueRange = Math.max(o.length - (i ? 0 : 1), 1)),
      (this._startValue = this.min - (i ? 0.5 : 0));
    for (let a = t; a <= e; a++) s.push({ value: a });
    return s;
  }
  getLabelForValue(t) {
    const e = this.getLabels();
    return t >= 0 && t < e.length ? e[t] : t;
  }
  configure() {
    super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
  }
  getPixelForValue(t) {
    return (
      typeof t != "number" && (t = this.parse(t)),
      t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange)
    );
  }
  getPixelForTick(t) {
    const e = this.ticks;
    return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value);
  }
  getValueForPixel(t) {
    return Math.round(this._startValue + this.getDecimalForPixel(t) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
}
Ee.id = "category";
Ee.defaults = {
  ticks: {
    callback: Ee.prototype.getLabelForValue,
  },
};
function qa(n, t) {
  const e = [],
    {
      bounds: s,
      step: o,
      min: a,
      max: r,
      precision: l,
      count: h,
      maxTicks: c,
      maxDigits: d,
      includeBounds: u,
    } = n,
    f = o || 1,
    g = c - 1,
    { min: p, max: m } = t,
    b = !R(a),
    x = !R(r),
    v = !R(h),
    y = (m - p) / (d + 1);
  let _ = ei((m - p) / g / f) * f,
    M,
    k,
    P,
    S;
  if (_ < 1e-14 && !b && !x) return [{ value: p }, { value: m }];
  (S = Math.ceil(m / _) - Math.floor(p / _)),
    S > g && (_ = ei((S * _) / g / f) * f),
    R(l) || ((M = Math.pow(10, l)), (_ = Math.ceil(_ * M) / M)),
    s === "ticks" ? ((k = Math.floor(p / _) * _), (P = Math.ceil(m / _) * _)) : ((k = p), (P = m)),
    b && x && o && sn((r - a) / o, _ / 1e3)
      ? ((S = Math.round(Math.min((r - a) / _, c))), (_ = (r - a) / S), (k = a), (P = r))
      : v
      ? ((k = b ? a : k), (P = x ? r : P), (S = h - 1), (_ = (P - k) / S))
      : ((S = (P - k) / _),
        ge(S, Math.round(S), _ / 1e3) ? (S = Math.round(S)) : (S = Math.ceil(S)));
  const L = Math.max(si(_), si(k));
  (M = Math.pow(10, R(l) ? L : l)), (k = Math.round(k * M) / M), (P = Math.round(P * M) / M);
  let O = 0;
  for (
    b &&
    (u && k !== a
      ? (e.push({ value: a }),
        k < a && O++,
        ge(Math.round((k + O * _) * M) / M, a, ji(a, y, n)) && O++)
      : k < a && O++);
    O < S;
    ++O
  )
    e.push({ value: Math.round((k + O * _) * M) / M });
  return (
    x && u && P !== r
      ? e.length && ge(e[e.length - 1].value, r, ji(r, y, n))
        ? (e[e.length - 1].value = r)
        : e.push({ value: r })
      : (!x || P === r) && e.push({ value: P }),
    e
  );
}
function ji(n, t, { horizontal: e, minRotation: i }) {
  const s = J(i),
    o = (e ? Math.sin(s) : Math.cos(s)) || 1e-3,
    a = 0.75 * t * ("" + n).length;
  return Math.min(t / o, a);
}
class ie extends bt {
  constructor(t) {
    super(t),
      (this.start = void 0),
      (this.end = void 0),
      (this._startValue = void 0),
      (this._endValue = void 0),
      (this._valueRange = 0);
  }
  parse(t, e) {
    return R(t) || ((typeof t == "number" || t instanceof Number) && !isFinite(+t)) ? null : +t;
  }
  handleTickRangeOptions() {
    const { beginAtZero: t } = this.options,
      { minDefined: e, maxDefined: i } = this.getUserBounds();
    let { min: s, max: o } = this;
    const a = l => (s = e ? s : l),
      r = l => (o = i ? o : l);
    if (t) {
      const l = ht(s),
        h = ht(o);
      l < 0 && h < 0 ? r(0) : l > 0 && h > 0 && a(0);
    }
    if (s === o) {
      let l = 1;
      (o >= Number.MAX_SAFE_INTEGER || s <= Number.MIN_SAFE_INTEGER) && (l = Math.abs(o * 0.05)),
        r(o + l),
        t || a(s - l);
    }
    (this.min = s), (this.max = o);
  }
  getTickLimit() {
    const t = this.options.ticks;
    let { maxTicksLimit: e, stepSize: i } = t,
      s;
    return (
      i
        ? ((s = Math.ceil(this.max / i) - Math.floor(this.min / i) + 1),
          s > 1e3 &&
            (console.warn(
              `scales.${this.id}.ticks.stepSize: ${i} would result generating up to ${s} ticks. Limiting to 1000.`
            ),
            (s = 1e3)))
        : ((s = this.computeTickLimit()), (e = e || 11)),
      e && (s = Math.min(e, s)),
      s
    );
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const t = this.options,
      e = t.ticks;
    let i = this.getTickLimit();
    i = Math.max(2, i);
    const s = {
        maxTicks: i,
        bounds: t.bounds,
        min: t.min,
        max: t.max,
        precision: e.precision,
        step: e.stepSize,
        count: e.count,
        maxDigits: this._maxDigits(),
        horizontal: this.isHorizontal(),
        minRotation: e.minRotation || 0,
        includeBounds: e.includeBounds !== !1,
      },
      o = this._range || this,
      a = qa(s, o);
    return (
      t.bounds === "ticks" && is(a, this, "value"),
      t.reverse
        ? (a.reverse(), (this.start = this.max), (this.end = this.min))
        : ((this.start = this.min), (this.end = this.max)),
      a
    );
  }
  configure() {
    const t = this.ticks;
    let e = this.min,
      i = this.max;
    if ((super.configure(), this.options.offset && t.length)) {
      const s = (i - e) / Math.max(t.length - 1, 1) / 2;
      (e -= s), (i += s);
    }
    (this._startValue = e), (this._endValue = i), (this._valueRange = i - e);
  }
  getLabelForValue(t) {
    return Vt(t, this.chart.options.locale, this.options.ticks.format);
  }
}
class Os extends ie {
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    (this.min = V(t) ? t : 0), (this.max = V(e) ? e : 1), this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const t = this.isHorizontal(),
      e = t ? this.width : this.height,
      i = J(this.options.ticks.minRotation),
      s = (t ? Math.sin(i) : Math.cos(i)) || 1e-3,
      o = this._resolveTickFontOptions(0);
    return Math.ceil(e / Math.min(40, o.lineHeight / s));
  }
  getPixelForValue(t) {
    return t === null ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange);
  }
  getValueForPixel(t) {
    return this._startValue + this.getDecimalForPixel(t) * this._valueRange;
  }
}
Os.id = "linear";
Os.defaults = {
  ticks: {
    callback: ae.formatters.numeric,
  },
};
function $i(n) {
  return n / Math.pow(10, Math.floor(q(n))) === 1;
}
function Ja(n, t) {
  const e = Math.floor(q(t.max)),
    i = Math.ceil(t.max / Math.pow(10, e)),
    s = [];
  let o = K(n.min, Math.pow(10, Math.floor(q(t.min)))),
    a = Math.floor(q(o)),
    r = Math.floor(o / Math.pow(10, a)),
    l = a < 0 ? Math.pow(10, Math.abs(a)) : 1;
  do
    s.push({ value: o, major: $i(o) }),
      ++r,
      r === 10 && ((r = 1), ++a, (l = a >= 0 ? 1 : l)),
      (o = Math.round(r * Math.pow(10, a) * l) / l);
  while (a < e || (a === e && r < i));
  const h = K(n.max, o);
  return s.push({ value: h, major: $i(o) }), s;
}
class Ts extends bt {
  constructor(t) {
    super(t),
      (this.start = void 0),
      (this.end = void 0),
      (this._startValue = void 0),
      (this._valueRange = 0);
  }
  parse(t, e) {
    const i = ie.prototype.parse.apply(this, [t, e]);
    if (i === 0) {
      this._zero = !0;
      return;
    }
    return V(i) && i > 0 ? i : null;
  }
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!0);
    (this.min = V(t) ? Math.max(0, t) : null),
      (this.max = V(e) ? Math.max(0, e) : null),
      this.options.beginAtZero && (this._zero = !0),
      this.handleTickRangeOptions();
  }
  handleTickRangeOptions() {
    const { minDefined: t, maxDefined: e } = this.getUserBounds();
    let i = this.min,
      s = this.max;
    const o = l => (i = t ? i : l),
      a = l => (s = e ? s : l),
      r = (l, h) => Math.pow(10, Math.floor(q(l)) + h);
    i === s && (i <= 0 ? (o(1), a(10)) : (o(r(i, -1)), a(r(s, 1)))),
      i <= 0 && o(r(s, -1)),
      s <= 0 && a(r(i, 1)),
      this._zero && this.min !== this._suggestedMin && i === r(this.min, 0) && o(r(i, -1)),
      (this.min = i),
      (this.max = s);
  }
  buildTicks() {
    const t = this.options,
      e = {
        min: this._userMin,
        max: this._userMax,
      },
      i = Ja(e, this);
    return (
      t.bounds === "ticks" && is(i, this, "value"),
      t.reverse
        ? (i.reverse(), (this.start = this.max), (this.end = this.min))
        : ((this.start = this.min), (this.end = this.max)),
      i
    );
  }
  getLabelForValue(t) {
    return t === void 0 ? "0" : Vt(t, this.chart.options.locale, this.options.ticks.format);
  }
  configure() {
    const t = this.min;
    super.configure(), (this._startValue = q(t)), (this._valueRange = q(this.max) - q(t));
  }
  getPixelForValue(t) {
    return (
      (t === void 0 || t === 0) && (t = this.min),
      t === null || isNaN(t)
        ? NaN
        : this.getPixelForDecimal(t === this.min ? 0 : (q(t) - this._startValue) / this._valueRange)
    );
  }
  getValueForPixel(t) {
    const e = this.getDecimalForPixel(t);
    return Math.pow(10, this._startValue + e * this._valueRange);
  }
}
Ts.id = "logarithmic";
Ts.defaults = {
  ticks: {
    callback: ae.formatters.logarithmic,
    major: {
      enabled: !0,
    },
  },
};
function Re(n) {
  const t = n.ticks;
  if (t.display && n.display) {
    const e = $(t.backdropPadding);
    return C(t.font && t.font.size, A.font.size) + e.height;
  }
  return 0;
}
function Za(n, t, e) {
  return (
    (e = j(e) ? e : [e]),
    {
      w: nn(n, t.string, e),
      h: e.length * t.lineHeight,
    }
  );
}
function Yi(n, t, e, i, s) {
  return n === i || n === s
    ? {
        start: t - e / 2,
        end: t + e / 2,
      }
    : n < i || n > s
    ? {
        start: t - e,
        end: t,
      }
    : {
        start: t,
        end: t + e,
      };
}
function Qa(n) {
  const t = {
      l: n.left + n._padding.left,
      r: n.right - n._padding.right,
      t: n.top + n._padding.top,
      b: n.bottom - n._padding.bottom,
    },
    e = Object.assign({}, t),
    i = [],
    s = [],
    o = n._pointLabels.length,
    a = n.options.pointLabels,
    r = a.centerPointLabels ? pt / o : 0;
  for (let l = 0; l < o; l++) {
    const h = a.setContext(n.getPointLabelContext(l));
    s[l] = h.padding;
    const c = n.getPointPosition(l, n.drawingArea + s[l], r),
      d = W(h.font),
      u = Za(n.ctx, d, n._pointLabels[l]);
    i[l] = u;
    const f = zt(n.getIndexAngle(l) + r),
      g = Math.round(ze(f)),
      p = Yi(g, c.x, u.w, 0, 180),
      m = Yi(g, c.y, u.h, 90, 270);
    tr(e, t, f, p, m);
  }
  n.setCenterPoint(t.l - e.l, e.r - t.r, t.t - e.t, e.b - t.b), (n._pointLabelItems = er(n, i, s));
}
function tr(n, t, e, i, s) {
  const o = Math.abs(Math.sin(e)),
    a = Math.abs(Math.cos(e));
  let r = 0,
    l = 0;
  i.start < t.l
    ? ((r = (t.l - i.start) / o), (n.l = Math.min(n.l, t.l - r)))
    : i.end > t.r && ((r = (i.end - t.r) / o), (n.r = Math.max(n.r, t.r + r))),
    s.start < t.t
      ? ((l = (t.t - s.start) / a), (n.t = Math.min(n.t, t.t - l)))
      : s.end > t.b && ((l = (s.end - t.b) / a), (n.b = Math.max(n.b, t.b + l)));
}
function er(n, t, e) {
  const i = [],
    s = n._pointLabels.length,
    o = n.options,
    a = Re(o) / 2,
    r = n.drawingArea,
    l = o.pointLabels.centerPointLabels ? pt / s : 0;
  for (let h = 0; h < s; h++) {
    const c = n.getPointPosition(h, r + a + e[h], l),
      d = Math.round(ze(zt(c.angle + G))),
      u = t[h],
      f = nr(c.y, u.h, d),
      g = ir(d),
      p = sr(c.x, u.w, g);
    i.push({
      x: c.x,
      y: f,
      textAlign: g,
      left: p,
      top: f,
      right: p + u.w,
      bottom: f + u.h,
    });
  }
  return i;
}
function ir(n) {
  return n === 0 || n === 180 ? "center" : n < 180 ? "left" : "right";
}
function sr(n, t, e) {
  return e === "right" ? (n -= t) : e === "center" && (n -= t / 2), n;
}
function nr(n, t, e) {
  return e === 90 || e === 270 ? (n -= t / 2) : (e > 270 || e < 90) && (n -= t), n;
}
function or(n, t) {
  const {
    ctx: e,
    options: { pointLabels: i },
  } = n;
  for (let s = t - 1; s >= 0; s--) {
    const o = i.setContext(n.getPointLabelContext(s)),
      a = W(o.font),
      { x: r, y: l, textAlign: h, left: c, top: d, right: u, bottom: f } = n._pointLabelItems[s],
      { backdropColor: g } = o;
    if (!R(g)) {
      const p = gt(o.borderRadius),
        m = $(o.backdropPadding);
      e.fillStyle = g;
      const b = c - m.left,
        x = d - m.top,
        v = u - c + m.width,
        y = f - d + m.height;
      Object.values(p).some(_ => _ !== 0)
        ? (e.beginPath(),
          Ft(e, {
            x: b,
            y: x,
            w: v,
            h: y,
            radius: p,
          }),
          e.fill())
        : e.fillRect(b, x, v, y);
    }
    Mt(e, n._pointLabels[s], r, l + a.lineHeight / 2, a, {
      color: o.color,
      textAlign: h,
      textBaseline: "middle",
    });
  }
}
function Es(n, t, e, i) {
  const { ctx: s } = n;
  if (e) s.arc(n.xCenter, n.yCenter, t, 0, N);
  else {
    let o = n.getPointPosition(0, t);
    s.moveTo(o.x, o.y);
    for (let a = 1; a < i; a++) (o = n.getPointPosition(a, t)), s.lineTo(o.x, o.y);
  }
}
function ar(n, t, e, i) {
  const s = n.ctx,
    o = t.circular,
    { color: a, lineWidth: r } = t;
  (!o && !i) ||
    !a ||
    !r ||
    e < 0 ||
    (s.save(),
    (s.strokeStyle = a),
    (s.lineWidth = r),
    s.setLineDash(t.borderDash),
    (s.lineDashOffset = t.borderDashOffset),
    s.beginPath(),
    Es(n, e, o, i),
    s.closePath(),
    s.stroke(),
    s.restore());
}
function rr(n, t, e) {
  return mt(n, {
    label: e,
    index: t,
    type: "pointLabel",
  });
}
class re extends ie {
  constructor(t) {
    super(t),
      (this.xCenter = void 0),
      (this.yCenter = void 0),
      (this.drawingArea = void 0),
      (this._pointLabels = []),
      (this._pointLabelItems = []);
  }
  setDimensions() {
    const t = (this._padding = $(Re(this.options) / 2)),
      e = (this.width = this.maxWidth - t.width),
      i = (this.height = this.maxHeight - t.height);
    (this.xCenter = Math.floor(this.left + e / 2 + t.left)),
      (this.yCenter = Math.floor(this.top + i / 2 + t.top)),
      (this.drawingArea = Math.floor(Math.min(e, i) / 2));
  }
  determineDataLimits() {
    const { min: t, max: e } = this.getMinMax(!1);
    (this.min = V(t) && !isNaN(t) ? t : 0),
      (this.max = V(e) && !isNaN(e) ? e : 0),
      this.handleTickRangeOptions();
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / Re(this.options));
  }
  generateTickLabels(t) {
    ie.prototype.generateTickLabels.call(this, t),
      (this._pointLabels = this.getLabels()
        .map((e, i) => {
          const s = E(this.options.pointLabels.callback, [e, i], this);
          return s || s === 0 ? s : "";
        })
        .filter((e, i) => this.chart.getDataVisibility(i)));
  }
  fit() {
    const t = this.options;
    t.display && t.pointLabels.display ? Qa(this) : this.setCenterPoint(0, 0, 0, 0);
  }
  setCenterPoint(t, e, i, s) {
    (this.xCenter += Math.floor((t - e) / 2)),
      (this.yCenter += Math.floor((i - s) / 2)),
      (this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(t, e, i, s)));
  }
  getIndexAngle(t) {
    const e = N / (this._pointLabels.length || 1),
      i = this.options.startAngle || 0;
    return zt(t * e + J(i));
  }
  getDistanceFromCenterForValue(t) {
    if (R(t)) return NaN;
    const e = this.drawingArea / (this.max - this.min);
    return this.options.reverse ? (this.max - t) * e : (t - this.min) * e;
  }
  getValueForDistanceFromCenter(t) {
    if (R(t)) return NaN;
    const e = t / (this.drawingArea / (this.max - this.min));
    return this.options.reverse ? this.max - e : this.min + e;
  }
  getPointLabelContext(t) {
    const e = this._pointLabels || [];
    if (t >= 0 && t < e.length) {
      const i = e[t];
      return rr(this.getContext(), t, i);
    }
  }
  getPointPosition(t, e, i = 0) {
    const s = this.getIndexAngle(t) - G + i;
    return {
      x: Math.cos(s) * e + this.xCenter,
      y: Math.sin(s) * e + this.yCenter,
      angle: s,
    };
  }
  getPointPositionForValue(t, e) {
    return this.getPointPosition(t, this.getDistanceFromCenterForValue(e));
  }
  getBasePosition(t) {
    return this.getPointPositionForValue(t || 0, this.getBaseValue());
  }
  getPointLabelPosition(t) {
    const { left: e, top: i, right: s, bottom: o } = this._pointLabelItems[t];
    return {
      left: e,
      top: i,
      right: s,
      bottom: o,
    };
  }
  drawBackground() {
    const {
      backgroundColor: t,
      grid: { circular: e },
    } = this.options;
    if (t) {
      const i = this.ctx;
      i.save(),
        i.beginPath(),
        Es(this, this.getDistanceFromCenterForValue(this._endValue), e, this._pointLabels.length),
        i.closePath(),
        (i.fillStyle = t),
        i.fill(),
        i.restore();
    }
  }
  drawGrid() {
    const t = this.ctx,
      e = this.options,
      { angleLines: i, grid: s } = e,
      o = this._pointLabels.length;
    let a, r, l;
    if (
      (e.pointLabels.display && or(this, o),
      s.display &&
        this.ticks.forEach((h, c) => {
          if (c !== 0) {
            r = this.getDistanceFromCenterForValue(h.value);
            const d = s.setContext(this.getContext(c - 1));
            ar(this, d, r, o);
          }
        }),
      i.display)
    ) {
      for (t.save(), a = o - 1; a >= 0; a--) {
        const h = i.setContext(this.getPointLabelContext(a)),
          { color: c, lineWidth: d } = h;
        !d ||
          !c ||
          ((t.lineWidth = d),
          (t.strokeStyle = c),
          t.setLineDash(h.borderDash),
          (t.lineDashOffset = h.borderDashOffset),
          (r = this.getDistanceFromCenterForValue(e.ticks.reverse ? this.min : this.max)),
          (l = this.getPointPosition(a, r)),
          t.beginPath(),
          t.moveTo(this.xCenter, this.yCenter),
          t.lineTo(l.x, l.y),
          t.stroke());
      }
      t.restore();
    }
  }
  drawBorder() {}
  drawLabels() {
    const t = this.ctx,
      e = this.options,
      i = e.ticks;
    if (!i.display) return;
    const s = this.getIndexAngle(0);
    let o, a;
    t.save(),
      t.translate(this.xCenter, this.yCenter),
      t.rotate(s),
      (t.textAlign = "center"),
      (t.textBaseline = "middle"),
      this.ticks.forEach((r, l) => {
        if (l === 0 && !e.reverse) return;
        const h = i.setContext(this.getContext(l)),
          c = W(h.font);
        if (((o = this.getDistanceFromCenterForValue(this.ticks[l].value)), h.showLabelBackdrop)) {
          (t.font = c.string), (a = t.measureText(r.label).width), (t.fillStyle = h.backdropColor);
          const d = $(h.backdropPadding);
          t.fillRect(-a / 2 - d.left, -o - c.size / 2 - d.top, a + d.width, c.size + d.height);
        }
        Mt(t, r.label, 0, -o, c, {
          color: h.color,
        });
      }),
      t.restore();
  }
  drawTitle() {}
}
re.id = "radialLinear";
re.defaults = {
  display: !0,
  animate: !0,
  position: "chartArea",
  angleLines: {
    display: !0,
    lineWidth: 1,
    borderDash: [],
    borderDashOffset: 0,
  },
  grid: {
    circular: !1,
  },
  startAngle: 0,
  ticks: {
    showLabelBackdrop: !0,
    callback: ae.formatters.numeric,
  },
  pointLabels: {
    backdropColor: void 0,
    backdropPadding: 2,
    display: !0,
    font: {
      size: 10,
    },
    callback(n) {
      return n;
    },
    padding: 5,
    centerPointLabels: !1,
  },
};
re.defaultRoutes = {
  "angleLines.color": "borderColor",
  "pointLabels.color": "color",
  "ticks.color": "color",
};
re.descriptors = {
  angleLines: {
    _fallback: "grid",
  },
};
const le = {
    millisecond: { common: !0, size: 1, steps: 1e3 },
    second: { common: !0, size: 1e3, steps: 60 },
    minute: { common: !0, size: 6e4, steps: 60 },
    hour: { common: !0, size: 36e5, steps: 24 },
    day: { common: !0, size: 864e5, steps: 30 },
    week: { common: !1, size: 6048e5, steps: 4 },
    month: { common: !0, size: 2628e6, steps: 12 },
    quarter: { common: !1, size: 7884e6, steps: 4 },
    year: { common: !0, size: 3154e7 },
  },
  Y = Object.keys(le);
function lr(n, t) {
  return n - t;
}
function Ui(n, t) {
  if (R(t)) return null;
  const e = n._adapter,
    { parser: i, round: s, isoWeekday: o } = n._parseOpts;
  let a = t;
  return (
    typeof i == "function" && (a = i(a)),
    V(a) || (a = typeof i == "string" ? e.parse(a, i) : e.parse(a)),
    a === null
      ? null
      : (s &&
          (a = s === "week" && (wt(o) || o === !0) ? e.startOf(a, "isoWeek", o) : e.startOf(a, s)),
        +a)
  );
}
function Xi(n, t, e, i) {
  const s = Y.length;
  for (let o = Y.indexOf(n); o < s - 1; ++o) {
    const a = le[Y[o]],
      r = a.steps ? a.steps : Number.MAX_SAFE_INTEGER;
    if (a.common && Math.ceil((e - t) / (r * a.size)) <= i) return Y[o];
  }
  return Y[s - 1];
}
function hr(n, t, e, i, s) {
  for (let o = Y.length - 1; o >= Y.indexOf(e); o--) {
    const a = Y[o];
    if (le[a].common && n._adapter.diff(s, i, a) >= t - 1) return a;
  }
  return Y[e ? Y.indexOf(e) : 0];
}
function cr(n) {
  for (let t = Y.indexOf(n) + 1, e = Y.length; t < e; ++t) if (le[Y[t]].common) return Y[t];
}
function Ki(n, t, e) {
  if (!e) n[t] = !0;
  else if (e.length) {
    const { lo: i, hi: s } = qs(e, t),
      o = e[i] >= t ? e[i] : e[s];
    n[o] = !0;
  }
}
function dr(n, t, e, i) {
  const s = n._adapter,
    o = +s.startOf(t[0].value, i),
    a = t[t.length - 1].value;
  let r, l;
  for (r = o; r <= a; r = +s.add(r, 1, i)) (l = e[r]), l >= 0 && (t[l].major = !0);
  return t;
}
function Gi(n, t, e) {
  const i = [],
    s = {},
    o = t.length;
  let a, r;
  for (a = 0; a < o; ++a)
    (r = t[a]),
      (s[r] = a),
      i.push({
        value: r,
        major: !1,
      });
  return o === 0 || !e ? i : dr(n, i, s, e);
}
class he extends bt {
  constructor(t) {
    super(t),
      (this._cache = {
        data: [],
        labels: [],
        all: [],
      }),
      (this._unit = "day"),
      (this._majorUnit = void 0),
      (this._offsets = {}),
      (this._normalized = !1),
      (this._parseOpts = void 0);
  }
  init(t, e) {
    const i = t.time || (t.time = {}),
      s = (this._adapter = new lo._date(t.adapters.date));
    s.init(e),
      qt(i.displayFormats, s.formats()),
      (this._parseOpts = {
        parser: i.parser,
        round: i.round,
        isoWeekday: i.isoWeekday,
      }),
      super.init(t),
      (this._normalized = e.normalized);
  }
  parse(t, e) {
    return t === void 0 ? null : Ui(this, t);
  }
  beforeLayout() {
    super.beforeLayout(),
      (this._cache = {
        data: [],
        labels: [],
        all: [],
      });
  }
  determineDataLimits() {
    const t = this.options,
      e = this._adapter,
      i = t.time.unit || "day";
    let { min: s, max: o, minDefined: a, maxDefined: r } = this.getUserBounds();
    function l(h) {
      !a && !isNaN(h.min) && (s = Math.min(s, h.min)),
        !r && !isNaN(h.max) && (o = Math.max(o, h.max));
    }
    (!a || !r) &&
      (l(this._getLabelBounds()),
      (t.bounds !== "ticks" || t.ticks.source !== "labels") && l(this.getMinMax(!1))),
      (s = V(s) && !isNaN(s) ? s : +e.startOf(Date.now(), i)),
      (o = V(o) && !isNaN(o) ? o : +e.endOf(Date.now(), i) + 1),
      (this.min = Math.min(s, o - 1)),
      (this.max = Math.max(s + 1, o));
  }
  _getLabelBounds() {
    const t = this.getLabelTimestamps();
    let e = Number.POSITIVE_INFINITY,
      i = Number.NEGATIVE_INFINITY;
    return t.length && ((e = t[0]), (i = t[t.length - 1])), { min: e, max: i };
  }
  buildTicks() {
    const t = this.options,
      e = t.time,
      i = t.ticks,
      s = i.source === "labels" ? this.getLabelTimestamps() : this._generate();
    t.bounds === "ticks" &&
      s.length &&
      ((this.min = this._userMin || s[0]), (this.max = this._userMax || s[s.length - 1]));
    const o = this.min,
      a = this.max,
      r = Bs(s, o, a);
    return (
      (this._unit =
        e.unit ||
        (i.autoSkip
          ? Xi(e.minUnit, this.min, this.max, this._getLabelCapacity(o))
          : hr(this, r.length, e.minUnit, this.min, this.max))),
      (this._majorUnit = !i.major.enabled || this._unit === "year" ? void 0 : cr(this._unit)),
      this.initOffsets(s),
      t.reverse && r.reverse(),
      Gi(this, r, this._majorUnit)
    );
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map(t => +t.value));
  }
  initOffsets(t) {
    let e = 0,
      i = 0,
      s,
      o;
    this.options.offset &&
      t.length &&
      ((s = this.getDecimalForValue(t[0])),
      t.length === 1 ? (e = 1 - s) : (e = (this.getDecimalForValue(t[1]) - s) / 2),
      (o = this.getDecimalForValue(t[t.length - 1])),
      t.length === 1 ? (i = o) : (i = (o - this.getDecimalForValue(t[t.length - 2])) / 2));
    const a = t.length < 3 ? 0.5 : 0.25;
    (e = X(e, 0, a)),
      (i = X(i, 0, a)),
      (this._offsets = { start: e, end: i, factor: 1 / (e + 1 + i) });
  }
  _generate() {
    const t = this._adapter,
      e = this.min,
      i = this.max,
      s = this.options,
      o = s.time,
      a = o.unit || Xi(o.minUnit, e, i, this._getLabelCapacity(e)),
      r = C(o.stepSize, 1),
      l = a === "week" ? o.isoWeekday : !1,
      h = wt(l) || l === !0,
      c = {};
    let d = e,
      u,
      f;
    if (
      (h && (d = +t.startOf(d, "isoWeek", l)),
      (d = +t.startOf(d, h ? "day" : a)),
      t.diff(i, e, a) > 1e5 * r)
    )
      throw new Error(e + " and " + i + " are too far apart with stepSize of " + r + " " + a);
    const g = s.ticks.source === "data" && this.getDataTimestamps();
    for (u = d, f = 0; u < i; u = +t.add(u, r, a), f++) Ki(c, u, g);
    return (
      (u === i || s.bounds === "ticks" || f === 1) && Ki(c, u, g),
      Object.keys(c)
        .sort((p, m) => p - m)
        .map(p => +p)
    );
  }
  getLabelForValue(t) {
    const e = this._adapter,
      i = this.options.time;
    return i.tooltipFormat ? e.format(t, i.tooltipFormat) : e.format(t, i.displayFormats.datetime);
  }
  _tickFormatFunction(t, e, i, s) {
    const o = this.options,
      a = o.time.displayFormats,
      r = this._unit,
      l = this._majorUnit,
      h = r && a[r],
      c = l && a[l],
      d = i[e],
      u = l && c && d && d.major,
      f = this._adapter.format(t, s || (u ? c : h)),
      g = o.ticks.callback;
    return g ? E(g, [f, e, i], this) : f;
  }
  generateTickLabels(t) {
    let e, i, s;
    for (e = 0, i = t.length; e < i; ++e)
      (s = t[e]), (s.label = this._tickFormatFunction(s.value, e, t));
  }
  getDecimalForValue(t) {
    return t === null ? NaN : (t - this.min) / (this.max - this.min);
  }
  getPixelForValue(t) {
    const e = this._offsets,
      i = this.getDecimalForValue(t);
    return this.getPixelForDecimal((e.start + i) * e.factor);
  }
  getValueForPixel(t) {
    const e = this._offsets,
      i = this.getDecimalForPixel(t) / e.factor - e.end;
    return this.min + i * (this.max - this.min);
  }
  _getLabelSize(t) {
    const e = this.options.ticks,
      i = this.ctx.measureText(t).width,
      s = J(this.isHorizontal() ? e.maxRotation : e.minRotation),
      o = Math.cos(s),
      a = Math.sin(s),
      r = this._resolveTickFontOptions(0).size;
    return {
      w: i * o + r * a,
      h: i * a + r * o,
    };
  }
  _getLabelCapacity(t) {
    const e = this.options.time,
      i = e.displayFormats,
      s = i[e.unit] || i.millisecond,
      o = this._tickFormatFunction(t, 0, Gi(this, [t], this._majorUnit), s),
      a = this._getLabelSize(o),
      r = Math.floor(this.isHorizontal() ? this.width / a.w : this.height / a.h) - 1;
    return r > 0 ? r : 1;
  }
  getDataTimestamps() {
    let t = this._cache.data || [],
      e,
      i;
    if (t.length) return t;
    const s = this.getMatchingVisibleMetas();
    if (this._normalized && s.length)
      return (this._cache.data = s[0].controller.getAllParsedValues(this));
    for (e = 0, i = s.length; e < i; ++e) t = t.concat(s[e].controller.getAllParsedValues(this));
    return (this._cache.data = this.normalize(t));
  }
  getLabelTimestamps() {
    const t = this._cache.labels || [];
    let e, i;
    if (t.length) return t;
    const s = this.getLabels();
    for (e = 0, i = s.length; e < i; ++e) t.push(Ui(this, s[e]));
    return (this._cache.labels = this._normalized ? t : this.normalize(t));
  }
  normalize(t) {
    return ss(t.sort(lr));
  }
}
he.id = "time";
he.defaults = {
  bounds: "data",
  adapters: {},
  time: {
    parser: !1,
    unit: !1,
    round: !1,
    isoWeekday: !1,
    minUnit: "millisecond",
    displayFormats: {},
  },
  ticks: {
    source: "auto",
    major: {
      enabled: !1,
    },
  },
};
function Gt(n, t, e) {
  let i = 0,
    s = n.length - 1,
    o,
    a,
    r,
    l;
  e
    ? (t >= n[i].pos && t <= n[s].pos && ({ lo: i, hi: s } = we(n, "pos", t)),
      ({ pos: o, time: r } = n[i]),
      ({ pos: a, time: l } = n[s]))
    : (t >= n[i].time && t <= n[s].time && ({ lo: i, hi: s } = we(n, "time", t)),
      ({ time: o, pos: r } = n[i]),
      ({ time: a, pos: l } = n[s]));
  const h = a - o;
  return h ? r + ((l - r) * (t - o)) / h : r;
}
class Rs extends he {
  constructor(t) {
    super(t), (this._table = []), (this._minPos = void 0), (this._tableRange = void 0);
  }
  initOffsets() {
    const t = this._getTimestampsForTable(),
      e = (this._table = this.buildLookupTable(t));
    (this._minPos = Gt(e, this.min)),
      (this._tableRange = Gt(e, this.max) - this._minPos),
      super.initOffsets(t);
  }
  buildLookupTable(t) {
    const { min: e, max: i } = this,
      s = [],
      o = [];
    let a, r, l, h, c;
    for (a = 0, r = t.length; a < r; ++a) (h = t[a]), h >= e && h <= i && s.push(h);
    if (s.length < 2)
      return [
        { time: e, pos: 0 },
        { time: i, pos: 1 },
      ];
    for (a = 0, r = s.length; a < r; ++a)
      (c = s[a + 1]),
        (l = s[a - 1]),
        (h = s[a]),
        Math.round((c + l) / 2) !== h && o.push({ time: h, pos: a / (r - 1) });
    return o;
  }
  _getTimestampsForTable() {
    let t = this._cache.all || [];
    if (t.length) return t;
    const e = this.getDataTimestamps(),
      i = this.getLabelTimestamps();
    return (
      e.length && i.length ? (t = this.normalize(e.concat(i))) : (t = e.length ? e : i),
      (t = this._cache.all = t),
      t
    );
  }
  getDecimalForValue(t) {
    return (Gt(this._table, t) - this._minPos) / this._tableRange;
  }
  getValueForPixel(t) {
    const e = this._offsets,
      i = this.getDecimalForPixel(t) / e.factor - e.end;
    return Gt(this._table, i * this._tableRange + this._minPos, !0);
  }
}
Rs.id = "timeseries";
Rs.defaults = he.defaults;
export {
  xn as Animation,
  hs as Animations,
  je as ArcElement,
  Ie as BarController,
  Ye as BarElement,
  ms as BasePlatform,
  ko as BasicPlatform,
  Be as BubbleController,
  Ee as CategoryScale,
  Ss as Chart,
  Z as DatasetController,
  Ro as DomPlatform,
  Nt as DoughnutController,
  et as Element,
  fr as Filler,
  go as Interaction,
  gr as Legend,
  Ve as LineController,
  xt as LineElement,
  Os as LinearScale,
  Ts as LogarithmicScale,
  us as PieController,
  $e as PointElement,
  Ne as PolarAreaController,
  We as RadarController,
  re as RadialLinearScale,
  bt as Scale,
  He as ScatterController,
  ae as Ticks,
  he as TimeScale,
  Rs as TimeSeriesScale,
  pr as Tooltip,
  lo as _adapters,
  Fo as _detectPlatform,
  st as animator,
  A as defaults,
  rt as layouts,
  tt as registry,
};
