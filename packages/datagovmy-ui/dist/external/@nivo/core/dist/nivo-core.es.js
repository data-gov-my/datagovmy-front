import {
  createContext as re,
  useContext as ie,
  useRef as te,
  useState as J,
  useEffect as Ze,
  useMemo as K,
  memo as _,
  useCallback as er,
  createElement as oe,
  cloneElement as rr,
} from "react";
import e from "../../../prop-types/index.js";
import {
  useTooltipHandlers as ir,
  TooltipActionsContext as tr,
  TooltipStateContext as or,
  Tooltip as nr,
} from "../../tooltip/dist/nivo-tooltip.es.js";
import sr from "../../../lodash/merge.js";
import D from "../../../lodash/get.js";
import M from "../../../lodash/set.js";
import { a as ar } from "../../../@react-spring/web/dist/react-spring-web.esm.js";
import lr from "../../../lodash/isString.js";
import { j as d } from "../../../react/jsx-runtime.js";
import s from "../../../lodash/last.js";
import dr from "../../../lodash/isFunction.js";
import ne from "../../../lodash/without.js";
import {
  compose as U,
  setPropTypes as N,
  defaultProps as se,
  withPropsOnChange as ae,
} from "../../recompose/dist/nivo-recompose.es.js";
import le from "../../../lodash/isEqual.js";
import ur from "../../../lodash/isPlainObject.js";
import mr from "../../../lodash/pick.js";
import {
  config as de,
  useSpring as cr,
} from "../../../@react-spring/core/dist/react-spring-core.esm.js";
import { scheme as ue } from "../node_modules/d3-scale-chromatic/src/diverging/BrBG.js";
import { scheme as me } from "../node_modules/d3-scale-chromatic/src/diverging/PRGn.js";
import { scheme as ce } from "../node_modules/d3-scale-chromatic/src/diverging/PiYG.js";
import { scheme as fe } from "../node_modules/d3-scale-chromatic/src/diverging/PuOr.js";
import { scheme as pe } from "../node_modules/d3-scale-chromatic/src/diverging/RdBu.js";
import { scheme as he } from "../node_modules/d3-scale-chromatic/src/diverging/RdGy.js";
import { scheme as ge } from "../node_modules/d3-scale-chromatic/src/diverging/RdYlBu.js";
import { scheme as be } from "../node_modules/d3-scale-chromatic/src/diverging/RdYlGn.js";
import { scheme as ye } from "../node_modules/d3-scale-chromatic/src/diverging/Spectral.js";
import { scheme as Re } from "../node_modules/d3-scale-chromatic/src/sequential-single/Blues.js";
import { scheme as qe } from "../node_modules/d3-scale-chromatic/src/sequential-single/Greens.js";
import { scheme as xe } from "../node_modules/d3-scale-chromatic/src/sequential-single/Greys.js";
import { scheme as ve } from "../node_modules/d3-scale-chromatic/src/sequential-single/Oranges.js";
import { scheme as ke } from "../node_modules/d3-scale-chromatic/src/sequential-single/Purples.js";
import { scheme as Oe } from "../node_modules/d3-scale-chromatic/src/sequential-single/Reds.js";
import { scheme as we } from "../node_modules/d3-scale-chromatic/src/sequential-multi/BuGn.js";
import { scheme as Te } from "../node_modules/d3-scale-chromatic/src/sequential-multi/BuPu.js";
import { scheme as je } from "../node_modules/d3-scale-chromatic/src/sequential-multi/GnBu.js";
import { scheme as Ce } from "../node_modules/d3-scale-chromatic/src/sequential-multi/OrRd.js";
import { scheme as Pe } from "../node_modules/d3-scale-chromatic/src/sequential-multi/PuBuGn.js";
import { scheme as We } from "../node_modules/d3-scale-chromatic/src/sequential-multi/PuBu.js";
import { scheme as Se } from "../node_modules/d3-scale-chromatic/src/sequential-multi/PuRd.js";
import { scheme as ze } from "../node_modules/d3-scale-chromatic/src/sequential-multi/RdPu.js";
import { scheme as $e } from "../node_modules/d3-scale-chromatic/src/sequential-multi/YlGnBu.js";
import { scheme as _e } from "../node_modules/d3-scale-chromatic/src/sequential-multi/YlGn.js";
import { scheme as Me } from "../node_modules/d3-scale-chromatic/src/sequential-multi/YlOrBr.js";
import { scheme as De } from "../node_modules/d3-scale-chromatic/src/sequential-multi/YlOrRd.js";
import fr from "../node_modules/d3-scale-chromatic/src/categorical/category10.js";
import pr from "../node_modules/d3-scale-chromatic/src/categorical/Accent.js";
import hr from "../node_modules/d3-scale-chromatic/src/categorical/Dark2.js";
import gr from "../node_modules/d3-scale-chromatic/src/categorical/Paired.js";
import br from "../node_modules/d3-scale-chromatic/src/categorical/Pastel1.js";
import yr from "../node_modules/d3-scale-chromatic/src/categorical/Pastel2.js";
import Rr from "../node_modules/d3-scale-chromatic/src/categorical/Set1.js";
import qr from "../node_modules/d3-scale-chromatic/src/categorical/Set2.js";
import Le from "../node_modules/d3-scale-chromatic/src/categorical/Set3.js";
import xr from "../../../d3-scale/src/ordinal.js";
import { timeFormat as vr } from "../../../d3-time-format/src/defaultLocale.js";
import { format as kr } from "../../../d3-format/src/defaultLocale.js";
import Or from "../../../d3-shape/src/curve/basis.js";
import wr from "../../../d3-shape/src/curve/basisClosed.js";
import Tr from "../../../d3-shape/src/curve/basisOpen.js";
import jr from "../../../d3-shape/src/curve/bundle.js";
import Cr from "../../../d3-shape/src/curve/cardinal.js";
import Pr from "../../../d3-shape/src/curve/cardinalClosed.js";
import Wr from "../../../d3-shape/src/curve/cardinalOpen.js";
import Sr from "../../../d3-shape/src/curve/catmullRom.js";
import zr from "../../../d3-shape/src/curve/catmullRomClosed.js";
import $r from "../../../d3-shape/src/curve/catmullRomOpen.js";
import _r from "../../../d3-shape/src/curve/linear.js";
import Mr from "../../../d3-shape/src/curve/linearClosed.js";
import { monotoneX as Dr, monotoneY as Lr } from "../../../d3-shape/src/curve/monotone.js";
import Yr from "../../../d3-shape/src/curve/natural.js";
import Br, { stepAfter as Gr, stepBefore as Fr } from "../../../d3-shape/src/curve/step.js";
import Er from "../../../d3-shape/src/order/ascending.js";
import Kr from "../../../d3-shape/src/order/descending.js";
import Ar from "../../../d3-shape/src/order/insideOut.js";
import Ir from "../../../d3-shape/src/order/none.js";
import Xr from "../../../d3-shape/src/order/reverse.js";
import Ur from "../../../d3-shape/src/offset/expand.js";
import Nr from "../../../d3-shape/src/offset/diverging.js";
import Vr from "../../../d3-shape/src/offset/none.js";
import Hr from "../../../d3-shape/src/offset/silhouette.js";
import Jr from "../../../d3-shape/src/offset/wiggle.js";
function q() {
  return (
    (q =
      Object.assign ||
      function (r) {
        for (var i = 1; i < arguments.length; i++) {
          var t = arguments[i];
          for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (r[n] = t[n]);
        }
        return r;
      }),
    q.apply(this, arguments)
  );
}
function Ye(r, i) {
  if (r == null) return {};
  var t,
    n,
    o = {},
    a = Object.keys(r);
  for (n = 0; n < a.length; n++) (t = a[n]), i.indexOf(t) >= 0 || (o[t] = r[t]);
  return o;
}
var $ = { fill: e.string, fontSize: e.number, fontFamily: e.string },
  Qr = e.shape({
    domain: e.shape({
      line: e.shape({
        stroke: e.string.isRequired,
        strokeWidth: e.number.isRequired,
        strokeDasharray: e.string,
      }).isRequired,
    }).isRequired,
    ticks: e.shape({
      line: e.shape({
        stroke: e.string.isRequired,
        strokeWidth: e.number.isRequired,
        strokeDasharray: e.string,
      }).isRequired,
      text: e.shape(q({}, $)).isRequired,
    }).isRequired,
    legend: e.shape({ text: e.shape(q({}, $)).isRequired }).isRequired,
  }),
  Zr = e.shape({
    line: e.shape({
      stroke: e.string.isRequired,
      strokeWidth: e.number.isRequired,
      strokeDasharray: e.string,
    }).isRequired,
  }),
  ei = e.shape({
    hidden: e.shape({
      symbol: e.shape({ fill: e.string.isRequired, opacity: e.number }).isRequired,
      text: e.shape(q({}, $, { opacity: e.number })).isRequired,
    }).isRequired,
    text: e.shape(q({}, $)).isRequired,
  }),
  ri = e.shape({ text: e.shape(q({}, $)).isRequired }),
  ii = e.shape({ text: e.shape(q({}, $)).isRequired }),
  ti = e.shape({ text: e.shape(q({}, $)).isRequired }),
  oi = e.shape({
    line: e.shape({
      stroke: e.string.isRequired,
      strokeWidth: e.number.isRequired,
      strokeDasharray: e.string,
    }).isRequired,
  }),
  ni = e.shape({
    text: e.shape(
      q({}, $, { outlineWidth: e.number.isRequired, outlineColor: e.string.isRequired })
    ).isRequired,
    link: e.shape({
      stroke: e.string.isRequired,
      strokeWidth: e.number.isRequired,
      outlineWidth: e.number.isRequired,
      outlineColor: e.string.isRequired,
    }).isRequired,
    outline: e.shape({
      stroke: e.string.isRequired,
      strokeWidth: e.number.isRequired,
      outlineWidth: e.number.isRequired,
      outlineColor: e.string.isRequired,
    }).isRequired,
    symbol: e.shape({
      fill: e.string.isRequired,
      outlineWidth: e.number.isRequired,
      outlineColor: e.string.isRequired,
    }).isRequired,
  });
