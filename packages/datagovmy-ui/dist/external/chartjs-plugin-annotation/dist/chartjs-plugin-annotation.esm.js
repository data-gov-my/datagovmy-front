import { Element as R, Chart as oe, Animations as ct } from "../../chart.js/dist/chart.js";
import {
  d as ut,
  t as w,
  j as p,
  K as F,
  aG as fe,
  F as ft,
  P as b,
  i as B,
  v as _,
  C as he,
  b as D,
  O as K,
  av as ht,
  ax as yt,
  b3 as X,
  H as J,
  b4 as Me,
  T as bt,
  x as Pe,
  b2 as Ve,
  L as gt,
  N as mt,
  g as $e,
  a8 as I,
} from "../../chart.js/dist/chunks/helpers.segment.js";
/*!
 * chartjs-plugin-annotation v2.2.1
 * https://www.chartjs.org/chartjs-plugin-annotation/index
 * (c) 2023 chartjs-plugin-annotation Contributors
 * Released under the MIT License
 */
const ke = {
  modes: {
    /**
     * Point mode returns all elements that hit test based on the event position
     * @param {Object} state - the state of the plugin
     * @param {ChartEvent} event - the event we are find things at
     * @return {AnnotationElement[]} - elements that are found
     */
    point(t, e) {
      return q(t, e, { intersect: !0 });
    },
    /**
     * Nearest mode returns the element closest to the event position
     * @param {Object} state - the state of the plugin
     * @param {ChartEvent} event - the event we are find things at
     * @param {Object} options - interaction options to use
     * @return {AnnotationElement[]} - elements that are found (only 1 element)
     */
    nearest(t, e, n) {
      return xt(t, e, n);
    },
    /**
     * x mode returns the elements that hit-test at the current x coordinate
     * @param {Object} state - the state of the plugin
     * @param {ChartEvent} event - the event we are find things at
     * @param {Object} options - interaction options to use
     * @return {AnnotationElement[]} - elements that are found
     */
    x(t, e, n) {
      return q(t, e, { intersect: n.intersect, axis: "x" });
    },
    /**
     * y mode returns the elements that hit-test at the current y coordinate
     * @param {Object} state - the state of the plugin
     * @param {ChartEvent} event - the event we are find things at
     * @param {Object} options - interaction options to use
     * @return {AnnotationElement[]} - elements that are found
     */
    y(t, e, n) {
      return q(t, e, { intersect: n.intersect, axis: "y" });
    },
  },
};
function ye(t, e, n) {
  return (ke.modes[n.mode] || ke.modes.nearest)(t, e, n);
}
function pt(t, e, n) {
  return n !== "x" && n !== "y"
    ? t.inRange(e.x, e.y, "x", !0) || t.inRange(e.x, e.y, "y", !0)
    : t.inRange(e.x, e.y, n, !0);
}
function wt(t, e, n) {
  return n === "x" ? { x: t.x, y: e.y } : n === "y" ? { x: e.x, y: t.y } : e;
}
function q(t, e, n) {
  return t.visibleElements.filter(o => (n.intersect ? o.inRange(e.x, e.y) : pt(o, e, n.axis)));
}
function xt(t, e, n) {
  let o = Number.POSITIVE_INFINITY;
  return q(t, e, n)
    .reduce((r, i) => {
      const s = i.getCenterPoint(),
        a = wt(e, s, n.axis),
        d = fe(e, a);
      return d < o ? ((r = [i]), (o = d)) : d === o && r.push(i), r;
    }, [])
    .sort((r, i) => r._index - i._index)
    .slice(0, 1);
}
const St = (t, e) => e > t || (t.length > e.length && t.slice(0, e.length) === e),
  A = 1e-3,
  Q = (t, e, n) => Math.min(n, Math.max(e, t));
function Ct(t, e, n) {
  for (const o of Object.keys(t)) t[o] = Q(t[o], e, n);
  return t;
}
function Mt(t, e, n, o) {
  if (!t || !e || n <= 0) return !1;
  const r = o / 2;
  return Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2) <= Math.pow(n + r, 2);
}
function Je(t, { x: e, y: n, x2: o, y2: r }, i, s) {
  const a = s / 2,
    d = t.x >= e - a - A && t.x <= o + a + A,
    l = t.y >= n - a - A && t.y <= r + a + A;
  return i === "x" ? d : (i === "y" || d) && l;
}
function E(t, e) {
  const { centerX: n, centerY: o } = t.getProps(["centerX", "centerY"], e);
  return { x: n, y: o };
}
function Pt(t, e, n, o = !0) {
  const r = n.split(".");
  let i = 0;
  for (const s of e.split(".")) {
    const a = r[i++];
    if (parseInt(s, 10) < parseInt(a, 10)) break;
    if (St(a, s)) {
      if (o) throw new Error(`${t} v${n} is not supported. v${e} or newer is required.`);
      return !1;
    }
  }
  return !0;
}
const Ue = t => typeof t == "string" && t.endsWith("%"),
  qe = t => parseFloat(t) / 100,
  Ke = t => Q(qe(t), 0, 1);
function be(t, e) {
  return e === "start" ? 0 : e === "end" ? t : Ue(e) ? Ke(e) * t : t / 2;
}
function M(t, e, n = !0) {
  return typeof e == "number" ? e : Ue(e) ? (n ? Ke(e) : qe(e)) * t : t;
}
function kt(t, e) {
  const { x: n, width: o } = t,
    r = e.textAlign;
  return r === "center" ? n + o / 2 : r === "end" || r === "right" ? n + o : n;
}
function ge(t, e = "center") {
  return B(t)
    ? {
        x: _(t.x, e),
        y: _(t.y, e),
      }
    : ((t = _(t, e)),
      {
        x: t,
        y: t,
      });
}
function Ge(t) {
  return t && (p(t.xValue) || p(t.yValue));
}
function H(t, e, n, o = !1) {
  const r = n.init;
  if (r) {
    if (r === !0) return Qe(e, o);
  } else return;
  return vt(e, o, he(r, [{ chart: t, properties: e, options: n }]));
}
function Fe(t, e, n) {
  let o = !1;
  return (
    e.forEach(r => {
      I(t[r]) ? ((o = !0), (n[r] = t[r])) : p(n[r]) && delete n[r];
    }),
    o
  );
}
function Qe({ centerX: t, centerY: e }, n) {
  return n
    ? { centerX: t, centerY: e, radius: 0, width: 0, height: 0 }
    : { x: t, y: e, x2: t, y2: e, width: 0, height: 0 };
}
function vt(t, e, n) {
  if (n === !0) return Qe(t, e);
  if (B(n)) return n;
}
const re = /* @__PURE__ */ new Map(),
  At = t => isNaN(t) || t <= 0,
  Dt = t =>
    t.reduce(function (e, n) {
      return (e += n.string), e;
    }, "");
