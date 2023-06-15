import {
  V as g,
  O as K,
  a as f,
  d as V,
  K as q,
  v as J,
  C as B,
  k as p,
  Q as Y,
  i as Q,
} from "../../chart.js/dist/chunks/helpers.segment.js";
import {
  ArcElement as Z,
  PointElement as ee,
  BarElement as re,
} from "../../chart.js/dist/chart.js";
/*!
 * chartjs-plugin-datalabels v2.2.0
 * https://chartjs-plugin-datalabels.netlify.app
 * (c) 2017-2022 chartjs-plugin-datalabels contributors
 * Released under the MIT license
 */
var W = (function () {
    if (typeof window < "u") {
      if (window.devicePixelRatio) return window.devicePixelRatio;
      var e = window.screen;
      if (e) return (e.deviceXDPI || 1) / (e.logicalXDPI || 1);
    }
    return 1;
  })(),
  m = {
    // @todo move this in Chart.helpers.toTextLines
    toTextLines: function (e) {
      var a = [],
        r;
      for (e = [].concat(e); e.length; )
        (r = e.pop()),
          typeof r == "string"
            ? a.unshift.apply(
                a,
                r.split(`
`)
              )
            : Array.isArray(r)
            ? e.push.apply(e, r)
            : p(e) || a.unshift("" + r);
      return a;
    },
    // @todo move this in Chart.helpers.canvas.textSize
    // @todo cache calls of measureText if font doesn't change?!
    textSize: function (e, a, r) {
      var t = [].concat(a),
        i = t.length,
        n = e.font,
        o = 0,
        l;
      for (e.font = r.string, l = 0; l < i; ++l) o = Math.max(e.measureText(t[l]).width, o);
      return (
        (e.font = n),
        {
          height: i * r.lineHeight,
          width: o,
        }
      );
    },
    /**
     * Returns value bounded by min and max. This is equivalent to max(min, min(value, max)).
     * @todo move this method in Chart.helpers.bound
     * https://doc.qt.io/qt-5/qtglobal.html#qBound
     */
    bound: function (e, a, r) {
      return Math.max(e, Math.min(a, r));
    },
    /**
     * Returns an array of pair [value, state] where state is:
     * * -1: value is only in a0 (removed)
     * *  1: value is only in a1 (added)
     */
    arrayDiff: function (e, a) {
      var r = e.slice(),
        t = [],
        i,
        n,
        o,
        l;
      for (i = 0, o = a.length; i < o; ++i)
        (l = a[i]), (n = r.indexOf(l)), n === -1 ? t.push([l, 1]) : r.splice(n, 1);
      for (i = 0, o = r.length; i < o; ++i) t.push([r[i], -1]);
      return t;
    },
    /**
     * https://github.com/chartjs/chartjs-plugin-datalabels/issues/70
     */
    rasterize: function (e) {
      return Math.round(e * W) / W;
    },
  };
function R(e, a) {
  var r = a.x,
    t = a.y;
  if (r === null) return { x: 0, y: -1 };
  if (t === null) return { x: 1, y: 0 };
  var i = e.x - r,
    n = e.y - t,
    o = Math.sqrt(i * i + n * n);
  return {
    x: o ? i / o : 0,
    y: o ? n / o : -1,
  };
}
function te(e, a, r, t, i) {
  switch (i) {
    case "center":
      r = t = 0;
      break;
    case "bottom":
      (r = 0), (t = 1);
      break;
    case "right":
      (r = 1), (t = 0);
      break;
    case "left":
      (r = -1), (t = 0);
      break;
    case "top":
      (r = 0), (t = -1);
      break;
    case "start":
      (r = -r), (t = -t);
      break;
    case "end":
      break;
    default:
      (i *= Math.PI / 180), (r = Math.cos(i)), (t = Math.sin(i));
      break;
  }
  return {
    x: e,
    y: a,
    vx: r,
    vy: t,
  };
}
var ae = 0,
  j = 1,
  O = 2,
  N = 4,
  F = 8;