e.shape({
  background: e.string.isRequired,
  fontFamily: e.string.isRequired,
  fontSize: e.number.isRequired,
  textColor: e.string.isRequired,
  axis: Qr.isRequired,
  grid: Zr.isRequired,
  legends: ei.isRequired,
  labels: ri.isRequired,
  dots: ii.isRequired,
  markers: ti,
  crosshair: oi.isRequired,
  annotations: ni.isRequired,
});
var Be = {
    background: "transparent",
    fontFamily: "sans-serif",
    fontSize: 11,
    textColor: "#333333",
    axis: {
      domain: { line: { stroke: "transparent", strokeWidth: 1 } },
      ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: {} },
      legend: { text: { fontSize: 12 } },
    },
    grid: { line: { stroke: "#dddddd", strokeWidth: 1 } },
    legends: {
      hidden: {
        symbol: { fill: "#333333", opacity: 0.6 },
        text: { fill: "#333333", opacity: 0.6 },
      },
      text: {},
      ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: { fontSize: 10 } },
      title: { text: {} },
    },
    labels: { text: {} },
    markers: { lineColor: "#000000", lineStrokeWidth: 1, text: {} },
    dots: { text: {} },
    tooltip: {
      container: {
        background: "white",
        color: "inherit",
        fontSize: "inherit",
        borderRadius: "2px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
        padding: "5px 9px",
      },
      basic: { whiteSpace: "pre", display: "flex", alignItems: "center" },
      chip: { marginRight: 7 },
      table: {},
      tableCell: { padding: "3px 5px" },
      tableCellValue: { fontWeight: "bold" },
    },
    crosshair: {
      line: { stroke: "#000000", strokeWidth: 1, strokeOpacity: 0.75, strokeDasharray: "6 6" },
    },
    annotations: {
      text: { fontSize: 13, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 },
      link: {
        stroke: "#000000",
        strokeWidth: 1,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      outline: {
        fill: "none",
        stroke: "#000000",
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: "#ffffff",
        outlineOpacity: 1,
      },
      symbol: { fill: "#000000", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 },
    },
  },
  si = [
    "axis.ticks.text",
    "axis.legend.text",
    "legends.title.text",
    "legends.text",
    "legends.ticks.text",
    "legends.title.text",
    "labels.text",
    "dots.text",
    "markers.text",
    "annotations.text",
  ],
  Ge = function (r, i) {
    var t = sr({}, r, i);
    return (
      si.forEach(function (n) {
        D(t, n + ".fontFamily") === void 0 && M(t, n + ".fontFamily", t.fontFamily),
          D(t, n + ".fontSize") === void 0 && M(t, n + ".fontSize", t.fontSize),
          D(t, n + ".fill") === void 0 && M(t, n + ".fill", t.textColor);
      }),
      t
    );
  },
  Fe = re(),
  V = function (r) {
    var i = r.children,
      t = r.animate,
      n = r.stiffness,
      o = r.damping,
      a = r.config,
      c = K(
        function () {
          var l = lr(a) ? de[a] : a;
          return { animate: t, springConfig: { stiffness: n, damping: o }, config: l };
        },
        [t, n, o, a]
      );
    return d.jsx(Fe.Provider, { value: c, children: i });
  },
  Y = {
    animate: e.bool,
    motionStiffness: e.number,
    motionDamping: e.number,
    motionConfig: e.oneOfType([
      e.oneOf(Object.keys(de)),
      e.shape({
        mass: e.number,
        tension: e.number,
        friction: e.number,
        clamp: e.bool,
        precision: e.number,
        velocity: e.number,
        duration: e.number,
        easing: e.func,
      }),
    ]),
  };
