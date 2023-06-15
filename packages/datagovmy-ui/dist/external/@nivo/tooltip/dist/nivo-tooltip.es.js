import {
  memo as f,
  useRef as k,
  useMemo as V,
  createContext as E,
  useState as z,
  useCallback as g,
  useContext as R,
} from "react";
import { a as S } from "../../../@react-spring/web/dist/react-spring-web.esm.js";
import {
  useTheme as v,
  useMotionConfig as F,
  useMeasure as W,
  useValueFormatter as X,
} from "../../core/dist/nivo-core.es.js";
import { j as p } from "../../../react/jsx-runtime.js";
import { useSpring as N } from "../../../@react-spring/core/dist/react-spring-core.esm.js";
function d() {
  return (
    (d =
      Object.assign ||
      function (t) {
        for (var o = 1; o < arguments.length; o++) {
          var n = arguments[o];
          for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
        }
        return t;
      }),
    d.apply(this, arguments)
  );
}
var B = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 },
  C = function (t, o) {
    return "translate(" + t + "px, " + o + "px)";
  },
  M = f(function (t) {
    var o,
      n = t.position,
      r = t.anchor,
      c = t.children,
      s = v(),
      i = F(),
      e = i.animate,
      u = i.config,
      l = W(),
      x = l[0],
      a = l[1],
      m = k(!1),
      T = void 0,
      w = !1,
      O = a.width > 0 && a.height > 0,
      h = Math.round(n[0]),
      y = Math.round(n[1]);
    O &&
      (r === "top"
        ? ((h -= a.width / 2), (y -= a.height + 14))
        : r === "right"
        ? ((h += 14), (y -= a.height / 2))
        : r === "bottom"
        ? ((h -= a.width / 2), (y += 14))
        : r === "left"
        ? ((h -= a.width + 14), (y -= a.height / 2))
        : r === "center" && ((h -= a.width / 2), (y -= a.height / 2)),
      (T = { transform: C(h, y) }),
      m.current || (w = !0),
      (m.current = [h, y]));
    var A = N({ to: T, config: u, immediate: !e || w }),
      P = d({}, B, s.tooltip, { transform: (o = A.transform) != null ? o : C(h, y) });
    return p.jsx(S.div, { ref: x, style: P, children: c });
  });
M.displayName = "TooltipWrapper";
var H = f(function (t) {
  var o = t.size,
    n = o === void 0 ? 12 : o,
    r = t.color,
    c = t.style;
  return p.jsx("span", {
    style: d({ display: "block", width: n, height: n, background: r }, c === void 0 ? {} : c),
  });
});
f(function (t) {
  var o,
    n = t.id,
    r = t.value,
    c = t.format,
    s = t.enableChip,
    i = s !== void 0 && s,
    e = t.color,
    u = t.renderContent,
    l = v(),
    x = X(c);
  if (typeof u == "function") o = u();
  else {
    var a = r;
    x !== void 0 && a !== void 0 && (a = x(a)),
      (o = p.jsxs("div", {
        style: l.tooltip.basic,
        children: [
          i && p.jsx(H, { color: e, style: l.tooltip.chip }),
          a !== void 0
            ? p.jsxs("span", { children: [n, ": ", p.jsx("strong", { children: "" + a })] })
            : n,
        ],
      }));
  }
  return p.jsx("div", { style: l.tooltip.container, children: o });
});
var I = { width: "100%", borderCollapse: "collapse" },
  L = f(function (t) {
    var o,
      n = t.title,
      r = t.rows,
      c = r === void 0 ? [] : r,
      s = t.renderContent,
      i = v();
    return c.length
      ? ((o =
          typeof s == "function"
            ? s()
            : p.jsxs("div", {
                children: [
                  n && n,
                  p.jsx("table", {
                    style: d({}, I, i.tooltip.table),
                    children: p.jsx("tbody", {
                      children: c.map(function (e, u) {
                        return p.jsx(
                          "tr",
                          {
                            children: e.map(function (l, x) {
                              return p.jsx("td", { style: i.tooltip.tableCell, children: l }, x);
                            }),
                          },
                          u
                        );
                      }),
                    }),
                  }),
                ],
              })),
        p.jsx("div", { style: i.tooltip.container, children: o }))
      : null;
  });