function M(e, a, r) {
  var t = ae;
  return (
    e < r.left ? (t |= j) : e > r.right && (t |= O),
    a < r.top ? (t |= F) : a > r.bottom && (t |= N),
    t
  );
}
function ie(e, a) {
  for (
    var r = e.x0, t = e.y0, i = e.x1, n = e.y1, o = M(r, t, a), l = M(i, n, a), s, u, v;
    !(!(o | l) || o & l);

  )
    (s = o || l),
      s & F
        ? ((u = r + ((i - r) * (a.top - t)) / (n - t)), (v = a.top))
        : s & N
        ? ((u = r + ((i - r) * (a.bottom - t)) / (n - t)), (v = a.bottom))
        : s & O
        ? ((v = t + ((n - t) * (a.right - r)) / (i - r)), (u = a.right))
        : s & j && ((v = t + ((n - t) * (a.left - r)) / (i - r)), (u = a.left)),
      s === o ? ((r = u), (t = v), (o = M(r, t, a))) : ((i = u), (n = v), (l = M(i, n, a)));
  return {
    x0: r,
    x1: i,
    y0: t,
    y1: n,
  };
}
function P(e, a) {
  var r = a.anchor,
    t = e,
    i,
    n;
  return (
    a.clamp && (t = ie(t, a.area)),
    r === "start"
      ? ((i = t.x0), (n = t.y0))
      : r === "end"
      ? ((i = t.x1), (n = t.y1))
      : ((i = (t.x0 + t.x1) / 2), (n = (t.y0 + t.y1) / 2)),
    te(i, n, e.vx, e.vy, a.align)
  );
}
var E = {
    arc: function (e, a) {
      var r = (e.startAngle + e.endAngle) / 2,
        t = Math.cos(r),
        i = Math.sin(r),
        n = e.innerRadius,
        o = e.outerRadius;
      return P(
        {
          x0: e.x + t * n,
          y0: e.y + i * n,
          x1: e.x + t * o,
          y1: e.y + i * o,
          vx: t,
          vy: i,
        },
        a
      );
    },
    point: function (e, a) {
      var r = R(e, a.origin),
        t = r.x * e.options.radius,
        i = r.y * e.options.radius;
      return P(
        {
          x0: e.x - t,
          y0: e.y - i,
          x1: e.x + t,
          y1: e.y + i,
          vx: r.x,
          vy: r.y,
        },
        a
      );
    },
    bar: function (e, a) {
      var r = R(e, a.origin),
        t = e.x,
        i = e.y,
        n = 0,
        o = 0;
      return (
        e.horizontal
          ? ((t = Math.min(e.x, e.base)), (n = Math.abs(e.base - e.x)))
          : ((i = Math.min(e.y, e.base)), (o = Math.abs(e.base - e.y))),
        P(
          {
            x0: t,
            y0: i + o,
            x1: t + n,
            y1: i,
            vx: r.x,
            vy: r.y,
          },
          a
        )
      );
    },
    fallback: function (e, a) {
      var r = R(e, a.origin);
      return P(
        {
          x0: e.x,
          y0: e.y,
          x1: e.x + (e.width || 0),
          y1: e.y + (e.height || 0),
          vx: r.x,
          vy: r.y,
        },
        a
      );
    },
  },
  x = m.rasterize;