V.propTypes = {
  children: e.node.isRequired,
  animate: Y.animate,
  stiffness: Y.motionStiffness,
  damping: Y.motionDamping,
  config: Y.motionConfig,
};
var ai = { animate: !0, stiffness: 90, damping: 15, config: "default" };
V.defaultProps = ai;
var li = function () {
    return ie(Fe);
  },
  di = {
    nivo: ["#d76445", "#f47560", "#e8c1a0", "#97e3d5", "#61cdbb", "#00b0a7"],
    BrBG: s(ue),
    PRGn: s(me),
    PiYG: s(ce),
    PuOr: s(fe),
    RdBu: s(pe),
    RdGy: s(he),
    RdYlBu: s(ge),
    RdYlGn: s(be),
    spectral: s(ye),
    blues: s(Re),
    greens: s(qe),
    greys: s(xe),
    oranges: s(ve),
    purples: s(ke),
    reds: s(Oe),
    BuGn: s(we),
    BuPu: s(Te),
    GnBu: s(je),
    OrRd: s(Ce),
    PuBuGn: s(Pe),
    PuBu: s(We),
    PuRd: s(Se),
    RdPu: s(ze),
    YlGnBu: s($e),
    YlGn: s(_e),
    YlOrBr: s(Me),
    YlOrRd: s(De),
  },
  ui = Object.keys(di);
fr,
  pr,
  hr,
  gr,
  br,
  yr,
  Rr,
  qr,
  Le,
  s(ue),
  s(me),
  s(ce),
  s(fe),
  s(pe),
  s(he),
  s(ge),
  s(be),
  s(ye),
  s(Re),
  s(qe),
  s(xe),
  s(ve),
  s(ke),
  s(Oe),
  s(we),
  s(Te),
  s(je),
  s(Ce),
  s(Pe),
  s(We),
  s(Se),
  s(ze),
  s($e),
  s(_e),
  s(Me),
  s(De);