function Z(t) {
  if (t && typeof t == "object") {
    const e = t.toString();
    return e === "[object HTMLImageElement]" || e === "[object HTMLCanvasElement]";
  }
}
function me(t, { x: e, y: n }, o) {
  o && (t.translate(e, n), t.rotate(w(o)), t.translate(-e, -n));
}
function P(t, e) {
  if (e && e.borderWidth)
    return (
      (t.lineCap = e.borderCapStyle),
      t.setLineDash(e.borderDash),
      (t.lineDashOffset = e.borderDashOffset),
      (t.lineJoin = e.borderJoinStyle),
      (t.lineWidth = e.borderWidth),
      (t.strokeStyle = e.borderColor),
      !0
    );
}
function W(t, e) {
  (t.shadowColor = e.backgroundShadowColor),
    (t.shadowBlur = e.shadowBlur),
    (t.shadowOffsetX = e.shadowOffsetX),
    (t.shadowOffsetY = e.shadowOffsetY);
}
function pe(t, e) {
  const n = e.content;
  if (Z(n))
    return {
      width: M(n.width, e.width),
      height: M(n.height, e.height),
    };
  const o = e.font,
    r = D(o) ? o.map(d => K(d)) : [K(o)],
    i = e.textStrokeWidth,
    s = D(n) ? n : [n],
    a = s.join() + Dt(r) + i + (t._measureText ? "-spriting" : "");
  return re.has(a) || re.set(a, Rt(t, s, r, i)), re.get(a);
}
function Ze(t, e, n) {
  const { x: o, y: r, width: i, height: s } = e;
  t.save(), W(t, n);
  const a = P(t, n);
  (t.fillStyle = n.backgroundColor),
    t.beginPath(),
    ht(t, {
      x: o,
      y: r,
      w: i,
      h: s,
      radius: Ct(yt(n.borderRadius), 0, Math.min(i, s) / 2),
    }),
    t.closePath(),
    t.fill(),
    a && ((t.shadowColor = n.borderShadowColor), t.stroke()),
    t.restore();
}
function jt(t, e, n) {
  const o = n.content;
  if (Z(o)) {
    t.save(),
      (t.globalAlpha = Lt(n.opacity, o.style.opacity)),
      t.drawImage(o, e.x, e.y, e.width, e.height),
      t.restore();
    return;
  }
  const r = D(o) ? o : [o],
    i = n.font,
    s = D(i) ? i.map(u => K(u)) : [K(i)],
    a = n.color,
    d = D(a) ? a : [a],
    l = kt(e, n),
    c = e.y + n.textStrokeWidth / 2;
  t.save(),
    (t.textBaseline = "middle"),
    (t.textAlign = n.textAlign),
    Tt(t, n) && Et(t, { x: l, y: c }, r, s),
    Wt(t, { x: l, y: c }, r, { fonts: s, colors: d }),
    t.restore();
}
function Tt(t, e) {
  if (e.textStrokeWidth > 0)
    return (
      (t.lineJoin = "round"),
      (t.miterLimit = 2),
      (t.lineWidth = e.textStrokeWidth),
      (t.strokeStyle = e.textStrokeColor),
      !0
    );
}
function It(t, e, n, o) {
  const { radius: r, options: i } = e,
    s = i.pointStyle,
    a = i.rotation;
  let d = (a || 0) * Ve;
  if (Z(s)) {
    t.save(),
      t.translate(n, o),
      t.rotate(d),
      t.drawImage(s, -s.width / 2, -s.height / 2, s.width, s.height),
      t.restore();
    return;
  }
  At(r) || Ot(t, { x: n, y: o, radius: r, rotation: a, style: s, rad: d });
}
function Ot(t, { x: e, y: n, radius: o, rotation: r, style: i, rad: s }) {
  let a, d, l, c;
  switch ((t.beginPath(), i)) {
    default:
      t.arc(e, n, o, 0, bt), t.closePath();
      break;
    case "triangle":
      t.moveTo(e + Math.sin(s) * o, n - Math.cos(s) * o),
        (s += Me),
        t.lineTo(e + Math.sin(s) * o, n - Math.cos(s) * o),
        (s += Me),
        t.lineTo(e + Math.sin(s) * o, n - Math.cos(s) * o),
        t.closePath();
      break;
    case "rectRounded":
      (c = o * 0.516),
        (l = o - c),
        (a = Math.cos(s + X) * l),
        (d = Math.sin(s + X) * l),
        t.arc(e - a, n - d, c, s - b, s - J),
        t.arc(e + d, n - a, c, s - J, s),
        t.arc(e + a, n + d, c, s, s + J),
        t.arc(e - d, n + a, c, s + J, s + b),
        t.closePath();
      break;
    case "rect":
      if (!r) {
        (l = Math.SQRT1_2 * o), t.rect(e - l, n - l, 2 * l, 2 * l);
        break;
      }
      s += X;
    case "rectRot":
      (a = Math.cos(s) * o),
        (d = Math.sin(s) * o),
        t.moveTo(e - a, n - d),
        t.lineTo(e + d, n - a),
        t.lineTo(e + a, n + d),
        t.lineTo(e - d, n + a),
        t.closePath();
      break;
    case "crossRot":
      s += X;
    case "cross":
      (a = Math.cos(s) * o),
        (d = Math.sin(s) * o),
        t.moveTo(e - a, n - d),
        t.lineTo(e + a, n + d),
        t.moveTo(e + d, n - a),
        t.lineTo(e - d, n + a);
      break;
    case "star":
      (a = Math.cos(s) * o),
        (d = Math.sin(s) * o),
        t.moveTo(e - a, n - d),
        t.lineTo(e + a, n + d),
        t.moveTo(e + d, n - a),
        t.lineTo(e - d, n + a),
        (s += X),
        (a = Math.cos(s) * o),
        (d = Math.sin(s) * o),
        t.moveTo(e - a, n - d),
        t.lineTo(e + a, n + d),
        t.moveTo(e + d, n - a),
        t.lineTo(e - d, n + a);
      break;
    case "line":
      (a = Math.cos(s) * o), (d = Math.sin(s) * o), t.moveTo(e - a, n - d), t.lineTo(e + a, n + d);
      break;
    case "dash":
      t.moveTo(e, n), t.lineTo(e + Math.cos(s) * o, n + Math.sin(s) * o);
      break;
  }
  t.fill();
}
function Rt(t, e, n, o) {
  t.save();
  const r = e.length;
  let i = 0,
    s = o;
  for (let a = 0; a < r; a++) {
    const d = n[Math.min(a, n.length - 1)];
    t.font = d.string;
    const l = e[a];
    (i = Math.max(i, t.measureText(l).width + o)), (s += d.lineHeight);
  }
  return t.restore(), { width: i, height: s };
}
function Et(t, { x: e, y: n }, o, r) {
  t.beginPath();
  let i = 0;
  o.forEach(function (s, a) {
    const d = r[Math.min(a, r.length - 1)],
      l = d.lineHeight;
    (t.font = d.string), t.strokeText(s, e, n + l / 2 + i), (i += l);
  }),
    t.stroke();
}
function Wt(t, { x: e, y: n }, o, { fonts: r, colors: i }) {
  let s = 0;
  o.forEach(function (a, d) {
    const l = i[Math.min(d, i.length - 1)],
      c = r[Math.min(d, r.length - 1)],
      u = c.lineHeight;
    t.beginPath(),
      (t.font = c.string),
      (t.fillStyle = l),
      t.fillText(a, e, n + u / 2 + s),
      (s += u),
      t.fill();
  });
}
function Lt(t, e) {
  const n = Pe(t) ? t : e;
  return Pe(n) ? Q(n, 0, 1) : 1;
}
const ve = {
  xScaleID: {
    min: "xMin",
    max: "xMax",
    start: "left",
    end: "right",
    startProp: "x",
    endProp: "x2",
  },
  yScaleID: {
    min: "yMin",
    max: "yMax",
    start: "bottom",
    end: "top",
    startProp: "y",
    endProp: "y2",
  },
};
function O(t, e, n) {
  return (e = typeof e == "number" ? e : t.parse(e)), $e(e) ? t.getPixelForValue(e) : n;
}
function j(t, e, n) {
  const o = e[n];
  if (o || n === "scaleID") return o;
  const r = n.charAt(0),
    i = Object.values(t).filter(s => s.axis && s.axis === r);
  return i.length ? i[0].id : r;
}
function et(t, e) {
  if (t) {
    const n = t.options.reverse,
      o = O(t, e.min, n ? e.end : e.start),
      r = O(t, e.max, n ? e.start : e.end);
    return {
      start: o,
      end: r,
    };
  }
}
function tt(t, e) {
  const { chartArea: n, scales: o } = t,
    r = o[j(o, e, "xScaleID")],
    i = o[j(o, e, "yScaleID")];
  let s = n.width / 2,
    a = n.height / 2;
  return (
    r && (s = O(r, e.xValue, r.left + r.width / 2)),
    i && (a = O(i, e.yValue, i.top + i.height / 2)),
    { x: s, y: a }
  );
}
function we(t, e) {
  const n = t.scales,
    o = n[j(n, e, "xScaleID")],
    r = n[j(n, e, "yScaleID")];
  if (!o && !r) return {};
  let { left: i, right: s } = o || t.chartArea,
    { top: a, bottom: d } = r || t.chartArea;
  const l = Ae(o, { min: e.xMin, max: e.xMax, start: i, end: s });
  (i = l.start), (s = l.end);
  const c = Ae(r, { min: e.yMin, max: e.yMax, start: d, end: a });
  return (
    (a = c.start),
    (d = c.end),
    {
      x: i,
      y: a,
      x2: s,
      y2: d,
      width: s - i,
      height: d - a,
      centerX: i + (s - i) / 2,
      centerY: a + (d - a) / 2,
    }
  );
}
function nt(t, e) {
  if (!Ge(e)) {
    const n = we(t, e);
    let o = e.radius;
    (!o || isNaN(o)) && ((o = Math.min(n.width, n.height) / 2), (e.radius = o));
    const r = o * 2,
      i = n.centerX + e.xAdjust,
      s = n.centerY + e.yAdjust;
    return {
      x: i - o,
      y: s - o,
      x2: i + o,
      y2: s + o,
      centerX: i,
      centerY: s,
      width: r,
      height: r,
      radius: o,
    };
  }
  return Xt(t, e);
}
function Yt(t, e) {
  const { scales: n, chartArea: o } = t,
    r = n[e.scaleID],
    i = { x: o.left, y: o.top, x2: o.right, y2: o.bottom };
  return r ? zt(r, i, e) : _t(n, i, e), i;
}
function ot(t, e, n) {
  const o = we(t, e);
  return (
    (o.initProperties = H(t, o, e, n)),
    (o.elements = [
      {
        type: "label",
        optionScope: "label",
        properties: Nt(t, o, e),
        initProperties: o.initProperties,
      },
    ]),
    o
  );
}
function Xt(t, e) {
  const n = tt(t, e),
    o = e.radius * 2;
  return {
    x: n.x - e.radius + e.xAdjust,
    y: n.y - e.radius + e.yAdjust,
    x2: n.x + e.radius + e.xAdjust,
    y2: n.y + e.radius + e.yAdjust,
    centerX: n.x + e.xAdjust,
    centerY: n.y + e.yAdjust,
    radius: e.radius,
    width: o,
    height: o,
  };
}
function Ae(t, e) {
  const n = et(t, e) || e;
  return {
    start: Math.min(n.start, n.end),
    end: Math.max(n.start, n.end),
  };
}
function zt(t, e, n) {
  const o = O(t, n.value, NaN),
    r = O(t, n.endValue, o);
  t.isHorizontal() ? ((e.x = o), (e.x2 = r)) : ((e.y = o), (e.y2 = r));
}
function _t(t, e, n) {
  for (const o of Object.keys(ve)) {
    const r = t[j(t, n, o)];
    if (r) {
      const { min: i, max: s, start: a, end: d, startProp: l, endProp: c } = ve[o],
        u = et(r, { min: n[i], max: n[s], start: r[a], end: r[d] });
      (e[l] = u.start), (e[c] = u.end);
    }
  }
}
function Bt({ properties: t, options: e }, n, o, r) {
  const { x: i, x2: s, width: a } = t;
  return rt(
    { start: i, end: s, size: a, borderWidth: e.borderWidth },
    {
      position: o.x,
      padding: { start: r.left, end: r.right },
      adjust: e.label.xAdjust,
      size: n.width,
    }
  );
}
function Ht({ properties: t, options: e }, n, o, r) {
  const { y: i, y2: s, height: a } = t;
  return rt(
    { start: i, end: s, size: a, borderWidth: e.borderWidth },
    {
      position: o.y,
      padding: { start: r.top, end: r.bottom },
      adjust: e.label.yAdjust,
      size: n.height,
    }
  );
}
function rt(t, e) {
  const { start: n, end: o, borderWidth: r } = t,
    {
      position: i,
      padding: { start: s, end: a },
      adjust: d,
    } = e,
    l = o - r - n - s - a - e.size;
  return n + r / 2 + d + be(l, i);
}
function Nt(t, e, n) {
  const o = n.label;
  (o.backgroundColor = "transparent"), (o.callout.display = !1);
  const r = ge(o.position),
    i = F(o.padding),
    s = pe(t.ctx, o),
    a = Bt({ properties: e, options: n }, s, r, i),
    d = Ht({ properties: e, options: n }, s, r, i),
    l = s.width + i.width,
    c = s.height + i.height;
  return {
    x: a,
    y: d,
    x2: a + l,
    y2: d + c,
    width: l,
    height: c,
    centerX: a + l / 2,
    centerY: d + c / 2,
    rotation: o.rotation,
  };
}
function T(t, e, n) {
  const o = Math.cos(n),
    r = Math.sin(n),
    i = e.x,
    s = e.y;
  return {
    x: i + o * (t.x - i) - r * (t.y - s),
    y: s + r * (t.x - i) + o * (t.y - s),
  };
}
const ie = ["enter", "leave"],
  xe = ie.concat("click");
