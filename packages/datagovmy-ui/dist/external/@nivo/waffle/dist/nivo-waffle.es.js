import { Fragment as $, createElement as Q, Component as io } from "react";
import P from "../../../lodash/partial.js";
import { TransitionMotion as yo, spring as X } from "../../../react-motion/lib/react-motion.js";
import {
  pure as S,
  withPropsOnChange as I,
  withState as Ro,
  setDisplayName as no,
  compose as Z,
  defaultProps as oo,
} from "../node_modules/@nivo/recompose/dist/nivo-recompose.es.js";
import {
  defsPropTypes as qo,
  withDimensions as wo,
  withTheme as Wo,
  withMotion as ro,
  LegacyContainer as ao,
  SvgWrapper as ko,
  noop as jo,
  getRelativeCursor as ho,
  bindDefs as To,
  ResponsiveWrapper as Do,
  isCursorInRect as Ho,
} from "../../core/dist/nivo-core.es.js";
import {
  LegendPropShape as vo,
  BoxLegendSvg as Ao,
  renderLegendToCanvas as Mo,
} from "../node_modules/@nivo/legends/dist/nivo-legends.es.js";
import r from "../../../prop-types/index.js";
import {
  ordinalColorsPropType as Po,
  inheritedColorPropType as Eo,
  getOrdinalColorScale as Io,
  getInheritedColorGenerator as Oo,
} from "../node_modules/@nivo/colors/dist/nivo-colors.es.js";
import { j as y } from "../../../react/jsx-runtime.js";
import D from "../../../lodash/range.js";
import { BasicTooltip as Lo } from "../node_modules/@nivo/tooltip/dist/nivo-tooltip.es.js";
function R() {
  return (
    (R =
      Object.assign ||
      function (t) {
        for (var n = 1; n < arguments.length; n++) {
          var e = arguments[n];
          for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
        }
        return t;
      }),
    R.apply(this, arguments)
  );
}
function lo(t, n) {
  (t.prototype = Object.create(n.prototype)), (t.prototype.constructor = t), eo(t, n);
}
function eo(t, n) {
  return (
    (eo =
      Object.setPrototypeOf ||
      function (e, o) {
        return (e.__proto__ = o), e;
      }),
    eo(t, n)
  );
}
var _ = function (t) {
  var n = t.position,
    e = t.size,
    o = t.x,
    l = t.y,
    i = t.color,
    a = t.fill,
    u = t.opacity,
    s = t.borderWidth,
    c = t.borderColor,
    d = t.data,
    p = t.onHover,
    f = t.onLeave,
    m = t.onClick;
  return y.jsx("rect", {
    width: e,
    height: e,
    x: o,
    y: l,
    fill: a || i,
    strokeWidth: s,
    stroke: c,
    opacity: u,
    onMouseEnter: p,
    onMouseMove: p,
    onMouseLeave: f,
    onClick: function (C) {
      m({ position: n, color: i, x: o, y: l, data: d }, C);
    },
  });
};
(_.propTypes = {
  position: r.number.isRequired,
  size: r.number.isRequired,
  x: r.number.isRequired,
  y: r.number.isRequired,
  color: r.string.isRequired,
  fill: r.string,
  opacity: r.number.isRequired,
  borderWidth: r.number.isRequired,
  borderColor: r.string.isRequired,
  data: r.object.isRequired,
  onHover: r.func.isRequired,
  onLeave: r.func.isRequired,
  onClick: r.func.isRequired,
}),
  (_.defaultProps = { data: {} }),
  (_.displayName = "WaffleCell");
var So = S(_),
  B = function (t) {
    var n = t.position,
      e = t.size,
      o = t.x,
      l = t.y,
      i = t.color,
      a = t.opacity,
      u = t.borderWidth,
      s = t.borderColor,
      c = t.data,
      d = t.onHover,
      p = t.onLeave,
      f = t.onClick;
    return y.jsx("div", {
      style: {
        position: "absolute",
        top: l,
        left: o,
        width: e,
        height: e,
        background: i,
        opacity: a,
        boxSizing: "content-box",
        borderStyle: "solid",
        borderWidth: u + "px",
        borderColor: s,
      },
      onMouseEnter: d,
      onMouseMove: d,
      onMouseLeave: p,
      onClick: function (m) {
        f({ position: n, color: i, x: o, y: l, data: c }, m);
      },
    });
  };