e.oneOfType([e.oneOf(ui), e.func, e.arrayOf(e.string)]);
var mi = {
    basis: Or,
    basisClosed: wr,
    basisOpen: Tr,
    bundle: jr,
    cardinal: Cr,
    cardinalClosed: Pr,
    cardinalOpen: Wr,
    catmullRom: Sr,
    catmullRomClosed: zr,
    catmullRomOpen: $r,
    linear: _r,
    linearClosed: Mr,
    monotoneX: Dr,
    monotoneY: Lr,
    natural: Yr,
    step: Br,
    stepAfter: Gr,
    stepBefore: Fr,
  },
  A = Object.keys(mi);
e.oneOf(A);
A.filter(function (r) {
  return r.endsWith("Closed");
});
ne(
  A,
  "bundle",
  "basisClosed",
  "basisOpen",
  "cardinalClosed",
  "cardinalOpen",
  "catmullRomClosed",
  "catmullRomOpen",
  "linearClosed"
);
var ci = ne(
  A,
  "bundle",
  "basisClosed",
  "basisOpen",
  "cardinalClosed",
  "cardinalOpen",
  "catmullRomClosed",
  "catmullRomOpen",
  "linearClosed"
);
e.oneOf(ci);
var lo = {
    defs: e.arrayOf(e.shape({ id: e.string.isRequired })).isRequired,
    fill: e.arrayOf(
      e.shape({
        id: e.string.isRequired,
        match: e.oneOfType([e.oneOf(["*"]), e.object, e.func]).isRequired,
      })
    ).isRequired,
  },
  fi = { ascending: Er, descending: Kr, insideOut: Ar, none: Ir, reverse: Xr },
  pi = Object.keys(fi);
e.oneOf(pi);
var hi = { expand: Ur, diverging: Nr, none: Vr, silhouette: Hr, wiggle: Jr },
  gi = Object.keys(hi);
e.oneOf(gi);
var bi = e.shape({ top: e.number, right: e.number, bottom: e.number, left: e.number }).isRequired,
  yi = [
    "normal",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity",
  ];
e.oneOf(yi);
xr(Le);
var Q = { top: 0, right: 0, bottom: 0, left: 0 },
  Ri = function () {
    var r = te(null),
      i = J({ left: 0, top: 0, width: 0, height: 0 }),
      t = i[0],
      n = i[1],
      o = J(function () {
        return new ResizeObserver(function (a) {
          var c = a[0];
          return n(c.contentRect);
        });
      })[0];
    return (
      Ze(function () {
        return (
          r.current && o.observe(r.current),
          function () {
            return o.disconnect();
          }
        );
      }, []),
      [r, t]
    );
  },
  qi = function (r) {
    return K(
      function () {
        return Ge(Be, r);
      },
      [r]
    );
  },
  xi = function (r) {
    return typeof r == "function"
      ? r
      : typeof r == "string"
      ? r.indexOf("time:") === 0
        ? vr(r.slice("5"))
        : kr(r)
      : function (i) {
          return "" + i;
        };
  },
  uo = function (r) {
    return K(
      function () {
        return xi(r);
      },
      [r]
    );
  },
  Ee = re(),
  vi = {},
  Ke = function (r) {
    var i = r.theme,
      t = i === void 0 ? vi : i,
      n = r.children,
      o = qi(t);
    return d.jsx(Ee.Provider, { value: o, children: n });
  };
Ke.propTypes = { children: e.node.isRequired, theme: e.object };
var H = function () {
    return ie(Ee);
  },
  Ae = function (r) {
    var i = r.children,
      t = r.condition,
      n = r.wrapper;
    return t ? rr(n, {}, i) : i;
  };
Ae.propTypes = {
  children: e.node.isRequired,
  condition: e.bool.isRequired,
  wrapper: e.element.isRequired,
};
e.element.isRequired, e.bool, e.bool, e.object, e.bool, e.number, e.number, e.string;
var Z = function () {},
  ki = { position: "relative" },
  Oi = function (r) {
    var i = r.children,
      t = r.theme,
      n = r.isInteractive,
      o = n === void 0 || n,
      a = r.renderWrapper,
      c = a === void 0 || a,
      l = r.animate,
      f = r.motionStiffness,
      h = r.motionDamping,
      u = r.motionConfig,
      m = te(null),
      k = ir(m),
      w = k.actions,
      C = k.state,
      W = er(
        function (T, S) {
          return w.showTooltipFromEvent(T, S);
        },
        [w.showTooltipFromEvent]
      ),
      P = K(
        function () {
          return { showTooltip: o ? W : Z, hideTooltip: o ? w.hideTooltip : Z };
        },
        [w.hideTooltip, o, W]
      );
    return d.jsx(Ke, {
      theme: t,
      children: d.jsx(V, {
        animate: l,
        stiffness: f,
        damping: h,
        config: u,
        children: d.jsx(tr.Provider, {
          value: w,
          children: d.jsx(or.Provider, {
            value: C,
            children: d.jsxs(Ae, {
              condition: c,
              wrapper: d.jsx("div", { style: ki, ref: m }),
              children: [i(P), o && d.jsx(nr, {})],
            }),
          }),
        }),
      }),
    });
  };