function Vt(t, e, n) {
  (e.listened = Fe(n, xe, e.listeners)),
    (e.moveListened = !1),
    (e._getElements = ye),
    ie.forEach(o => {
      I(n[o]) && (e.moveListened = !0);
    }),
    (!e.listened || !e.moveListened) &&
      e.annotations.forEach(o => {
        !e.listened && I(o.click) && (e.listened = !0),
          e.moveListened ||
            ie.forEach(r => {
              I(o[r]) && ((e.listened = !0), (e.moveListened = !0));
            });
      });
}
function $t(t, e, n) {
  if (t.listened)
    switch (e.type) {
      case "mousemove":
      case "mouseout":
        return Jt(t, e, n);
      case "click":
        return Ut(t, e, n);
    }
}
function Jt(t, e, n) {
  if (!t.moveListened) return;
  let o;
  e.type === "mousemove" ? (o = ye(t, e, n.interaction)) : (o = []);
  const r = t.hovered;
  t.hovered = o;
  const i = { state: t, event: e };
  let s = De(i, "leave", r, o);
  return De(i, "enter", o, r) || s;
}
function De({ state: t, event: e }, n, o, r) {
  let i;
  for (const s of o) r.indexOf(s) < 0 && (i = it(s.options[n] || t.listeners[n], s, e) || i);
  return i;
}
function Ut(t, e, n) {
  const o = t.listeners,
    r = ye(t, e, n.interaction);
  let i;
  for (const s of r) i = it(s.options.click || o.click, s, e) || i;
  return i;
}
function it(t, e, n) {
  return he(t, [e.$context, n]) === !0;
}
const G = ["afterDraw", "beforeDraw"];
function qt(t, e, n) {
  const o = e.visibleElements;
  (e.hooked = Fe(n, G, e.hooks)),
    e.hooked ||
      o.forEach(r => {
        e.hooked ||
          G.forEach(i => {
            I(r.options[i]) && (e.hooked = !0);
          });
      });
}
function je(t, e, n) {
  if (t.hooked) {
    const o = e.options[n] || t.hooks[n];
    return he(o, [e.$context]);
  }
}
function Kt(t, e, n) {
  const o = en(t.scales, e, n);
  let r = Te(e, o, "min", "suggestedMin");
  (r = Te(e, o, "max", "suggestedMax") || r),
    r && I(e.handleTickRangeOptions) && e.handleTickRangeOptions();
}
function Gt(t, e) {
  for (const n of t) Qt(n, e);
}
function Te(t, e, n, o) {
  if ($e(e[n]) && !Ft(t.options, n, o)) {
    const r = t[n] !== e[n];
    return (t[n] = e[n]), r;
  }
}
function Ft(t, e, n) {
  return p(t[e]) || p(t[n]);
}
function Qt(t, e) {
  for (const n of ["scaleID", "xScaleID", "yScaleID"]) {
    const o = j(e, t, n);
    o &&
      !e[o] &&
      Zt(t, n) &&
      console.warn(`No scale found with id '${o}' for annotation '${t.id}'`);
  }
}
function Zt(t, e) {
  if (e === "scaleID") return !0;
  const n = e.charAt(0);
  for (const o of ["Min", "Max", "Value"]) if (p(t[n + o])) return !0;
  return !1;
}
function en(t, e, n) {
  const o = e.axis,
    r = e.id,
    i = o + "ScaleID",
    s = {
      min: _(e.min, Number.NEGATIVE_INFINITY),
      max: _(e.max, Number.POSITIVE_INFINITY),
    };
  for (const a of n)
    a.scaleID === r
      ? Ie(a, e, ["value", "endValue"], s)
      : j(t, a, i) === r && Ie(a, e, [o + "Min", o + "Max", o + "Value"], s);
  return s;
}
function Ie(t, e, n, o) {
  for (const r of n) {
    const i = t[r];
    if (p(i)) {
      const s = e.parse(i);
      (o.min = Math.min(o.min, s)), (o.max = Math.max(o.max, s));
    }
  }
}
class L extends R {
  inRange(e, n, o, r) {
    const { x: i, y: s } = T({ x: e, y: n }, this.getCenterPoint(r), w(-this.options.rotation));
    return Je(
      { x: i, y: s },
      this.getProps(["x", "y", "x2", "y2"], r),
      o,
      this.options.borderWidth
    );
  }
  getCenterPoint(e) {
    return E(this, e);
  }
  draw(e) {
    e.save(),
      me(e, this.getCenterPoint(), this.options.rotation),
      Ze(e, this, this.options),
      e.restore();
  }
  get label() {
    return this.elements && this.elements[0];
  }
  resolveElementProperties(e, n) {
    return ot(e, n);
  }
}
L.id = "boxAnnotation";
L.defaults = {
  adjustScaleRange: !0,
  backgroundShadowColor: "transparent",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderRadius: 0,
  borderShadowColor: "transparent",
  borderWidth: 1,
  display: !0,
  init: void 0,
  label: {
    backgroundColor: "transparent",
    borderWidth: 0,
    callout: {
      display: !1,
    },
    color: "black",
    content: null,
    display: !1,
    drawTime: void 0,
    font: {
      family: void 0,
      lineHeight: void 0,
      size: void 0,
      style: void 0,
      weight: "bold",
    },
    height: void 0,
    opacity: void 0,
    padding: 6,
    position: "center",
    rotation: void 0,
    textAlign: "start",
    textStrokeColor: void 0,
    textStrokeWidth: 0,
    width: void 0,
    xAdjust: 0,
    yAdjust: 0,
    z: void 0,
  },
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  z: 0,
};
L.defaultRoutes = {
  borderColor: "color",
  backgroundColor: "color",
};
L.descriptors = {
  label: {
    _fallback: !0,
  },
};
const st = ["left", "bottom", "top", "right"];
class N extends R {
  inRange(e, n, o, r) {
    const { x: i, y: s } = T({ x: e, y: n }, this.getCenterPoint(r), w(-this.rotation));
    return Je(
      { x: i, y: s },
      this.getProps(["x", "y", "x2", "y2"], r),
      o,
      this.options.borderWidth
    );
  }
  getCenterPoint(e) {
    return E(this, e);
  }
  draw(e) {
    const n = this.options,
      o = !p(this._visible) || this._visible;
    !n.display ||
      !n.content ||
      !o ||
      (e.save(),
      me(e, this.getCenterPoint(), this.rotation),
      nn(e, this),
      Ze(e, this, n),
      jt(e, cn(this), n),
      e.restore());
  }
  resolveElementProperties(e, n) {
    let o;
    if (Ge(n)) o = tt(e, n);
    else {
      const { centerX: a, centerY: d } = we(e, n);
      o = { x: a, y: d };
    }
    const r = F(n.padding),
      i = pe(e.ctx, n),
      s = tn(o, i, n, r);
    return {
      initProperties: H(e, s, n),
      pointX: o.x,
      pointY: o.y,
      ...s,
      rotation: n.rotation,
    };
  }
}
N.id = "labelAnnotation";
N.defaults = {
  adjustScaleRange: !0,
  backgroundColor: "transparent",
  backgroundShadowColor: "transparent",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderRadius: 0,
  borderShadowColor: "transparent",
  borderWidth: 0,
  callout: {
    borderCapStyle: "butt",
    borderColor: void 0,
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 1,
    display: !1,
    margin: 5,
    position: "auto",
    side: 5,
    start: "50%",
  },
  color: "black",
  content: null,
  display: !0,
  font: {
    family: void 0,
    lineHeight: void 0,
    size: void 0,
    style: void 0,
    weight: void 0,
  },
  height: void 0,
  init: void 0,
  opacity: void 0,
  padding: 6,
  position: "center",
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  textAlign: "center",
  textStrokeColor: void 0,
  textStrokeWidth: 0,
  width: void 0,
  xAdjust: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  xValue: void 0,
  yAdjust: 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  yValue: void 0,
  z: 0,
};
N.defaultRoutes = {
  borderColor: "color",
};
function tn(t, e, n, o) {
  const r = e.width + o.width + n.borderWidth,
    i = e.height + o.height + n.borderWidth,
    s = ge(n.position, "center"),
    a = Oe(t.x, r, n.xAdjust, s.x),
    d = Oe(t.y, i, n.yAdjust, s.y);
  return {
    x: a,
    y: d,
    x2: a + r,
    y2: d + i,
    width: r,
    height: i,
    centerX: a + r / 2,
    centerY: d + i / 2,
  };
}
function Oe(t, e, n = 0, o) {
  return t - be(e, o) + n;
}
function nn(t, e) {
  const { pointX: n, pointY: o, options: r } = e,
    i = r.callout,
    s = i && i.display && dn(e, i);
  if (!s || un(e, i, s)) return;
  if ((t.save(), t.beginPath(), !P(t, i))) return t.restore();
  const { separatorStart: d, separatorEnd: l } = on(e, s),
    { sideStart: c, sideEnd: u } = sn(e, s, d);
  (i.margin > 0 || r.borderWidth === 0) && (t.moveTo(d.x, d.y), t.lineTo(l.x, l.y)),
    t.moveTo(c.x, c.y),
    t.lineTo(u.x, u.y);
  const f = T({ x: n, y: o }, e.getCenterPoint(), w(-e.rotation));
  t.lineTo(f.x, f.y), t.stroke(), t.restore();
}
function on(t, e) {
  const { x: n, y: o, x2: r, y2: i } = t,
    s = rn(t, e);
  let a, d;
  return (
    e === "left" || e === "right"
      ? ((a = { x: n + s, y: o }), (d = { x: a.x, y: i }))
      : ((a = { x: n, y: o + s }), (d = { x: r, y: a.y })),
    { separatorStart: a, separatorEnd: d }
  );
}
function rn(t, e) {
  const { width: n, height: o, options: r } = t,
    i = r.callout.margin + r.borderWidth / 2;
  return e === "right" ? n + i : e === "bottom" ? o + i : -i;
}
function sn(t, e, n) {
  const { y: o, width: r, height: i, options: s } = t,
    a = s.callout.start,
    d = an(e, s.callout);
  let l, c;
  return (
    e === "left" || e === "right"
      ? ((l = { x: n.x, y: o + M(i, a) }), (c = { x: l.x + d, y: l.y }))
      : ((l = { x: n.x + M(r, a), y: n.y }), (c = { x: l.x, y: l.y + d })),
    { sideStart: l, sideEnd: c }
  );
}
function an(t, e) {
  const n = e.side;
  return t === "left" || t === "top" ? -n : n;
}
function dn(t, e) {
  const n = e.position;
  return st.includes(n) ? n : ln(t, e);
}
function ln(t, e) {
  const {
      x: n,
      y: o,
      x2: r,
      y2: i,
      width: s,
      height: a,
      pointX: d,
      pointY: l,
      centerX: c,
      centerY: u,
      rotation: f,
    } = t,
    h = { x: c, y: u },
    y = e.start,
    x = M(s, y),
    Y = M(a, y),
    g = [n, n + x, n + x, r],
    m = [o + Y, i, o, i],
    k = [];
  for (let v = 0; v < 4; v++) {
    const ne = T({ x: g[v], y: m[v] }, h, w(f));
    k.push({
      position: st[v],
      distance: fe(ne, { x: d, y: l }),
    });
  }
  return k.sort((v, ne) => v.distance - ne.distance)[0].position;
}
function cn({ x: t, y: e, width: n, height: o, options: r }) {
  const i = r.borderWidth / 2,
    s = F(r.padding);
  return {
    x: t + s.left + i,
    y: e + s.top + i,
    width: n - s.left - s.right - r.borderWidth,
    height: o - s.top - s.bottom - r.borderWidth,
  };
}
function un(t, e, n) {
  const { pointX: o, pointY: r } = t,
    i = e.margin;
  let s = o,
    a = r;
  return (
    n === "left"
      ? (s += i)
      : n === "right"
      ? (s -= i)
      : n === "top"
      ? (a += i)
      : n === "bottom" && (a -= i),
    t.inRange(s, a)
  );
}
const Se = (t, e, n) => ({ x: t.x + n * (e.x - t.x), y: t.y + n * (e.y - t.y) }),
  se = (t, e, n) => Se(e, n, Math.abs((t - e.y) / (n.y - e.y))).x,
  Re = (t, e, n) => Se(e, n, Math.abs((t - e.x) / (n.x - e.x))).y,
  z = t => t * t,
  fn = (t, e, { x: n, y: o, x2: r, y2: i }, s) =>
    s === "y"
      ? { start: Math.min(o, i), end: Math.max(o, i), value: e }
      : { start: Math.min(n, r), end: Math.max(n, r), value: t },
  Ee = (t, e, n, o) => (1 - o) * (1 - o) * t + 2 * (1 - o) * o * e + o * o * n,
  ae = (t, e, n, o) => ({ x: Ee(t.x, e.x, n.x, o), y: Ee(t.y, e.y, n.y, o) }),
  We = (t, e, n, o) => 2 * (1 - o) * (e - t) + 2 * o * (n - e),
  Le = (t, e, n, o) => -Math.atan2(We(t.x, e.x, n.x, o), We(t.y, e.y, n.y, o)) + 0.5 * b;