function ne(e) {
  var a = e.borderWidth || 0,
    r = e.padding,
    t = e.size.height,
    i = e.size.width,
    n = -i / 2,
    o = -t / 2;
  return {
    frame: {
      x: n - r.left - a,
      y: o - r.top - a,
      w: i + r.width + a * 2,
      h: t + r.height + a * 2,
    },
    text: {
      x: n,
      y: o,
      w: i,
      h: t,
    },
  };
}
function oe(e, a) {
  var r = a.chart.getDatasetMeta(a.datasetIndex).vScale;
  if (!r) return null;
  if (r.xCenter !== void 0 && r.yCenter !== void 0) return { x: r.xCenter, y: r.yCenter };
  var t = r.getBasePixel();
  return e.horizontal ? { x: t, y: null } : { x: null, y: t };
}
function le(e) {
  return e instanceof Z ? E.arc : e instanceof ee ? E.point : e instanceof re ? E.bar : E.fallback;
}
function se(e, a, r, t, i, n) {
  var o = Math.PI / 2;
  if (n) {
    var l = Math.min(n, i / 2, t / 2),
      s = a + l,
      u = r + l,
      v = a + t - l,
      d = r + i - l;
    e.moveTo(a, u),
      s < v && u < d
        ? (e.arc(s, u, l, -Math.PI, -o),
          e.arc(v, u, l, -o, 0),
          e.arc(v, d, l, 0, o),
          e.arc(s, d, l, o, Math.PI))
        : s < v
        ? (e.moveTo(s, r), e.arc(v, u, l, -o, o), e.arc(s, u, l, o, Math.PI + o))
        : u < d
        ? (e.arc(s, u, l, -Math.PI, 0), e.arc(s, d, l, 0, Math.PI))
        : e.arc(s, u, l, -Math.PI, Math.PI),
      e.closePath(),
      e.moveTo(a, r);
  } else e.rect(a, r, t, i);
}
function ue(e, a, r) {
  var t = r.backgroundColor,
    i = r.borderColor,
    n = r.borderWidth;
  (!t && (!i || !n)) ||
    (e.beginPath(),
    se(e, x(a.x) + n / 2, x(a.y) + n / 2, x(a.w) - n, x(a.h) - n, r.borderRadius),
    e.closePath(),
    t && ((e.fillStyle = t), e.fill()),
    i && n && ((e.strokeStyle = i), (e.lineWidth = n), (e.lineJoin = "miter"), e.stroke()));
}
function ve(e, a, r) {
  var t = r.lineHeight,
    i = e.w,
    n = e.x,
    o = e.y + t / 2;
  return (
    a === "center" ? (n += i / 2) : (a === "end" || a === "right") && (n += i),
    {
      h: t,
      w: i,
      x: n,
      y: o,
    }
  );
}
function de(e, a, r) {
  var t = e.shadowBlur,
    i = r.stroked,
    n = x(r.x),
    o = x(r.y),
    l = x(r.w);
  i && e.strokeText(a, n, o, l),
    r.filled &&
      (t && i && (e.shadowBlur = 0), e.fillText(a, n, o, l), t && i && (e.shadowBlur = t));
}
function fe(e, a, r, t) {
  var i = t.textAlign,
    n = t.color,
    o = !!n,
    l = t.font,
    s = a.length,
    u = t.textStrokeColor,
    v = t.textStrokeWidth,
    d = u && v,
    y;
  if (!(!s || (!o && !d)))
    for (
      r = ve(r, i, l),
        e.font = l.string,
        e.textAlign = i,
        e.textBaseline = "middle",
        e.shadowBlur = t.textShadowBlur,
        e.shadowColor = t.textShadowColor,
        o && (e.fillStyle = n),
        d && ((e.lineJoin = "round"), (e.lineWidth = v), (e.strokeStyle = u)),
        y = 0,
        s = a.length;
      y < s;
      ++y
    )
      de(e, a[y], {
        stroked: d,
        filled: o,
        w: r.w,
        x: r.x,
        y: r.y + r.h * y,
      });
}
var L = function (e, a, r, t) {
  var i = this;
  (i._config = e), (i._index = t), (i._model = null), (i._rects = null), (i._ctx = a), (i._el = r);
};
g(L.prototype, {
  /**
   * @private
   */
  _modelize: function (e, a, r, t) {
    var i = this,
      n = i._index,
      o = K(f([r.font, {}], t, n)),
      l = f([r.color, V.color], t, n);
    return {
      align: f([r.align, "center"], t, n),
      anchor: f([r.anchor, "center"], t, n),
      area: t.chart.chartArea,
      backgroundColor: f([r.backgroundColor, null], t, n),
      borderColor: f([r.borderColor, null], t, n),
      borderRadius: f([r.borderRadius, 0], t, n),
      borderWidth: f([r.borderWidth, 0], t, n),
      clamp: f([r.clamp, !1], t, n),
      clip: f([r.clip, !1], t, n),
      color: l,
      display: e,
      font: o,
      lines: a,
      offset: f([r.offset, 4], t, n),
      opacity: f([r.opacity, 1], t, n),
      origin: oe(i._el, t),
      padding: q(f([r.padding, 4], t, n)),
      positioner: le(i._el),
      rotation: f([r.rotation, 0], t, n) * (Math.PI / 180),
      size: m.textSize(i._ctx, a, o),
      textAlign: f([r.textAlign, "start"], t, n),
      textShadowBlur: f([r.textShadowBlur, 0], t, n),
      textShadowColor: f([r.textShadowColor, l], t, n),
      textStrokeColor: f([r.textStrokeColor, l], t, n),
      textStrokeWidth: f([r.textStrokeWidth, 0], t, n),
    };
  },
  update: function (e) {
    var a = this,
      r = null,
      t = null,
      i = a._index,
      n = a._config,
      o,
      l,
      s,
      u = f([n.display, !0], e, i);
    u &&
      ((o = e.dataset.data[i]),
      (l = J(B(n.formatter, [o, e]), o)),
      (s = p(l) ? [] : m.toTextLines(l)),
      s.length && ((r = a._modelize(u, s, n, e)), (t = ne(r)))),
      (a._model = r),
      (a._rects = t);
  },
  geometry: function () {
    return this._rects ? this._rects.frame : {};
  },
  rotation: function () {
    return this._model ? this._model.rotation : 0;
  },
  visible: function () {
    return this._model && this._model.opacity;
  },
  model: function () {
    return this._model;
  },
  draw: function (e, a) {
    var r = this,
      t = e.ctx,
      i = r._model,
      n = r._rects,
      o;
    this.visible() &&
      (t.save(),
      i.clip &&
        ((o = i.area),
        t.beginPath(),
        t.rect(o.left, o.top, o.right - o.left, o.bottom - o.top),
        t.clip()),
      (t.globalAlpha = m.bound(0, i.opacity, 1)),
      t.translate(x(a.x), x(a.y)),
      t.rotate(i.rotation),
      ue(t, n.frame, i),
      fe(t, i.lines, n.text, i),
      t.restore());
  },
});
var he = Number.MIN_SAFE_INTEGER || -9007199254740991,
  ye = Number.MAX_SAFE_INTEGER || 9007199254740991;