Oi.propTypes = {
  children: e.func.isRequired,
  isInteractive: e.bool,
  renderWrapper: e.bool,
  theme: e.object.isRequired,
  animate: e.bool.isRequired,
  motionStiffness: e.number,
  motionDamping: e.number,
  motionConfig: e.string,
};
var wi = function (r) {
  var i = r.children,
    t = Ri(),
    n = t[0],
    o = t[1],
    a = o.width > 0 && o.height > 0;
  return d.jsx("div", {
    ref: n,
    style: { width: "100%", height: "100%" },
    children: a && i({ width: o.width, height: o.height }),
  });
};
wi.propTypes = { children: e.func.isRequired };
var Ti = ["id", "colors"],
  Ie = function (r) {
    var i = r.id,
      t = r.colors,
      n = Ye(r, Ti);
    return d.jsx(
      "linearGradient",
      q({ id: i, x1: 0, x2: 0, y1: 0, y2: 1 }, n, {
        children: t.map(function (o) {
          var a = o.offset,
            c = o.color,
            l = o.opacity;
          return d.jsx(
            "stop",
            { offset: a + "%", stopColor: c, stopOpacity: l !== void 0 ? l : 1 },
            a
          );
        }),
      })
    );
  };
Ie.propTypes = {
  id: e.string.isRequired,
  colors: e.arrayOf(
    e.shape({ offset: e.number.isRequired, color: e.string.isRequired, opacity: e.number })
  ).isRequired,
  gradientTransform: e.string,
};
var Xe = { linearGradient: Ie },
  G = _(function (r) {
    var i = r.id,
      t = r.background,
      n = r.color,
      o = r.size,
      a = r.padding,
      c = r.stagger,
      l = o + a,
      f = o / 2,
      h = a / 2;
    return (
      c === !0 && (l = 2 * o + 2 * a),
      d.jsxs("pattern", {
        id: i,
        width: l,
        height: l,
        patternUnits: "userSpaceOnUse",
        children: [
          d.jsx("rect", { width: l, height: l, fill: t }),
          d.jsx("circle", { cx: h + f, cy: h + f, r: f, fill: n }),
          c && d.jsx("circle", { cx: 1.5 * a + o + f, cy: 1.5 * a + o + f, r: f, fill: n }),
        ],
      })
    );
  });
(G.displayName = "PatternDots"),
  (G.propTypes = {
    id: e.string.isRequired,
    color: e.string.isRequired,
    background: e.string.isRequired,
    size: e.number.isRequired,
    padding: e.number.isRequired,
    stagger: e.bool.isRequired,
  }),
  (G.defaultProps = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: !1 });
var ee = function (r) {
    return (r * Math.PI) / 180;
  },
  F = _(function (r) {
    var i = r.id,
      t = r.spacing,
      n = r.rotation,
      o = r.background,
      a = r.color,
      c = r.lineWidth,
      l = Math.round(n) % 360,
      f = Math.abs(t);
    l > 180 ? (l -= 360) : l > 90 ? (l -= 180) : l < -180 ? (l += 360) : l < -90 && (l += 180);
    var h,
      u = f,
      m = f;
    return (
      l === 0
        ? (h =
            `
                M 0 0 L ` +
            u +
            ` 0
                M 0 ` +
            m +
            " L " +
            u +
            " " +
            m +
            `
            `)
        : l === 90
        ? (h =
            `
                M 0 0 L 0 ` +
            m +
            `
                M ` +
            u +
            " 0 L " +
            u +
            " " +
            m +
            `
            `)
        : ((u = Math.abs(f / Math.sin(ee(l)))),
          (m = f / Math.sin(ee(90 - l))),
          (h =
            l > 0
              ? `
                    M 0 ` +
                -m +
                " L " +
                2 * u +
                " " +
                m +
                `
                    M ` +
                -u +
                " " +
                -m +
                " L " +
                u +
                " " +
                m +
                `
                    M ` +
                -u +
                " 0 L " +
                u +
                " " +
                2 * m +
                `
                `
              : `
                    M ` +
                -u +
                " " +
                m +
                " L " +
                u +
                " " +
                -m +
                `
                    M ` +
                -u +
                " " +
                2 * m +
                " L " +
                2 * u +
                " " +
                -m +
                `
                    M 0 ` +
                2 * m +
                " L " +
                2 * u +
                ` 0
                `)),
      d.jsxs("pattern", {
        id: i,
        width: u,
        height: m,
        patternUnits: "userSpaceOnUse",
        children: [
          d.jsx("rect", {
            width: u,
            height: m,
            fill: o,
            stroke: "rgba(255, 0, 0, 0.1)",
            strokeWidth: 0,
          }),
          d.jsx("path", { d: h, strokeWidth: c, stroke: a, strokeLinecap: "square" }),
        ],
      })
    );
  });
(F.displayName = "PatternLines"),
  (F.propTypes = {
    id: e.string.isRequired,
    spacing: e.number.isRequired,
    rotation: e.number.isRequired,
    background: e.string.isRequired,
    color: e.string.isRequired,
    lineWidth: e.number.isRequired,
  }),
  (F.defaultProps = {
    spacing: 5,
    rotation: 0,
    color: "#000000",
    background: "#ffffff",
    lineWidth: 2,
  });
