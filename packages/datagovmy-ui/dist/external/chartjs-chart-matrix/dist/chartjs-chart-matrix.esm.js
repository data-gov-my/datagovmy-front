var k = Object.defineProperty;
var B = (s, t, e) =>
  t in s ? k(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (s[t] = e);
var a = (s, t, e) => (B(s, typeof t != "symbol" ? t + "" : t, e), e);
import { DatasetController as D, Element as _ } from "../../chart.js/dist/chart.js";
import { ax as j, av as c, i as z } from "../../chart.js/dist/chunks/helpers.segment.js";
/*!
 * chartjs-chart-matrix v2.0.1
 * https://chartjs-chart-matrix.pages.dev/
 * (c) 2023 Jukka Kurkela
 * Released under the MIT license
 */
var F = "2.0.1";
class h extends D {
  initialize() {
    (this.enableOptionSharing = !0), super.initialize();
  }
  update(t) {
    const e = this,
      n = e._cachedMeta;
    e.updateElements(n.data, 0, n.data.length, t);
  }
  updateElements(t, e, n, i) {
    const r = this,
      o = i === "reset",
      { xScale: l, yScale: f } = r._cachedMeta,
      P = r.resolveDataElementOptions(e, i),
      x = r.getSharedOptions(i, t[e], P);
    for (let d = e; d < e + n; d++) {
      const g = !o && r.getParsed(d),
        R = o ? l.getBasePixel() : l.getPixelForValue(g.x),
        O = o ? f.getBasePixel() : f.getPixelForValue(g.y),
        b = r.resolveDataElementOptions(d, i),
        { width: m, height: w, anchorX: S, anchorY: C } = b,
        E = {
          x: T(S, R, m),
          y: V(C, O, w),
          width: m,
          height: w,
          options: b,
        };
      r.updateElement(t[d], d, E, i);
    }
    r.updateSharedOptions(x, i);
  }
  draw() {
    const t = this,
      e = t.getMeta().data || [];
    let n, i;
    for (n = 0, i = e.length; n < i; ++n) e[n].draw(t._ctx);
  }
}
a(h, "id", "matrix"),
  a(h, "version", F),
  a(h, "defaults", {
    dataElementType: "matrix",
    animations: {
      numbers: {
        type: "number",
        properties: ["x", "y", "width", "height"],
      },
    },
  }),
  a(h, "overrides", {
    interaction: {
      mode: "nearest",
      intersect: !0,
    },
    scales: {
      x: {
        type: "linear",
        offset: !0,
      },
      y: {
        type: "linear",
        reverse: !0,
      },
    },
  });
function T(s, t, e) {
  return s === "left" || s === "start" ? t : s === "right" || s === "end" ? t - e : t - e / 2;
}
function V(s, t, e) {
  return s === "top" || s === "start" ? t : s === "bottom" || s === "end" ? t - e : t - e / 2;
}
function v(s, t) {
  const { x: e, y: n, width: i, height: r } = s.getProps(["x", "y", "width", "height"], t);
  return { left: e, top: n, right: e + i, bottom: n + r };
}
function u(s, t, e) {
  return Math.max(Math.min(s, e), t);
}
function W(s, t, e) {
  const n = s.options.borderWidth;
  let i, r, o, l;
  return (
    z(n)
      ? ((i = +n.top || 0), (r = +n.right || 0), (o = +n.bottom || 0), (l = +n.left || 0))
      : (i = r = o = l = +n || 0),
    {
      t: u(i, 0, e),
      r: u(r, 0, t),
      b: u(o, 0, e),
      l: u(l, 0, t),
    }
  );
}
function X(s) {
  const t = v(s),
    e = t.right - t.left,
    n = t.bottom - t.top,
    i = W(s, e / 2, n / 2);
  return {
    outer: {
      x: t.left,
      y: t.top,
      w: e,
      h: n,
    },
    inner: {
      x: t.left + i.l,
      y: t.top + i.t,
      w: e - i.l - i.r,
      h: n - i.t - i.b,
    },
  };
}
function p(s, t, e, n) {
  const i = t === null,
    r = e === null,
    o = !s || (i && r) ? !1 : v(s, n);
  return o && (i || (t >= o.left && t <= o.right)) && (r || (e >= o.top && e <= o.bottom));
}
class y extends _ {
  constructor(t) {
    super(),
      (this.options = void 0),
      (this.width = void 0),
      (this.height = void 0),
      t && Object.assign(this, t);
  }
  draw(t) {
    const e = this.options,
      { inner: n, outer: i } = X(this),
      r = j(e.borderRadius);
    t.save(),
      i.w !== n.w || i.h !== n.h
        ? (t.beginPath(),
          c(t, { x: i.x, y: i.y, w: i.w, h: i.h, radius: r }),
          c(t, { x: n.x, y: n.y, w: n.w, h: n.h, radius: r }),
          (t.fillStyle = e.backgroundColor),
          t.fill(),
          (t.fillStyle = e.borderColor),
          t.fill("evenodd"))
        : (t.beginPath(),
          c(t, { x: n.x, y: n.y, w: n.w, h: n.h, radius: r }),
          (t.fillStyle = e.backgroundColor),
          t.fill()),
      t.restore();
  }
  inRange(t, e, n) {
    return p(this, t, e, n);
  }
  inXRange(t, e) {
    return p(this, t, null, e);
  }
  inYRange(t, e) {
    return p(this, null, t, e);
  }
  getCenterPoint(t) {
    const { x: e, y: n, width: i, height: r } = this.getProps(["x", "y", "width", "height"], t);
    return {
      x: e + i / 2,
      y: n + r / 2,
    };
  }
  tooltipPosition() {
    return this.getCenterPoint();
  }
  getRange(t) {
    return t === "x" ? this.width / 2 : this.height / 2;
  }
}
a(y, "id", "matrix"),
  a(y, "defaults", {
    backgroundColor: void 0,
    borderColor: void 0,
    borderWidth: void 0,
    borderRadius: 0,
    anchorX: "center",
    anchorY: "center",
    width: 20,
    height: 20,
  });
export { h as MatrixController, y as MatrixElement };