L.displayName = "TableTooltip";
var b = f(function (t) {
  var o = t.x0,
    n = t.x1,
    r = t.y0,
    c = t.y1,
    s = v(),
    i = F(),
    e = i.animate,
    u = i.config,
    l = V(
      function () {
        return d({}, s.crosshair.line, { pointerEvents: "none" });
      },
      [s.crosshair.line]
    ),
    x = N({ x1: o, x2: n, y1: r, y2: c, config: u, immediate: !e });
  return p.jsx(S.line, d({}, x, { fill: "none", style: l }));
});
b.displayName = "CrosshairLine";
var Y = f(function (t) {
  var o,
    n,
    r = t.width,
    c = t.height,
    s = t.type,
    i = t.x,
    e = t.y;
  return (
    s === "cross"
      ? ((o = { x0: i, x1: i, y0: 0, y1: c }), (n = { x0: 0, x1: r, y0: e, y1: e }))
      : s === "top-left"
      ? ((o = { x0: i, x1: i, y0: 0, y1: e }), (n = { x0: 0, x1: i, y0: e, y1: e }))
      : s === "top"
      ? (o = { x0: i, x1: i, y0: 0, y1: e })
      : s === "top-right"
      ? ((o = { x0: i, x1: i, y0: 0, y1: e }), (n = { x0: i, x1: r, y0: e, y1: e }))
      : s === "right"
      ? (n = { x0: i, x1: r, y0: e, y1: e })
      : s === "bottom-right"
      ? ((o = { x0: i, x1: i, y0: e, y1: c }), (n = { x0: i, x1: r, y0: e, y1: e }))
      : s === "bottom"
      ? (o = { x0: i, x1: i, y0: e, y1: c })
      : s === "bottom-left"
      ? ((o = { x0: i, x1: i, y0: e, y1: c }), (n = { x0: 0, x1: i, y0: e, y1: e }))
      : s === "left"
      ? (n = { x0: 0, x1: i, y0: e, y1: e })
      : s === "x"
      ? (o = { x0: i, x1: i, y0: 0, y1: c })
      : s === "y" && (n = { x0: 0, x1: r, y0: e, y1: e }),
    p.jsxs(p.Fragment, {
      children: [
        o && p.jsx(b, { x0: o.x0, x1: o.x1, y0: o.y0, y1: o.y1 }),
        n && p.jsx(b, { x0: n.x0, x1: n.x1, y0: n.y0, y1: n.y1 }),
      ],
    })
  );
});
Y.displayName = "Crosshair";
var _ = E({
    showTooltipAt: function () {},
    showTooltipFromEvent: function () {},
    hideTooltip: function () {},
  }),
  j = { isVisible: !1, position: [null, null], content: null, anchor: null },
  q = E(j),
  $ = function (t) {
    var o = z(j),
      n = o[0],
      r = o[1],
      c = g(
        function (e, u, l) {
          var x = u[0],
            a = u[1];
          l === void 0 && (l = "top"),
            r({ isVisible: !0, position: [x, a], anchor: l, content: e });
        },
        [r]
      ),
      s = g(
        function (e, u, l) {
          l === void 0 && (l = "top");
          var x = t.current.getBoundingClientRect(),
            a = u.clientX - x.left,
            m = u.clientY - x.top;
          (l !== "left" && l !== "right") || (l = a < x.width / 2 ? "right" : "left"),
            r({ isVisible: !0, position: [a, m], anchor: l, content: e });
        },
        [t, r]
      ),
      i = g(
        function () {
          r(j);
        },
        [r]
      );
    return {
      actions: V(
        function () {
          return { showTooltipAt: c, showTooltipFromEvent: s, hideTooltip: i };
        },
        [c, s, i]
      ),
      state: n,
    };
  },
  D = function () {
    var t = R(q);
    if (t === void 0) throw new Error("useTooltipState must be used within a TooltipProvider");
    return t;
  },
  G = function (t) {
    return t.isVisible;
  },
  tt = function () {
    var t = D();
    return G(t) ? p.jsx(M, { position: t.position, anchor: t.anchor, children: t.content }) : null;
  };
export {
  H as Chip,
  Y as Crosshair,
  L as TableTooltip,
  tt as Tooltip,
  _ as TooltipActionsContext,
  q as TooltipStateContext,
  M as TooltipWrapper,
  j as hiddenTooltipState,
  G as isVisibleTooltipState,
  $ as useTooltipHandlers,
  D as useTooltipState,
};