(B.propTypes = {
  position: r.number.isRequired,
  size: r.number.isRequired,
  x: r.number.isRequired,
  y: r.number.isRequired,
  color: r.string.isRequired,
  opacity: r.number.isRequired,
  borderWidth: r.number.isRequired,
  borderColor: r.string.isRequired,
  data: r.object.isRequired,
  onHover: r.func.isRequired,
  onLeave: r.func.isRequired,
  onClick: r.func.isRequired,
}),
  (B.defaultProps = { data: {} }),
  (B.displayName = "WaffleCellHtml");
var zo = S(B),
  so = {
    total: r.number.isRequired,
    data: r.arrayOf(
      r.shape({
        id: r.oneOfType([r.string, r.number]).isRequired,
        label: r.oneOfType([r.string, r.number]).isRequired,
        value: r.number.isRequired,
      })
    ).isRequired,
    hiddenIds: r.arrayOf(r.oneOfType([r.string, r.number])).isRequired,
    rows: r.number.isRequired,
    columns: r.number.isRequired,
    fillDirection: r.oneOf(["top", "right", "bottom", "left"]).isRequired,
    padding: r.number.isRequired,
    colors: Po.isRequired,
    emptyColor: r.string.isRequired,
    emptyOpacity: r.number.isRequired,
    borderWidth: r.number.isRequired,
    borderColor: Eo.isRequired,
    getBorderColor: r.func.isRequired,
    isInteractive: r.bool,
    tooltipFormat: r.oneOfType([r.func, r.string]),
    tooltip: r.func,
    cellSize: r.number.isRequired,
    cells: r.array.isRequired,
    origin: r.shape({ x: r.number.isRequired, y: r.number.isRequired }).isRequired,
  },
  go = R({}, so, { cellComponent: r.func.isRequired, role: r.string.isRequired }, qo, {
    legends: r.arrayOf(r.shape(vo)).isRequired,
  }),
  Co = R({}, so, { cellComponent: r.func.isRequired }),
  bo = R({}, so, { pixelRatio: r.number.isRequired, legends: r.arrayOf(r.shape(vo)).isRequired }),
  uo = {
    hiddenIds: [],
    fillDirection: "bottom",
    padding: 1,
    colors: { scheme: "nivo" },
    emptyColor: "#cccccc",
    emptyOpacity: 1,
    borderWidth: 0,
    borderColor: { from: "color", modifiers: [["darker", 1]] },
    defs: [],
    fill: [],
    isInteractive: !0,
    onClick: jo,
  },
  No = R({}, uo, { cellComponent: So, role: "img", defs: [], fill: [], legends: [] }),
  Fo = R({}, uo, { cellComponent: zo }),
  _o = R({}, uo, {
    legends: [],
    pixelRatio: (typeof window < "u" && window.devicePixelRatio) || 1,
  }),
  Bo = Object.freeze({
    __proto__: null,
    WafflePropTypes: go,
    WaffleHtmlPropTypes: Co,
    WaffleCanvasPropTypes: bo,
    WaffleDefaultProps: No,
    WaffleHtmlDefaultProps: Fo,
    WaffleCanvasDefaultProps: _o,
  }),
  $o = function (t, n, e, o, l, i) {
    var a = (function (s, c, d, p, f) {
        var m = (s - (p - 1) * f) / p,
          C = (c - (d - 1) * f) / d;
        return Math.min(m, C);
      })(t, n, e, o, i),
      u = [];
    switch (l) {
      case "top":
        D(e).forEach(function (s) {
          D(o).forEach(function (c) {
            u.push({ position: s * o + c, row: s, column: c, x: c * (a + i), y: s * (a + i) });
          });
        });
        break;
      case "bottom":
        D(e - 1, -1).forEach(function (s) {
          D(o).forEach(function (c) {
            u.push({ position: s * o + c, row: s, column: c, x: c * (a + i), y: s * (a + i) });
          });
        });
        break;
      case "left":
        D(o).forEach(function (s) {
          D(e).forEach(function (c) {
            u.push({ position: c * o + s, row: c, column: s, x: s * (a + i), y: c * (a + i) });
          });
        });
        break;
      case "right":
        D(o - 1, -1).forEach(function (s) {
          D(e - 1, -1).forEach(function (c) {
            u.push({ position: c * o + s, row: c, column: s, x: s * (a + i), y: c * (a + i) });
          });
        });
        break;
      default:
        throw new Error("Invalid fill direction provided: " + l);
    }
    return {
      cells: u,
      cellSize: a,
      origin: { x: (t - (a * o + i * (o - 1))) / 2, y: (n - (a * e + i * (e - 1))) / 2 },
    };
  },
  Y = function (t, n) {
    var e = t.map(function (o) {
      return R({}, o);
    });
    return (
      n.forEach(function (o) {
        D(o.startAt, o.endAt).forEach(function (l) {
          var i = e[l];
          i !== void 0 && ((i.data = o), (i.groupIndex = o.groupIndex), (i.color = o.color));
        });
      }),
      e
    );
  },
  to = [
    wo(),
    Wo(),
    ro(),
    I(["colors"], function (t) {
      var n = t.colors;
      return { getColor: Io(n, "id") };
    }),
    I(["borderColor", "theme"], function (t) {
      var n = t.borderColor,
        e = t.theme;
      return { getBorderColor: Oo(n, e) };
    }),
    Ro("currentCell", "setCurrentCell", null),
    I(["rows", "columns", "total"], function (t) {
      var n = t.rows,
        e = t.columns;
      return { unit: t.total / (n * e) };
    }),
    I(["width", "height", "rows", "columns", "fillDirection", "padding"], function (t) {
      var n = t.width,
        e = t.height,
        o = t.rows,
        l = t.columns,
        i = t.fillDirection,
        a = t.padding;
      return $o(n, e, o, l, i, a);
    }),
    I(["data", "unit", "getColor", "hiddenIds"], function (t) {
      var n = t.data,
        e = t.unit,
        o = t.getColor,
        l = t.hiddenIds,
        i = 0;
      return {
        computedData: n.map(function (a, u) {
          if (!l.includes(a.id)) {
            var s = R({}, a, {
              groupIndex: u,
              startAt: i,
              endAt: i + Math.round(a.value / e),
              color: o(a),
            });
            return (i = s.endAt), s;
          }
          return R({}, a, { groupIndex: u, startAt: i, endAt: i, color: o(a) });
        }),
      };
    }),
    I(["computedData"], function (t) {
      return {
        legendData: t.computedData.map(function (n) {
          return { id: n.id, label: n.id, color: n.color, fill: n.fill };
        }),
      };
    }),
  ],
  co = function (t) {
    var n = Bo[t.displayName + "DefaultProps"];
    switch (t.displayName) {
      case "Waffle":
        return Z.apply(
          void 0,
          [oo(n)].concat(to, [
            ro(),
            I(["computedData", "defs", "fill"], function (e) {
              var o = e.computedData,
                l = e.defs,
                i = e.fill;
              return { defs: To(l, o, i, { targetKey: "fill" }) };
            }),
            S,
          ])
        )(t);
      case "WaffleHtml":
        return Z.apply(void 0, [oo(n)].concat(to, [ro(), S]))(t);
      case "WaffleCanvas":
        return Z.apply(void 0, [oo(n)].concat(to, [S]))(t);
    }
    return t;
  },
  z = function (t) {
    var n = t.position,
      e = t.row,
      o = t.column,
      l = t.color,
      i = t.data,
      a = t.theme,
      u = t.tooltipFormat,
      s = t.tooltip;
    return y.jsx(Lo, {
      id: i.label,
      value: i.value,
      enableChip: !0,
      color: l,
      theme: a,
      format: u,
      renderContent:
        typeof s == "function"
          ? s.bind(null, R({ position: n, row: e, column: o, color: l }, i))
          : null,
    });
  };