class V extends R {
  inRange(e, n, o, r) {
    const i = this.options.borderWidth / 2;
    if (o !== "x" && o !== "y") {
      const s = { mouseX: e, mouseY: n },
        { path: a, ctx: d } = this;
      if (a) {
        P(d, this.options);
        const { chart: c } = this.$context,
          u = e * c.currentDevicePixelRatio,
          f = n * c.currentDevicePixelRatio,
          h = d.isPointInStroke(a, u, f) || de(this, s, r);
        return d.restore(), h;
      }
      const l = z(i);
      return gn(this, s, l, r) || de(this, s, r);
    }
    return hn(this, { mouseX: e, mouseY: n }, o, { hBorderWidth: i, useFinalPosition: r });
  }
  getCenterPoint(e) {
    return E(this, e);
  }
  draw(e) {
    const { x: n, y: o, x2: r, y2: i, cp: s, options: a } = this;
    if ((e.save(), !P(e, a))) return e.restore();
    W(e, a);
    const d = Math.sqrt(Math.pow(r - n, 2) + Math.pow(i - o, 2));
    if (a.curve && s) return Pn(e, this, s, d), e.restore();
    const { startOpts: l, endOpts: c, startAdjust: u, endAdjust: f } = at(this),
      h = Math.atan2(i - o, r - n);
    e.translate(n, o),
      e.rotate(h),
      e.beginPath(),
      e.moveTo(0 + u, 0),
      e.lineTo(d - f, 0),
      (e.shadowColor = a.borderShadowColor),
      e.stroke(),
      le(e, 0, u, l),
      le(e, d, -f, c),
      e.restore();
  }
  get label() {
    return this.elements && this.elements[0];
  }
  resolveElementProperties(e, n) {
    const o = Yt(e, n),
      { x: r, y: i, x2: s, y2: a } = o,
      d = yn(o, e.chartArea),
      l = d
        ? bn({ x: r, y: i }, { x: s, y: a }, e.chartArea)
        : { x: r, y: i, x2: s, y2: a, width: Math.abs(s - r), height: Math.abs(a - i) };
    if (
      ((l.centerX = (s + r) / 2),
      (l.centerY = (a + i) / 2),
      (l.initProperties = H(e, l, n)),
      n.curve)
    ) {
      const u = { x: l.x, y: l.y },
        f = { x: l.x2, y: l.y2 };
      l.cp = Mn(l, n, fe(u, f));
    }
    const c = mn(e, l, n.label);
    return (
      (c._visible = d),
      (l.elements = [
        {
          type: "label",
          optionScope: "label",
          properties: c,
          initProperties: l.initProperties,
        },
      ]),
      l
    );
  }
}
V.id = "lineAnnotation";
const Ye = {
  backgroundColor: void 0,
  backgroundShadowColor: void 0,
  borderColor: void 0,
  borderDash: void 0,
  borderDashOffset: void 0,
  borderShadowColor: void 0,
  borderWidth: void 0,
  display: void 0,
  fill: void 0,
  length: void 0,
  shadowBlur: void 0,
  shadowOffsetX: void 0,
  shadowOffsetY: void 0,
  width: void 0,
};
V.defaults = {
  adjustScaleRange: !0,
  arrowHeads: {
    display: !1,
    end: Object.assign({}, Ye),
    fill: !1,
    length: 12,
    start: Object.assign({}, Ye),
    width: 6,
  },
  borderDash: [],
  borderDashOffset: 0,
  borderShadowColor: "transparent",
  borderWidth: 2,
  curve: !1,
  controlPoint: {
    y: "-50%",
  },
  display: !0,
  endValue: void 0,
  init: void 0,
  label: {
    backgroundColor: "rgba(0,0,0,0.8)",
    backgroundShadowColor: "transparent",
    borderCapStyle: "butt",
    borderColor: "black",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderRadius: 6,
    borderShadowColor: "transparent",
    borderWidth: 0,
    callout: Object.assign({}, N.defaults.callout),
    color: "#fff",
    content: null,
    display: !1,
    drawTime: void 0,
    font: {
      family: void 0,
      lineHeight: void 0,
      size: void 0,
      style: void 0,
      weight: "bold",
    },
    height: void 0,
    opacity: void 0,
    padding: 6,
    position: "center",
    rotation: 0,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    textAlign: "center",
    textStrokeColor: void 0,
    textStrokeWidth: 0,
    width: void 0,
    xAdjust: 0,
    yAdjust: 0,
    z: void 0,
  },
  scaleID: void 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  value: void 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  z: 0,
};
V.descriptors = {
  arrowHeads: {
    start: {
      _fallback: !0,
    },
    end: {
      _fallback: !0,
    },
    _fallback: !0,
  },
};
V.defaultRoutes = {
  borderColor: "color",
};
function hn(t, { mouseX: e, mouseY: n }, o, { hBorderWidth: r, useFinalPosition: i }) {
  const s = fn(e, n, t.getProps(["x", "y", "x2", "y2"], i), o);
  return (s.value >= s.start - r && s.value <= s.end + r) || de(t, { mouseX: e, mouseY: n }, i, o);
}
function yn({ x: t, y: e, x2: n, y2: o }, { top: r, right: i, bottom: s, left: a }) {
  return !((t < a && n < a) || (t > i && n > i) || (e < r && o < r) || (e > s && o > s));
}
function Xe({ x: t, y: e }, n, { top: o, right: r, bottom: i, left: s }) {
  return (
    t < s && ((e = Re(s, { x: t, y: e }, n)), (t = s)),
    t > r && ((e = Re(r, { x: t, y: e }, n)), (t = r)),
    e < o && ((t = se(o, { x: t, y: e }, n)), (e = o)),
    e > i && ((t = se(i, { x: t, y: e }, n)), (e = i)),
    { x: t, y: e }
  );
}
function bn(t, e, n) {
  const { x: o, y: r } = Xe(t, e, n),
    { x: i, y: s } = Xe(e, t, n);
  return { x: o, y: r, x2: i, y2: s, width: Math.abs(i - o), height: Math.abs(s - r) };
}
function gn(t, { mouseX: e, mouseY: n }, o = A, r) {
  const { x: i, y: s, x2: a, y2: d } = t.getProps(["x", "y", "x2", "y2"], r),
    l = a - i,
    c = d - s,
    u = z(l) + z(c),
    f = u === 0 ? -1 : ((e - i) * l + (n - s) * c) / u;
  let h, y;
  return (
    f < 0 ? ((h = i), (y = s)) : f > 1 ? ((h = a), (y = d)) : ((h = i + f * l), (y = s + f * c)),
    z(e - h) + z(n - y) <= o
  );
}
function de(t, { mouseX: e, mouseY: n }, o, r) {
  const i = t.label;
  return i.options.display && i.inRange(e, n, r, o);
}
function mn(t, e, n) {
  const o = n.borderWidth,
    r = F(n.padding),
    i = pe(t.ctx, n),
    s = i.width + r.width + o,
    a = i.height + r.height + o;
  return wn(e, n, { width: s, height: a, padding: r }, t.chartArea);
}
function pn(t) {
  const { x: e, y: n, x2: o, y2: r } = t,
    i = Math.atan2(r - n, o - e);
  return i > b / 2 ? i - b : i < b / -2 ? i + b : i;
}
function wn(t, e, n, o) {
  const { width: r, height: i, padding: s } = n,
    { xAdjust: a, yAdjust: d } = e,
    l = { x: t.x, y: t.y },
    c = { x: t.x2, y: t.y2 },
    u = e.rotation === "auto" ? pn(t) : w(e.rotation),
    f = xn(r, i, u),
    h = Sn(t, e, { labelSize: f, padding: s }, o),
    y = t.cp ? ae(l, t.cp, c, h) : Se(l, c, h),
    x = { size: f.w, min: o.left, max: o.right, padding: s.left },
    Y = { size: f.h, min: o.top, max: o.bottom, padding: s.top },
    g = _e(y.x, x) + a,
    m = _e(y.y, Y) + d;
  return {
    x: g - r / 2,
    y: m - i / 2,
    x2: g + r / 2,
    y2: m + i / 2,
    centerX: g,
    centerY: m,
    pointX: y.x,
    pointY: y.y,
    width: r,
    height: i,
    rotation: ft(u),
  };
}
function xn(t, e, n) {
  const o = Math.cos(n),
    r = Math.sin(n);
  return {
    w: Math.abs(t * o) + Math.abs(e * r),
    h: Math.abs(t * r) + Math.abs(e * o),
  };
}
function Sn(t, e, n, o) {
  let r;
  const i = Cn(t, o);
  return (
    e.position === "start"
      ? (r = ze({ w: t.x2 - t.x, h: t.y2 - t.y }, n, e, i))
      : e.position === "end"
      ? (r = 1 - ze({ w: t.x - t.x2, h: t.y - t.y2 }, n, e, i))
      : (r = be(1, e.position)),
    r
  );
}
function ze(t, e, n, o) {
  const { labelSize: r, padding: i } = e,
    s = t.w * o.dx,
    a = t.h * o.dy,
    d = s > 0 && (r.w / 2 + i.left - o.x) / s,
    l = a > 0 && (r.h / 2 + i.top - o.y) / a;
  return Q(Math.max(d, l), 0, 0.25);
}
function Cn(t, e) {
  const { x: n, x2: o, y: r, y2: i } = t,
    s = Math.min(r, i) - e.top,
    a = Math.min(n, o) - e.left,
    d = e.bottom - Math.max(r, i),
    l = e.right - Math.max(n, o);
  return {
    x: Math.min(a, l),
    y: Math.min(s, d),
    dx: a <= l ? 1 : -1,
    dy: s <= d ? 1 : -1,
  };
}
function _e(t, e) {
  const { size: n, min: o, max: r, padding: i } = e,
    s = n / 2;
  return n > r - o
    ? (r + o) / 2
    : (o >= t - i - s && (t = o + i + s), r <= t + i + s && (t = r - i - s), t);
}
function at(t) {
  const e = t.options,
    n = e.arrowHeads && e.arrowHeads.start,
    o = e.arrowHeads && e.arrowHeads.end;
  return {
    startOpts: n,
    endOpts: o,
    startAdjust: Be(t, n),
    endAdjust: Be(t, o),
  };
}
function Be(t, e) {
  if (!e || !e.display) return 0;
  const { length: n, width: o } = e,
    r = t.options.borderWidth / 2,
    i = { x: n, y: o + r };
  return Math.abs(se(0, i, { x: 0, y: r }));
}
function le(t, e, n, o) {
  if (!o || !o.display) return;
  const { length: r, width: i, fill: s, backgroundColor: a, borderColor: d } = o,
    l = Math.abs(e - r) + n;
  t.beginPath(),
    W(t, o),
    P(t, o),
    t.moveTo(l, -i),
    t.lineTo(e + n, 0),
    t.lineTo(l, i),
    s === !0
      ? ((t.fillStyle = a || d), t.closePath(), t.fill(), (t.shadowColor = "transparent"))
      : (t.shadowColor = o.borderShadowColor),
    t.stroke();
}
function Mn(t, e, n) {
  const { x: o, y: r, x2: i, y2: s, centerX: a, centerY: d } = t,
    l = Math.atan2(s - r, i - o),
    c = ge(e.controlPoint, 0),
    u = {
      x: a + M(n, c.x, !1),
      y: d + M(n, c.y, !1),
    };
  return T(u, { x: a, y: d }, l);
}
function He(t, { x: e, y: n }, { angle: o, adjust: r }, i) {
  !i || !i.display || (t.save(), t.translate(e, n), t.rotate(o), le(t, 0, -r, i), t.restore());
}
function Pn(t, e, n, o) {
  const { x: r, y: i, x2: s, y2: a, options: d } = e,
    { startOpts: l, endOpts: c, startAdjust: u, endAdjust: f } = at(e),
    h = { x: r, y: i },
    y = { x: s, y: a },
    x = Le(h, n, y, 0),
    Y = Le(h, n, y, 1) - b,
    g = ae(h, n, y, u / o),
    m = ae(h, n, y, 1 - f / o),
    k = new Path2D();
  t.beginPath(),
    k.moveTo(g.x, g.y),
    k.quadraticCurveTo(n.x, n.y, m.x, m.y),
    (t.shadowColor = d.borderShadowColor),
    t.stroke(k),
    (e.path = k),
    (e.ctx = t),
    He(t, g, { angle: x, adjust: u }, l),
    He(t, m, { angle: Y, adjust: f }, c);
}
class $ extends R {
  inRange(e, n, o, r) {
    const i = this.options.rotation,
      s = this.options.borderWidth;
    if (o !== "x" && o !== "y")
      return kn({ x: e, y: n }, this.getProps(["width", "height", "centerX", "centerY"], r), i, s);
    const { x: a, y: d, x2: l, y2: c } = this.getProps(["x", "y", "x2", "y2"], r),
      u = s / 2,
      f = o === "y" ? { start: d, end: c } : { start: a, end: l },
      h = T({ x: e, y: n }, this.getCenterPoint(r), w(-i));
    return h[o] >= f.start - u - A && h[o] <= f.end + u + A;
  }
  getCenterPoint(e) {
    return E(this, e);
  }
  draw(e) {
    const { width: n, height: o, centerX: r, centerY: i, options: s } = this;
    e.save(),
      me(e, this.getCenterPoint(), s.rotation),
      W(e, this.options),
      e.beginPath(),
      (e.fillStyle = s.backgroundColor);
    const a = P(e, s);
    e.ellipse(r, i, o / 2, n / 2, b / 2, 0, 2 * b),
      e.fill(),
      a && ((e.shadowColor = s.borderShadowColor), e.stroke()),
      e.restore();
  }
  get label() {
    return this.elements && this.elements[0];
  }
  resolveElementProperties(e, n) {
    return ot(e, n, !0);
  }
}
$.id = "ellipseAnnotation";
$.defaults = {
  adjustScaleRange: !0,
  backgroundShadowColor: "transparent",
  borderDash: [],
  borderDashOffset: 0,
  borderShadowColor: "transparent",
  borderWidth: 1,
  display: !0,
  init: void 0,
  label: Object.assign({}, L.defaults.label),
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  z: 0,
};
$.defaultRoutes = {
  borderColor: "color",
  backgroundColor: "color",
};
$.descriptors = {
  label: {
    _fallback: !0,
  },
};
function kn(t, e, n, o) {
  const { width: r, height: i, centerX: s, centerY: a } = e,
    d = r / 2,
    l = i / 2;
  if (d <= 0 || l <= 0) return !1;
  const c = w(n || 0),
    u = o / 2 || 0,
    f = Math.cos(c),
    h = Math.sin(c),
    y = Math.pow(f * (t.x - s) + h * (t.y - a), 2),
    x = Math.pow(h * (t.x - s) - f * (t.y - a), 2);
  return y / Math.pow(d + u, 2) + x / Math.pow(l + u, 2) <= 1.0001;
}
class ee extends R {
  inRange(e, n, o, r) {
    const {
        x: i,
        y: s,
        x2: a,
        y2: d,
        width: l,
      } = this.getProps(["x", "y", "x2", "y2", "width"], r),
      c = this.options.borderWidth;
    if (o !== "x" && o !== "y") return Mt({ x: e, y: n }, this.getCenterPoint(r), l / 2, c);
    const u = c / 2,
      f = o === "y" ? { start: s, end: d, value: n } : { start: i, end: a, value: e };
    return f.value >= f.start - u && f.value <= f.end + u;
  }
  getCenterPoint(e) {
    return E(this, e);
  }
  draw(e) {
    const n = this.options,
      o = n.borderWidth;
    if (n.radius < 0.1) return;
    e.save(), (e.fillStyle = n.backgroundColor), W(e, n);
    const r = P(e, n);
    It(e, this, this.centerX, this.centerY),
      r && !Z(n.pointStyle) && ((e.shadowColor = n.borderShadowColor), e.stroke()),
      e.restore(),
      (n.borderWidth = o);
  }
  resolveElementProperties(e, n) {
    const o = nt(e, n);
    return (o.initProperties = H(e, o, n, !0)), o;
  }
}
ee.id = "pointAnnotation";
ee.defaults = {
  adjustScaleRange: !0,
  backgroundShadowColor: "transparent",
  borderDash: [],
  borderDashOffset: 0,
  borderShadowColor: "transparent",
  borderWidth: 1,
  display: !0,
  init: void 0,
  pointStyle: "circle",
  radius: 10,
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  xAdjust: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  xValue: void 0,
  yAdjust: 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  yValue: void 0,
  z: 0,
};
ee.defaultRoutes = {
  borderColor: "color",
  backgroundColor: "color",
};
class te extends R {
  inRange(e, n, o, r) {
    if (o !== "x" && o !== "y")
      return this.options.radius >= 0.1 && this.elements.length > 1 && An(this.elements, e, n, r);
    const i = T({ x: e, y: n }, this.getCenterPoint(r), w(-this.options.rotation)),
      s = this.elements.map(l => (o === "y" ? l.bY : l.bX)),
      a = Math.min(...s),
      d = Math.max(...s);
    return i[o] >= a && i[o] <= d;
  }
  getCenterPoint(e) {
    return E(this, e);
  }
  draw(e) {
    const { elements: n, options: o } = this;
    e.save(), e.beginPath(), (e.fillStyle = o.backgroundColor), W(e, o);
    const r = P(e, o);
    let i = !0;
    for (const s of n) i ? (e.moveTo(s.x, s.y), (i = !1)) : e.lineTo(s.x, s.y);
    e.closePath(), e.fill(), r && ((e.shadowColor = o.borderShadowColor), e.stroke()), e.restore();
  }
  resolveElementProperties(e, n) {
    const o = nt(e, n),
      { sides: r, rotation: i } = n,
      s = [],
      a = (2 * b) / r;
    let d = i * Ve;
    for (let l = 0; l < r; l++, d += a) {
      const c = vn(o, n, d);
      (c.initProperties = H(e, o, n)), s.push(c);
    }
    return (o.elements = s), o;
  }
}
te.id = "polygonAnnotation";
te.defaults = {
  adjustScaleRange: !0,
  backgroundShadowColor: "transparent",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: "miter",
  borderShadowColor: "transparent",
  borderWidth: 1,
  display: !0,
  init: void 0,
  point: {
    radius: 0,
  },
  radius: 10,
  rotation: 0,
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  sides: 3,
  xAdjust: 0,
  xMax: void 0,
  xMin: void 0,
  xScaleID: void 0,
  xValue: void 0,
  yAdjust: 0,
  yMax: void 0,
  yMin: void 0,
  yScaleID: void 0,
  yValue: void 0,
  z: 0,
};
te.defaultRoutes = {
  borderColor: "color",
  backgroundColor: "color",
};
function vn({ centerX: t, centerY: e }, { radius: n, borderWidth: o }, r) {
  const i = o / 2,
    s = Math.sin(r),
    a = Math.cos(r),
    d = { x: t + s * n, y: e - a * n };
  return {
    type: "point",
    optionScope: "point",
    properties: {
      x: d.x,
      y: d.y,
      centerX: d.x,
      centerY: d.y,
      bX: t + s * (n + i),
      bY: e - a * (n + i),
    },
  };
}
function An(t, e, n, o) {
  let r = !1,
    i = t[t.length - 1].getProps(["bX", "bY"], o);
  for (const s of t) {
    const a = s.getProps(["bX", "bY"], o);
    a.bY > n != i.bY > n && e < ((i.bX - a.bX) * (n - a.bY)) / (i.bY - a.bY) + a.bX && (r = !r),
      (i = a);
  }
  return r;
}
const C = {
  box: L,
  ellipse: $,
  label: N,
  line: V,
  point: ee,
  polygon: te,
};
Object.keys(C).forEach(t => {
  ut.describe(`elements.${C[t].id}`, {
    _fallback: "plugins.annotation.common",
  });
});
const Dn = {
    update: Object.assign,
  },
  jn = xe.concat(G),
  Ne = (t, e) => (B(e) ? ue(t, e) : t),
  ce = t => t === "color" || t === "font";