var E = _(function (r) {
  var i = r.id,
    t = r.background,
    n = r.color,
    o = r.size,
    a = r.padding,
    c = r.stagger,
    l = o + a,
    f = a / 2;
  return (
    c === !0 && (l = 2 * o + 2 * a),
    d.jsxs("pattern", {
      id: i,
      width: l,
      height: l,
      patternUnits: "userSpaceOnUse",
      children: [
        d.jsx("rect", { width: l, height: l, fill: t }),
        d.jsx("rect", { x: f, y: f, width: o, height: o, fill: n }),
        c && d.jsx("rect", { x: 1.5 * a + o, y: 1.5 * a + o, width: o, height: o, fill: n }),
      ],
    })
  );
});
(E.displayName = "PatternSquares"),
  (E.propTypes = {
    id: e.string.isRequired,
    color: e.string.isRequired,
    background: e.string.isRequired,
    size: e.number.isRequired,
    padding: e.number.isRequired,
    stagger: e.bool.isRequired,
  }),
  (E.defaultProps = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: !1 });
var Ue = { patternDots: G, patternLines: F, patternSquares: E },
  ji = ["type"],
  I = q({}, Xe, Ue),
  Ne = function (r) {
    var i = r.defs;
    return !i || i.length < 1
      ? null
      : d.jsx("defs", {
          "aria-hidden": !0,
          "children": i.map(function (t) {
            var n = t.type,
              o = Ye(t, ji);
            return I[n] ? oe(I[n], q({ key: o.id }, o)) : null;
          }),
        });
  };
Ne.propTypes = {
  defs: e.arrayOf(e.shape({ type: e.oneOf(Object.keys(I)).isRequired, id: e.string.isRequired })),
};
var Ci = _(Ne),
  Pi = function (r) {
    var i = r.width,
      t = r.height,
      n = r.margin,
      o = r.defs,
      a = r.children,
      c = r.role,
      l = r.ariaLabel,
      f = r.ariaLabelledBy,
      h = r.ariaDescribedBy,
      u = r.isFocusable,
      m = H();
    return d.jsxs("svg", {
      "xmlns": "http://www.w3.org/2000/svg",
      "width": i,
      "height": t,
      "role": c,
      "aria-label": l,
      "aria-labelledby": f,
      "aria-describedby": h,
      "focusable": u,
      "tabIndex": u ? 0 : void 0,
      "children": [
        d.jsx(Ci, { defs: o }),
        d.jsx("rect", { width: i, height: t, fill: m.background }),
        d.jsx("g", { transform: "translate(" + n.left + "," + n.top + ")", children: a }),
      ],
    });
  };
Pi.propTypes = {
  width: e.number.isRequired,
  height: e.number.isRequired,
  margin: e.shape({ top: e.number.isRequired, left: e.number.isRequired }).isRequired,
  defs: e.array,
  children: e.oneOfType([e.arrayOf(e.node), e.node]).isRequired,
  role: e.string,
  isFocusable: e.bool,
  ariaLabel: e.string,
  ariaLabelledBy: e.string,
  ariaDescribedBy: e.string,
};
var Ve = function (r) {
  var i = r.size,
    t = r.color,
    n = r.borderWidth,
    o = r.borderColor;
  return d.jsx("circle", {
    r: i / 2,
    fill: t,
    stroke: o,
    strokeWidth: n,
    style: { pointerEvents: "none" },
  });
};
Ve.propTypes = {
  size: e.number.isRequired,
  color: e.string.isRequired,
  borderWidth: e.number.isRequired,
  borderColor: e.string.isRequired,
};
var Wi = _(Ve),
  He = function (r) {
    var i = r.x,
      t = r.y,
      n = r.symbol,
      o = n === void 0 ? Wi : n,
      a = r.size,
      c = r.datum,
      l = r.color,
      f = r.borderWidth,
      h = r.borderColor,
      u = r.label,
      m = r.labelTextAnchor,
      k = m === void 0 ? "middle" : m,
      w = r.labelYOffset,
      C = w === void 0 ? -12 : w,
      W = H(),
      P = li(),
      T = P.animate,
      S = P.config,
      g = cr({ transform: "translate(" + i + ", " + t + ")", config: S, immediate: !T });
    return d.jsxs(ar.g, {
      transform: g.transform,
      style: { pointerEvents: "none" },
      children: [
        oe(o, { size: a, color: l, datum: c, borderWidth: f, borderColor: h }),
        u && d.jsx("text", { textAnchor: k, y: C, style: W.dots.text, children: u }),
      ],
    });
  };