function b(e, a, r) {
  var t = Math.cos(r),
    i = Math.sin(r),
    n = a.x,
    o = a.y;
  return {
    x: n + t * (e.x - n) - i * (e.y - o),
    y: o + i * (e.x - n) + t * (e.y - o),
  };
}
function z(e, a) {
  var r = ye,
    t = he,
    i = a.origin,
    n,
    o,
    l,
    s,
    u;
  for (n = 0; n < e.length; ++n)
    (o = e[n]),
      (l = o.x - i.x),
      (s = o.y - i.y),
      (u = a.vx * l + a.vy * s),
      (r = Math.min(r, u)),
      (t = Math.max(t, u));
  return {
    min: r,
    max: t,
  };
}
function I(e, a) {
  var r = a.x - e.x,
    t = a.y - e.y,
    i = Math.sqrt(r * r + t * t);
  return {
    vx: (a.x - e.x) / i,
    vy: (a.y - e.y) / i,
    origin: e,
    ln: i,
  };
}
var G = function () {
  (this._rotation = 0),
    (this._rect = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    });
};
g(G.prototype, {
  center: function () {
    var e = this._rect;
    return {
      x: e.x + e.w / 2,
      y: e.y + e.h / 2,
    };
  },
  update: function (e, a, r) {
    (this._rotation = r),
      (this._rect = {
        x: a.x + e.x,
        y: a.y + e.y,
        w: a.w,
        h: a.h,
      });
  },
  contains: function (e) {
    var a = this,
      r = 1,
      t = a._rect;
    return (
      (e = b(e, a.center(), -a._rotation)),
      !(e.x < t.x - r || e.y < t.y - r || e.x > t.x + t.w + r * 2 || e.y > t.y + t.h + r * 2)
    );
  },
  // Separating Axis Theorem
  // https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169
  intersects: function (e) {
    var a = this._points(),
      r = e._points(),
      t = [I(a[0], a[1]), I(a[0], a[3])],
      i,
      n,
      o;
    for (
      this._rotation !== e._rotation && t.push(I(r[0], r[1]), I(r[0], r[3])), i = 0;
      i < t.length;
      ++i
    )
      if (((n = z(a, t[i])), (o = z(r, t[i])), n.max < o.min || o.max < n.min)) return !1;
    return !0;
  },
  /**
   * @private
   */
  _points: function () {
    var e = this,
      a = e._rect,
      r = e._rotation,
      t = e.center();
    return [
      b({ x: a.x, y: a.y }, t, r),
      b({ x: a.x + a.w, y: a.y }, t, r),
      b({ x: a.x + a.w, y: a.y + a.h }, t, r),
      b({ x: a.x, y: a.y + a.h }, t, r),
    ];
  },
});
function H(e, a, r) {
  var t = a.positioner(e, a),
    i = t.vx,
    n = t.vy;
  if (!i && !n) return { x: t.x, y: t.y };
  var o = r.w,
    l = r.h,
    s = a.rotation,
    u = Math.abs((o / 2) * Math.cos(s)) + Math.abs((l / 2) * Math.sin(s)),
    v = Math.abs((o / 2) * Math.sin(s)) + Math.abs((l / 2) * Math.cos(s)),
    d = 1 / Math.max(Math.abs(i), Math.abs(n));
  return (
    (u *= i * d),
    (v *= n * d),
    (u += a.offset * i),
    (v += a.offset * n),
    {
      x: t.x + u,
      y: t.y + v,
    }
  );
}
function xe(e, a) {
  var r, t, i, n;
  for (r = e.length - 1; r >= 0; --r)
    for (i = e[r].$layout, t = r - 1; t >= 0 && i._visible; --t)
      (n = e[t].$layout), n._visible && i._box.intersects(n._box) && a(i, n);
  return e;
}
function _e(e) {
  var a, r, t, i, n, o, l;
  for (a = 0, r = e.length; a < r; ++a)
    (t = e[a]),
      (i = t.$layout),
      i._visible &&
        ((l = new Proxy(t._el, { get: (s, u) => s.getProps([u], !0)[u] })),
        (n = t.geometry()),
        (o = H(l, t.model(), n)),
        i._box.update(o, n, t.rotation()));
  return xe(e, function (s, u) {
    var v = s._hidable,
      d = u._hidable;
    (v && d) || d ? (u._visible = !1) : v && (s._visible = !1);
  });
}
var w = {
    prepare: function (e) {
      var a = [],
        r,
        t,
        i,
        n,
        o;
      for (r = 0, i = e.length; r < i; ++r)
        for (t = 0, n = e[r].length; t < n; ++t)
          (o = e[r][t]),
            a.push(o),
            (o.$layout = {
              _box: new G(),
              _hidable: !1,
              _visible: !0,
              _set: r,
              _idx: o._index,
            });
      return (
        a.sort(function (l, s) {
          var u = l.$layout,
            v = s.$layout;
          return u._idx === v._idx ? v._set - u._set : v._idx - u._idx;
        }),
        this.update(a),
        a
      );
    },
    update: function (e) {
      var a = !1,
        r,
        t,
        i,
        n,
        o;
      for (r = 0, t = e.length; r < t; ++r)
        (i = e[r]),
          (n = i.model()),
          (o = i.$layout),
          (o._hidable = n && n.display === "auto"),
          (o._visible = i.visible()),
          (a |= o._hidable);
      a && _e(e);
    },
    lookup: function (e, a) {
      var r, t;
      for (r = e.length - 1; r >= 0; --r)
        if (((t = e[r].$layout), t && t._visible && t._box.contains(a))) return e[r];
      return null;
    },
    draw: function (e, a) {
      var r, t, i, n, o, l;
      for (r = 0, t = a.length; r < t; ++r)
        (i = a[r]),
          (n = i.$layout),
          n._visible &&
            ((o = i.geometry()),
            (l = H(i._el, i.model(), o)),
            n._box.update(l, o, i.rotation()),
            i.draw(e, l));
    },
  },
  ce = function (e) {
    if (p(e)) return null;
    var a = e,
      r,
      t,
      i;
    if (Q(e))
      if (!p(e.label)) a = e.label;
      else if (!p(e.r)) a = e.r;
      else
        for (a = "", r = Object.keys(e), i = 0, t = r.length; i < t; ++i)
          a += (i !== 0 ? ", " : "") + r[i] + ": " + e[r[i]];
    return "" + a;
  },
  be = {
    align: "center",
    anchor: "center",
    backgroundColor: null,
    borderColor: null,
    borderRadius: 0,
    borderWidth: 0,
    clamp: !1,
    clip: !1,
    color: void 0,
    display: !0,
    font: {
      family: void 0,
      lineHeight: 1.2,
      size: void 0,
      style: void 0,
      weight: null,
    },
    formatter: ce,
    labels: void 0,
    listeners: {},
    offset: 4,
    opacity: 1,
    padding: {
      top: 4,
      right: 4,
      bottom: 4,
      left: 4,
    },
    rotation: 0,
    textAlign: "start",
    textStrokeColor: void 0,
    textStrokeWidth: 0,
    textShadowBlur: 0,
    textShadowColor: void 0,
  },
  h = "$datalabels",
  U = "$default";