function Ce(t = "line") {
  return C[t] ? t : (console.warn(`Unknown annotation type: '${t}', defaulting to 'line'`), "line");
}
function Tn(t, e, n, o) {
  const r = On(t, n.animations, o),
    i = e.annotations,
    s = Wn(e.elements, i);
  for (let a = 0; a < i.length; a++) {
    const d = i[a],
      l = dt(s, a, d.type),
      c = d.setContext(En(t, l, d)),
      u = l.resolveElementProperties(t, c);
    (u.skip = In(u)),
      "elements" in u && (Rn(l, u.elements, c, r), delete u.elements),
      p(l.x) || Object.assign(l, u),
      Object.assign(l, u.initProperties),
      (u.options = lt(c)),
      r.update(l, u);
  }
}
function In(t) {
  return isNaN(t.x) || isNaN(t.y);
}
function On(t, e, n) {
  return n === "reset" || n === "none" || n === "resize" ? Dn : new ct(t, e);
}
function Rn(t, e, n, o) {
  const r = t.elements || (t.elements = []);
  r.length = e.length;
  for (let i = 0; i < e.length; i++) {
    const s = e[i],
      a = s.properties,
      d = dt(r, i, s.type, s.initProperties),
      l = n[s.optionScope].override(s);
    (a.options = lt(l)), o.update(d, a);
  }
}
function dt(t, e, n, o) {
  const r = C[Ce(n)];
  let i = t[e];
  return (!i || !(i instanceof r)) && ((i = t[e] = new r()), Object.assign(i, o)), i;
}
function lt(t) {
  const e = C[Ce(t.type)],
    n = {};
  (n.id = t.id),
    (n.type = t.type),
    (n.drawTime = t.drawTime),
    Object.assign(n, ue(t, e.defaults), ue(t, e.defaultRoutes));
  for (const o of jn) n[o] = t[o];
  return n;
}
function ue(t, e) {
  const n = {};
  for (const o of Object.keys(e)) {
    const r = e[o],
      i = t[o];
    ce(o) && D(i) ? (n[o] = i.map(s => Ne(s, r))) : (n[o] = Ne(i, r));
  }
  return n;
}
function En(t, e, n) {
  return (
    e.$context ||
    (e.$context = Object.assign(Object.create(t.getContext()), {
      element: e,
      id: n.id,
      type: "annotation",
    }))
  );
}
function Wn(t, e) {
  const n = e.length,
    o = t.length;
  if (o < n) {
    const r = n - o;
    t.splice(o, 0, ...new Array(r));
  } else o > n && t.splice(n, o - n);
  return t;
}
var Ln = "2.2.1";
const S = /* @__PURE__ */ new Map(),
  Yn = xe.concat(G);