(z.displayName = "WaffleCellTooltip"),
  (z.propTypes = {
    position: r.number.isRequired,
    row: r.number.isRequired,
    column: r.number.isRequired,
    color: r.string.isRequired,
    data: r.object.isRequired,
    theme: r.object.isRequired,
    tooltipFormat: r.oneOfType([r.func, r.string]),
    tooltip: r.func,
  });
var G = (function (t) {
  function n() {
    for (var e, o = arguments.length, l = new Array(o), i = 0; i < o; i++) l[i] = arguments[i];
    return (
      ((e = t.call.apply(t, [this].concat(l)) || this).handleCellHover = function (a, u, s) {
        var c = e.props,
          d = c.setCurrentCell,
          p = c.theme,
          f = c.tooltipFormat,
          m = c.tooltip;
        d(u),
          u.data &&
            a(
              y.jsx(z, {
                position: u.position,
                row: u.row,
                column: u.column,
                color: u.color,
                data: u.data,
                theme: p,
                tooltipFormat: f,
                tooltip: m,
              }),
              s
            );
      }),
      (e.handleCellLeave = function (a) {
        e.props.setCurrentCell(null), a();
      }),
      e
    );
  }
  return (
    lo(n, t),
    (n.prototype.render = function () {
      var e = this,
        o = this.props;
      o.hiddenIds;
      var l = o.margin,
        i = o.width,
        a = o.height,
        u = o.outerWidth,
        s = o.outerHeight,
        c = o.cellComponent,
        d = o.emptyColor,
        p = o.emptyOpacity,
        f = o.borderWidth,
        m = o.getBorderColor,
        C = o.theme,
        j = o.defs,
        k = o.animate,
        W = o.motionStiffness,
        q = o.motionDamping,
        H = o.isInteractive,
        A = o.onClick,
        T = o.cells,
        b = o.cellSize,
        h = o.origin,
        O = o.computedData,
        M = o.legendData,
        N = o.legends,
        F = o.role;
      return (
        T.forEach(function (E) {
          E.color = d;
        }),
        y.jsx(ao, {
          isInteractive: H,
          theme: C,
          animate: k,
          motionDamping: q,
          motionStiffness: W,
          children: function (E) {
            var L,
              v = E.showTooltip,
              U = E.hideTooltip,
              x = P(e.handleCellHover, v),
              po = P(e.handleCellLeave, U);
            if (k === !0) {
              var fo = { stiffness: W, damping: q };
              L = y.jsx(yo, {
                styles: O.map(function (g) {
                  return {
                    key: g.id,
                    data: g,
                    style: { startAt: X(g.startAt, fo), endAt: X(g.endAt, fo) },
                  };
                }),
                children: function (g) {
                  var V = Y(
                    T,
                    g.map(function (w) {
                      return R({}, w.data, {
                        startAt: Math.round(w.style.startAt),
                        endAt: Math.round(w.style.endAt),
                      });
                    })
                  );
                  return y.jsx($, {
                    children: V.map(function (w) {
                      return Q(c, {
                        key: w.position,
                        position: w.position,
                        size: b,
                        x: w.x,
                        y: w.y,
                        color: w.color,
                        fill: w.data && w.data.fill,
                        opacity: w.data ? 1 : p,
                        borderWidth: f,
                        borderColor: m(w),
                        data: w.data,
                        onHover: P(x, w),
                        onLeave: po,
                        onClick: A,
                      });
                    }),
                  });
                },
              });
            } else {
              var xo = Y(T, O);
              L = y.jsx($, {
                children: xo.map(function (g) {
                  return Q(c, {
                    key: g.position,
                    position: g.position,
                    size: b,
                    x: g.x,
                    y: g.y,
                    color: g.color,
                    fill: g.data && g.data.fill,
                    opacity: g.data ? 1 : p,
                    borderWidth: f,
                    borderColor: m(g),
                    data: g.data,
                    onHover: P(x, g),
                    onLeave: po,
                    onClick: A,
                  });
                }),
              });
            }
            return y.jsxs(ko, {
              width: u,
              height: s,
              margin: l,
              defs: j,
              theme: C,
              role: F,
              children: [
                y.jsx("g", { transform: "translate(" + h.x + ", " + h.y + ")", children: L }),
                N.map(function (g, V) {
                  return y.jsx(
                    Ao,
                    R({}, g, { containerWidth: i, containerHeight: a, data: M, theme: C }),
                    V
                  );
                }),
              ],
            });
          },
        })
      );
    }),
    n
  );
})(io);
(G.propTypes = go), (G.displayName = "Waffle");
var Qo = no(G.displayName)(co(G)),
  et = function (t) {
    return y.jsx(Do, {
      children: function (n) {
        var e = n.width,
          o = n.height;
        return y.jsx(Qo, R({ width: e, height: o }, t));
      },
    });
  },
  J = (function (t) {
    function n() {
      for (var e, o = arguments.length, l = new Array(o), i = 0; i < o; i++) l[i] = arguments[i];
      return (
        ((e = t.call.apply(t, [this].concat(l)) || this).handleCellHover = function (a, u, s) {
          var c = e.props,
            d = c.setCurrentCell,
            p = c.theme,
            f = c.tooltipFormat,
            m = c.tooltip;
          d(u),
            u.data &&
              a(
                y.jsx(z, {
                  position: u.position,
                  row: u.row,
                  column: u.column,
                  color: u.color,
                  data: u.data,
                  theme: p,
                  tooltipFormat: f,
                  tooltip: m,
                }),
                s
              );
        }),
        (e.handleCellLeave = function (a) {
          e.props.setCurrentCell(null), a();
        }),
        e
      );
    }
    return (
      lo(n, t),
      (n.prototype.render = function () {
        var e = this,
          o = this.props,
          l = o.margin,
          i = o.outerWidth,
          a = o.outerHeight,
          u = o.cellComponent,
          s = o.emptyColor,
          c = o.emptyOpacity,
          d = o.borderWidth,
          p = o.getBorderColor,
          f = o.theme,
          m = o.animate,
          C = o.motionStiffness,
          j = o.motionDamping,
          k = o.isInteractive,
          W = o.onClick,
          q = o.cells,
          H = o.cellSize,
          A = o.origin,
          T = o.computedData;
        return (
          q.forEach(function (b) {
            b.color = s;
          }),
          y.jsx(ao, {
            isInteractive: k,
            theme: f,
            animate: m,
            motionDamping: j,
            motionStiffness: C,
            children: function (b) {
              var h,
                O = b.showTooltip,
                M = b.hideTooltip,
                N = P(e.handleCellHover, O),
                F = P(e.handleCellLeave, M);
              if (m === !0) {
                var E = { stiffness: C, damping: j };
                h = y.jsx(yo, {
                  styles: T.map(function (v) {
                    return {
                      key: v.id,
                      data: v,
                      style: { startAt: X(v.startAt, E), endAt: X(v.endAt, E) },
                    };
                  }),
                  children: function (v) {
                    var U = Y(
                      q,
                      v.map(function (x) {
                        return R({}, x.data, {
                          startAt: Math.round(x.style.startAt),
                          endAt: Math.round(x.style.endAt),
                        });
                      })
                    );
                    return y.jsx($, {
                      children: U.map(function (x) {
                        return Q(u, {
                          key: x.position,
                          position: x.position,
                          size: H,
                          x: x.x,
                          y: x.y,
                          color: x.color,
                          fill: x.data && x.data.fill,
                          opacity: x.data ? 1 : c,
                          borderWidth: d,
                          borderColor: p(x),
                          data: x.data,
                          onHover: P(N, x),
                          onLeave: F,
                          onClick: W,
                        });
                      }),
                    });
                  },
                });
              } else {
                var L = Y(q, T);
                h = y.jsx($, {
                  children: L.map(function (v) {
                    return Q(u, {
                      key: v.position,
                      position: v.position,
                      size: H,
                      x: v.x,
                      y: v.y,
                      color: v.color,
                      fill: v.data && v.data.fill,
                      opacity: v.data ? 1 : c,
                      borderWidth: d,
                      borderColor: p(v),
                      data: v.data,
                      onHover: P(N, v),
                      onLeave: F,
                      onClick: W,
                    });
                  }),
                });
              }
              return y.jsx("div", {
                style: { position: "relative", width: i, height: a },
                children: y.jsx("div", {
                  style: { position: "absolute", top: l.top + A.y, left: l.left + A.x },
                  children: h,
                }),
              });
            },
          })
        );
      }),
      n
    );
  })(io);