He.propTypes = {
  x: e.number.isRequired,
  y: e.number.isRequired,
  datum: e.object.isRequired,
  size: e.number.isRequired,
  color: e.string.isRequired,
  borderWidth: e.number.isRequired,
  borderColor: e.string.isRequired,
  symbol: e.oneOfType([e.func, e.object]),
  label: e.oneOfType([e.string, e.number]),
  labelTextAnchor: e.oneOf(["start", "middle", "end"]),
  labelYOffset: e.number.isRequired,
};
_(He);
var X = function (r) {
  var i = r.width,
    t = r.height,
    n = r.axis,
    o = r.scale,
    a = r.value,
    c = r.lineStyle,
    l = r.textStyle,
    f = r.legend,
    h = r.legendPosition,
    u = r.legendOffsetX,
    m = r.legendOffsetY,
    k = r.legendOrientation,
    w = H(),
    C = 0,
    W = 0,
    P = 0,
    T = 0;
  n === "y" ? ((P = o(a)), (W = i)) : ((C = o(a)), (T = t));
  var S = null;
  if (f) {
    var g = (function (j) {
      var B = j.axis,
        z = j.width,
        O = j.height,
        L = j.position,
        b = j.offsetX,
        x = j.offsetY,
        p = j.orientation,
        y = 0,
        v = 0,
        Qe = p === "vertical" ? -90 : 0,
        R = "start";
      if (B === "x")
        switch (L) {
          case "top-left":
            (y = -b), (v = x), (R = "end");
            break;
          case "top":
            (v = -x), (R = p === "horizontal" ? "middle" : "start");
            break;
          case "top-right":
            (y = b), (v = x), (R = p === "horizontal" ? "start" : "end");
            break;
          case "right":
            (y = b), (v = O / 2), (R = p === "horizontal" ? "start" : "middle");
            break;
          case "bottom-right":
            (y = b), (v = O - x), (R = "start");
            break;
          case "bottom":
            (v = O + x), (R = p === "horizontal" ? "middle" : "end");
            break;
          case "bottom-left":
            (v = O - x), (y = -b), (R = p === "horizontal" ? "end" : "start");
            break;
          case "left":
            (y = -b), (v = O / 2), (R = p === "horizontal" ? "end" : "middle");
        }
      else
        switch (L) {
          case "top-left":
            (y = b), (v = -x), (R = "start");
            break;
          case "top":
            (y = z / 2), (v = -x), (R = p === "horizontal" ? "middle" : "start");
            break;
          case "top-right":
            (y = z - b), (v = -x), (R = p === "horizontal" ? "end" : "start");
            break;
          case "right":
            (y = z + b), (R = p === "horizontal" ? "start" : "middle");
            break;
          case "bottom-right":
            (y = z - b), (v = x), (R = "end");
            break;
          case "bottom":
            (y = z / 2), (v = x), (R = p === "horizontal" ? "middle" : "end");
            break;
          case "bottom-left":
            (y = b), (v = x), (R = p === "horizontal" ? "start" : "end");
            break;
          case "left":
            (y = -b), (R = p === "horizontal" ? "end" : "middle");
        }
      return { x: y, y: v, rotation: Qe, textAnchor: R };
    })({ axis: n, width: i, height: t, position: h, offsetX: u, offsetY: m, orientation: k });
    S = d.jsx("text", {
      transform: "translate(" + g.x + ", " + g.y + ") rotate(" + g.rotation + ")",
      textAnchor: g.textAnchor,
      dominantBaseline: "central",
      style: l,
      children: f,
    });
  }
  return d.jsxs("g", {
    transform: "translate(" + C + ", " + P + ")",
    children: [
      d.jsx("line", {
        x1: 0,
        x2: W,
        y1: 0,
        y2: T,
        stroke: w.markers.lineColor,
        strokeWidth: w.markers.lineStrokeWidth,
        style: c,
      }),
      S,
    ],
  });
};
(X.propTypes = {
  width: e.number.isRequired,
  height: e.number.isRequired,
  axis: e.oneOf(["x", "y"]).isRequired,
  scale: e.func.isRequired,
  value: e.oneOfType([e.number, e.string, e.instanceOf(Date)]).isRequired,
  lineStyle: e.object,
  textStyle: e.object,
  legend: e.string,
  legendPosition: e.oneOf([
    "top-left",
    "top",
    "top-right",
    "right",
    "bottom-right",
    "bottom",
    "bottom-left",
    "left",
  ]),
  legendOffsetX: e.number.isRequired,
  legendOffsetY: e.number.isRequired,
  legendOrientation: e.oneOf(["horizontal", "vertical"]).isRequired,
}),
  (X.defaultProps = {
    legendPosition: "top-right",
    legendOffsetX: 14,
    legendOffsetY: 14,
    legendOrientation: "horizontal",
  });
var Si = _(X),
  Je = function (r) {
    var i = r.markers,
      t = r.width,
      n = r.height,
      o = r.xScale,
      a = r.yScale;
    return i && i.length !== 0
      ? i.map(function (c, l) {
          return d.jsx(Si, q({}, c, { width: t, height: n, scale: c.axis === "y" ? a : o }), l);
        })
      : null;
  };