function pe(e, a) {
  var r = e.datalabels,
    t = {},
    i = [],
    n,
    o;
  return r === !1
    ? null
    : (r === !0 && (r = {}),
      (a = g({}, [a, r])),
      (n = a.labels || {}),
      (o = Object.keys(n)),
      delete a.labels,
      o.length
        ? o.forEach(function (l) {
            n[l] && i.push(g({}, [a, n[l], { _key: l }]));
          })
        : i.push(a),
      (t = i.reduce(function (l, s) {
        return (
          Y(s.listeners || {}, function (u, v) {
            (l[v] = l[v] || {}), (l[v][s._key || U] = u);
          }),
          delete s.listeners,
          l
        );
      }, {})),
      {
        labels: i,
        listeners: t,
      });
}
function A(e, a, r, t) {
  if (a) {
    var i = r.$context,
      n = r.$groups,
      o;
    a[n._set] &&
      ((o = a[n._set][n._key]), o && B(o, [i, t]) === !0 && ((e[h]._dirty = !0), r.update(i)));
  }
}
function me(e, a, r, t, i) {
  var n, o;
  (!r && !t) ||
    (r ? (t ? r !== t && (o = n = !0) : (o = !0)) : (n = !0),
    o && A(e, a.leave, r, i),
    n && A(e, a.enter, t, i));
}
function we(e, a) {
  var r = e[h],
    t = r._listeners,
    i,
    n;
  if (!(!t.enter && !t.leave)) {
    if (a.type === "mousemove") n = w.lookup(r._labels, a);
    else if (a.type !== "mouseout") return;
    (i = r._hovered), (r._hovered = n), me(e, t, i, n, a);
  }
}
function ge(e, a) {
  var r = e[h],
    t = r._listeners.click,
    i = t && w.lookup(r._labels, a);
  i && A(e, t, i, a);
}
var Pe = {
  id: "datalabels",
  defaults: be,
  beforeInit: function (e) {
    e[h] = {
      _actives: [],
    };
  },
  beforeUpdate: function (e) {
    var a = e[h];
    (a._listened = !1), (a._listeners = {}), (a._datasets = []), (a._labels = []);
  },
  afterDatasetUpdate: function (e, a, r) {
    var t = a.index,
      i = e[h],
      n = (i._datasets[t] = []),
      o = e.isDatasetVisible(t),
      l = e.data.datasets[t],
      s = pe(l, r),
      u = a.meta.data || [],
      v = e.ctx,
      d,
      y,
      $,
      T,
      S,
      D,
      c,
      _;
    for (v.save(), d = 0, $ = u.length; d < $; ++d)
      if (((c = u[d]), (c[h] = []), o && c && e.getDataVisibility(d) && !c.skip))
        for (y = 0, T = s.labels.length; y < T; ++y)
          (S = s.labels[y]),
            (D = S._key),
            (_ = new L(S, v, c, d)),
            (_.$groups = {
              _set: t,
              _key: D || U,
            }),
            (_.$context = {
              active: !1,
              chart: e,
              dataIndex: d,
              dataset: l,
              datasetIndex: t,
            }),
            _.update(_.$context),
            c[h].push(_),
            n.push(_);
    v.restore(),
      g(i._listeners, s.listeners, {
        merger: function (k, C, X) {
          (C[k] = C[k] || {}), (C[k][a.index] = X[k]), (i._listened = !0);
        },
      });
  },
  afterUpdate: function (e) {
    e[h]._labels = w.prepare(e[h]._datasets);
  },
  // Draw labels on top of all dataset elements
  // https://github.com/chartjs/chartjs-plugin-datalabels/issues/29
  // https://github.com/chartjs/chartjs-plugin-datalabels/issues/32
  afterDatasetsDraw: function (e) {
    w.draw(e, e[h]._labels);
  },
  beforeEvent: function (e, a) {
    if (e[h]._listened) {
      var r = a.event;
      switch (r.type) {
        case "mousemove":
        case "mouseout":
          we(e, r);
          break;
        case "click":
          ge(e, r);
          break;
      }
    }
  },
  afterEvent: function (e) {
    var a = e[h],
      r = a._actives,
      t = (a._actives = e.getActiveElements()),
      i = m.arrayDiff(r, t),
      n,
      o,
      l,
      s,
      u,
      v,
      d;
    for (n = 0, o = i.length; n < o; ++n)
      if (((u = i[n]), u[1]))
        for (d = u[0].element[h] || [], l = 0, s = d.length; l < s; ++l)
          (v = d[l]), (v.$context.active = u[1] === 1), v.update(v.$context);
    (a._dirty || i.length) && (w.update(a._labels), e.render()), delete a._dirty;
  },
};
export { Pe as default };