(J.propTypes = Co), (J.displayName = "WaffleHtml");
no(J.displayName)(co(J));
var mo = function (t, n, e, o, l, i) {
    return t.find(function (a) {
      return Ho(a.x + e.x + o.left, a.y + e.y + o.top, n, n, l, i);
    });
  },
  K = (function (t) {
    function n() {
      for (var o, l = arguments.length, i = new Array(l), a = 0; a < l; a++) i[a] = arguments[a];
      return (
        ((o = t.call.apply(t, [this].concat(i)) || this).handleMouseHover = function (u, s) {
          return function (c) {
            var d = o.props,
              p = d.isInteractive,
              f = d.margin,
              m = d.theme,
              C = d.cells,
              j = d.cellSize,
              k = d.origin,
              W = d.tooltipFormat,
              q = d.tooltip;
            if (p && C) {
              var H = ho(o.surface, c),
                A = H[0],
                T = H[1],
                b = mo(C, j, k, f, A, T);
              b !== void 0 && b.data
                ? u(
                    y.jsx(z, {
                      position: b.position,
                      row: b.row,
                      column: b.column,
                      color: b.color,
                      data: b.data,
                      theme: m,
                      tooltipFormat: W,
                      tooltip: q,
                    }),
                    c
                  )
                : s();
            }
          };
        }),
        (o.handleMouseLeave = function (u) {
          return function () {
            o.props.isInteractive === !0 && u();
          };
        }),
        (o.handleClick = function (u) {
          var s = o.props,
            c = s.isInteractive,
            d = s.margin,
            p = s.onClick,
            f = s.cells,
            m = s.cellSize,
            C = s.origin;
          if (c && f) {
            var j = ho(o.surface, u),
              k = j[0],
              W = j[1],
              q = mo(f, m, C, d, k, W);
            q !== void 0 && p(q, u);
          }
        }),
        o
      );
    }
    lo(n, t);
    var e = n.prototype;
    return (
      (e.componentDidMount = function () {
        (this.ctx = this.surface.getContext("2d")), this.draw(this.props);
      }),
      (e.componentDidUpdate = function () {
        (this.ctx = this.surface.getContext("2d")), this.draw(this.props);
      }),
      (e.draw = function (o) {
        var l = this,
          i = o.pixelRatio,
          a = o.margin,
          u = o.width,
          s = o.height,
          c = o.outerWidth,
          d = o.outerHeight,
          p = o.getColor,
          f = o.emptyColor,
          m = o.emptyOpacity,
          C = o.borderWidth,
          j = o.getBorderColor,
          k = o.cells,
          W = o.cellSize,
          q = o.origin,
          H = o.computedData,
          A = o.legendData,
          T = o.legends,
          b = o.theme;
        (this.surface.width = c * i),
          (this.surface.height = d * i),
          this.ctx.scale(i, i),
          (this.ctx.fillStyle = b.background),
          this.ctx.fillRect(0, 0, c, d),
          this.ctx.translate(a.left, a.top),
          k.forEach(function (h) {
            h.color = f;
          }),
          H.forEach(function (h) {
            D(h.startAt, h.endAt).forEach(function (O) {
              var M = k[O];
              M !== void 0 && ((M.data = h), (M.groupIndex = h.groupIndex), (M.color = p(h)));
            });
          }),
          k.forEach(function (h) {
            l.ctx.save(),
              (l.ctx.globalAlpha = h.data ? 1 : m),
              (l.ctx.fillStyle = h.color),
              l.ctx.fillRect(h.x + q.x, h.y + q.y, W, W),
              C > 0 &&
                ((l.ctx.strokeStyle = j(h)),
                (l.ctx.lineWidth = C),
                l.ctx.strokeRect(h.x + q.x, h.y + q.y, W, W)),
              l.ctx.restore();
          }),
          T.forEach(function (h) {
            Mo(l.ctx, R({}, h, { data: A, containerWidth: u, containerHeight: s, theme: b }));
          });
      }),
      (e.render = function () {
        var o = this,
          l = this.props,
          i = l.outerWidth,
          a = l.outerHeight,
          u = l.pixelRatio,
          s = l.isInteractive,
          c = l.theme;
        return y.jsx(ao, {
          isInteractive: s,
          theme: c,
          animate: !1,
          children: function (d) {
            var p = d.showTooltip,
              f = d.hideTooltip;
            return y.jsx("canvas", {
              ref: function (m) {
                o.surface = m;
              },
              width: i * u,
              height: a * u,
              style: { width: i, height: a },
              onMouseEnter: o.handleMouseHover(p, f),
              onMouseMove: o.handleMouseHover(p, f),
              onMouseLeave: o.handleMouseLeave(f),
              onClick: o.handleClick,
            });
          },
        });
      }),
      n
    );
  })(io);
(K.propTypes = bo), (K.displayName = "WaffleCanvas");
no(K.displayName)(co(K));
export {
  et as ResponsiveWaffle,
  Qo as Waffle,
  _o as WaffleCanvasDefaultProps,
  bo as WaffleCanvasPropTypes,
  No as WaffleDefaultProps,
  Fo as WaffleHtmlDefaultProps,
  Co as WaffleHtmlPropTypes,
  go as WafflePropTypes,
};