Je.propTypes = {
  width: e.number.isRequired,
  height: e.number.isRequired,
  xScale: e.func.isRequired,
  yScale: e.func.isRequired,
  markers: e.arrayOf(
    e.shape({
      axis: e.oneOf(["x", "y"]).isRequired,
      value: e.oneOfType([e.number, e.string, e.instanceOf(Date)]).isRequired,
      lineStyle: e.object,
      textStyle: e.object,
    })
  ),
};
_(Je);
var mo = function () {
    return U(
      se({ margin: Q }),
      N({ width: e.number.isRequired, height: e.number.isRequired, margin: bi }),
      ae(
        function (r, i) {
          return r.width !== i.width || r.height !== i.height || !le(r.margin, i.margin);
        },
        function (r) {
          var i = Object.assign({}, Q, r.margin);
          return {
            margin: i,
            width: r.width - i.left - i.right,
            height: r.height - i.top - i.bottom,
            outerWidth: r.width,
            outerHeight: r.height,
          };
        }
      )
    );
  },
  co = function () {
    return U(N(Y), se({ animate: !0, motionDamping: 15, motionStiffness: 90 }));
  },
  fo = function (r) {
    var i,
      t = r === void 0 ? {} : r,
      n = t.srcKey,
      o = n === void 0 ? "theme" : n,
      a = t.destKey,
      c = a === void 0 ? "theme" : a;
    return U(
      N((((i = {})[o] = e.object), i)),
      ae([o], function (l) {
        var f;
        return ((f = {})[c] = Ge(Be, l[o])), f;
      })
    );
  },
  po = function (r, i, t, n, o, a) {
    return r <= o && o <= r + t && i <= a && a <= i + n;
  },
  ho = function (r, i) {
    var t = i.clientX,
      n = i.clientY,
      o = r.getBoundingClientRect();
    return [t - o.left, n - o.top];
  },
  zi = Object.keys(Xe),
  $i = Object.keys(Ue),
  _i = function (r, i, t) {
    if (r === "*") return !0;
    if (dr(r)) return r(i);
    if (ur(r)) {
      var n = t ? D(i, t) : i;
      return le(mr(n, Object.keys(r)), r);
    }
    return !1;
  },
  go = function (r, i, t, n) {
    var o = n === void 0 ? {} : n,
      a = o.dataKey,
      c = o.colorKey,
      l = c === void 0 ? "color" : c,
      f = o.targetKey,
      h = f === void 0 ? "fill" : f,
      u = [],
      m = {};
    return (
      r.length &&
        i.length &&
        ((u = [].concat(r)),
        i.forEach(function (k) {
          for (
            var w = function (W) {
                var P = t[W],
                  T = P.id,
                  S = P.match;
                if (_i(S, k, a)) {
                  var g = r.find(function (p) {
                    return p.id === T;
                  });
                  if (g) {
                    if ($i.includes(g.type))
                      if (g.background === "inherit" || g.color === "inherit") {
                        var j = D(k, l),
                          B = g.background,
                          z = g.color,
                          O = T;
                        g.background === "inherit" && ((O = O + ".bg." + j), (B = j)),
                          g.color === "inherit" && ((O = O + ".fg." + j), (z = j)),
                          M(k, h, "url(#" + O + ")"),
                          m[O] ||
                            (u.push(q({}, g, { id: O, background: B, color: z })), (m[O] = 1));
                      } else M(k, h, "url(#" + T + ")");
                    else if (zi.includes(g.type))
                      if (
                        g.colors
                          .map(function (p) {
                            return p.color;
                          })
                          .includes("inherit")
                      ) {
                        var L = D(k, l),
                          b = T,
                          x = q({}, g, {
                            colors: g.colors.map(function (p, y) {
                              return p.color !== "inherit"
                                ? p
                                : ((b = b + "." + y + "." + L),
                                  q({}, p, { color: p.color === "inherit" ? L : p.color }));
                            }),
                          });
                        (x.id = b), M(k, h, "url(#" + b + ")"), m[b] || (u.push(x), (m[b] = 1));
                      } else M(k, h, "url(#" + T + ")");
                  }
                  return "break";
                }
              },
              C = 0;
            C < t.length && w(C) !== "break";
            C++
          );
        })),
      u
    );
  };
export {
  Si as CartesianMarkersItem,
  Ci as Defs,
  Oi as LegacyContainer,
  Ie as LinearGradient,
  V as MotionConfigProvider,
  G as PatternDots,
  F as PatternLines,
  E as PatternSquares,
  wi as ResponsiveWrapper,
  Pi as SvgWrapper,
  Ke as ThemeProvider,
  ni as annotationsPropType,
  Qr as axisThemePropType,
  go as bindDefs,
  yi as blendModes,
  oi as crosshairPropType,
  A as curvePropKeys,
  mi as curvePropMapping,
  Q as defaultMargin,
  Be as defaultTheme,
  lo as defsPropTypes,
  ee as degreesToRadians,
  ii as dotsThemePropType,
  Ge as extendDefaultTheme,
  ho as getRelativeCursor,
  xi as getValueFormatter,
  Xe as gradientTypes,
  Zr as gridThemePropType,
  po as isCursorInRect,
  _i as isMatchingDef,
  ri as labelsThemePropType,
  ei as legendsThemePropType,
  ci as lineCurvePropKeys,
  bi as marginPropType,
  ti as markersThemePropType,
  Fe as motionConfigContext,
  ai as motionDefaultProps,
  Y as motionPropTypes,
  Z as noop,
  Ue as patternTypes,
  di as quantizeColorScales,
  ui as quantizeColorScalesKeys,
  gi as stackOffsetPropKeys,
  hi as stackOffsetPropMapping,
  pi as stackOrderPropKeys,
  fi as stackOrderPropMapping,
  Ee as themeContext,
  Ri as useMeasure,
  li as useMotionConfig,
  qi as usePartialTheme,
  H as useTheme,
  uo as useValueFormatter,
  mo as withDimensions,
  co as withMotion,
  fo as withTheme,
};