var Hn = {
  id: "annotation",
  version: Ln,
  beforeRegister() {
    Pt("chart.js", "3.7", oe.version);
  },
  afterRegister() {
    oe.register(C);
  },
  afterUnregister() {
    oe.unregister(C);
  },
  beforeInit(t) {
    S.set(t, {
      annotations: [],
      elements: [],
      visibleElements: [],
      listeners: {},
      listened: !1,
      moveListened: !1,
      hooks: {},
      hooked: !1,
      hovered: [],
    });
  },
  beforeUpdate(t, e, n) {
    const o = S.get(t),
      r = (o.annotations = []);
    let i = n.annotations;
    B(i)
      ? Object.keys(i).forEach(s => {
          const a = i[s];
          B(a) && ((a.id = s), r.push(a));
        })
      : D(i) && r.push(...i),
      Gt(r, t.scales);
  },
  afterDataLimits(t, e) {
    const n = S.get(t);
    Kt(
      t,
      e.scale,
      n.annotations.filter(o => o.display && o.adjustScaleRange)
    );
  },
  afterUpdate(t, e, n) {
    const o = S.get(t);
    Vt(t, o, n),
      Tn(t, o, n, e.mode),
      (o.visibleElements = o.elements.filter(r => !r.skip && r.options.display)),
      qt(t, o, n);
  },
  beforeDatasetsDraw(t, e, n) {
    U(t, "beforeDatasetsDraw", n.clip);
  },
  afterDatasetsDraw(t, e, n) {
    U(t, "afterDatasetsDraw", n.clip);
  },
  beforeDraw(t, e, n) {
    U(t, "beforeDraw", n.clip);
  },
  afterDraw(t, e, n) {
    U(t, "afterDraw", n.clip);
  },
  beforeEvent(t, e, n) {
    const o = S.get(t);
    $t(o, e.event, n) && (e.changed = !0);
  },
  afterDestroy(t) {
    S.delete(t);
  },
  _getState(t) {
    return S.get(t);
  },
  defaults: {
    animations: {
      numbers: {
        properties: [
          "x",
          "y",
          "x2",
          "y2",
          "width",
          "height",
          "centerX",
          "centerY",
          "pointX",
          "pointY",
          "radius",
        ],
        type: "number",
      },
    },
    clip: !0,
    interaction: {
      mode: void 0,
      axis: void 0,
      intersect: void 0,
    },
    common: {
      drawTime: "afterDatasetsDraw",
      init: !1,
      label: {},
    },
  },
  descriptors: {
    _indexable: !1,
    _scriptable: t => !Yn.includes(t) && t !== "init",
    annotations: {
      _allKeys: !1,
      _fallback: (t, e) => `elements.${C[Ce(e.type)].id}`,
    },
    interaction: {
      _fallback: !0,
    },
    common: {
      label: {
        _indexable: ce,
        _fallback: !0,
      },
      _indexable: ce,
    },
  },
  additionalOptionScopes: [""],
};
function U(t, e, n) {
  const { ctx: o, chartArea: r } = t,
    i = S.get(t);
  n && gt(o, r);
  const s = Xn(i.visibleElements, e).sort((a, d) => a.element.options.z - d.element.options.z);
  for (const a of s) zn(o, r, i, a);
  n && mt(o);
}
function Xn(t, e) {
  const n = [];
  for (const o of t)
    if (
      (o.options.drawTime === e && n.push({ element: o, main: !0 }),
      o.elements && o.elements.length)
    )
      for (const r of o.elements)
        r.options.display && r.options.drawTime === e && n.push({ element: r });
  return n;
}
function zn(t, e, n, o) {
  const r = o.element;
  o.main ? (je(n, r, "beforeDraw"), r.draw(t, e), je(n, r, "afterDraw")) : r.draw(t, e);
}
export { Hn as default };
