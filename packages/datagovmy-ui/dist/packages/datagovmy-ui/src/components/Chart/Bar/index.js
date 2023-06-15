import { j as d } from "../../../../../../external/react/jsx-runtime.js";
import { useRef as K, useMemo as m, useContext as N } from "react";
import P from "../ChartHeader/index.js";
import {
  Chart as V,
  CategoryScale as _,
  LinearScale as H,
  PointElement as $,
  BarElement as z,
  Tooltip as U,
  Legend as q,
} from "../../../../../../external/chart.js/dist/chart.js";
import {
  Bar as G,
  getElementAtEvent as J,
} from "../../../../../../external/react-chartjs-2/dist/index.js";
import { numFormat as Q } from "../../../../../../helpers.js";
import { WindowContext as Y } from "../../../hooks/useWindow.js";
import { AKSARA_COLOR as c, BREAKPOINTS as Z } from "../../../lib/constants.js";
import { useTheme as X } from "../../../../../../external/next-themes/dist/index.module.js";
const pe = ({
    className: y = "w-full h-full",
    // manage CSS here
    menu: x,
    title: A,
    controls: k,
    state: M,
    type: te = "category",
    unitX: u,
    enableStep: E,
    unitY: L,
    prefixY: S,
    layout: p = "vertical",
    data: i = ee,
    formatX: r,
    onClick: f,
    reverse: C = !1,
    precision: s = 1,
    enableLegend: R = !1,
    enableStack: g = !1,
    enableGridX: j = !0,
    enableGridY: B = !0,
    minY: D,
    maxY: I,
    suggestedMaxY: T,
    tooltipEnabled: w = !0,
    _ref: F,
  }) => {
    const l = K(),
      o = m(() => p === "vertical", [p]),
      { breakpoint: W } = N(Y);
    V.register(_, H, $, z, U, q);
    const { theme: b } = X(),
      n = (e, t, h) => (S ?? "") + Q(e, t, h) + (L ?? ""),
      O = e =>
        W >= Z.MD
          ? r
            ? r(e)
            : e
          : r
          ? r(e).length > 25
            ? r(e).slice(0, 25).concat("..")
            : r(e)
          : e.length > 25
          ? e.slice(0, 25).concat("..")
          : e,
      a = m(() => {
        var e;
        return C
          ? {
              labels: (e = i.labels) == null ? void 0 : e.slice().reverse(),
              datasets: i.datasets.map(t => ({ ...t, data: t.data.slice().reverse() })),
            }
          : i;
      }, [i]),
      v = {
        indexAxis: o ? "x" : "y",
        maintainAspectRatio: !1,
        responsive: !0,
        plugins: {
          legend: {
            display: R,
            labels: {
              usePointStyle: !0,
              pointStyle: "rect",
            },
            position: "top",
            align: "start",
          },
          tooltip: {
            enabled: w,
            bodyFont: {
              family: "Inter",
            },
            callbacks: {
              label: function (e) {
                const t = {
                  vertical:
                    e.parsed.y !== void 0 || e.parsed.y !== null
                      ? n(e.parsed.y, "standard", s)
                      : "-",
                  horizontal:
                    e.parsed.x !== void 0 || e.parsed.x !== null
                      ? n(e.parsed.x, "standard", s)
                      : "-",
                };
                return `${e.dataset.label} : ${t[p]}`;
              },
              title(e) {
                return r ? r(e[0].label) : e[0].label;
              },
            },
          },
          crosshair: !1,
          annotation: !1,
          datalabels: !1,
        },
        scales: {
          x: {
            // type: isVertical ? type : "linear",
            grid: {
              display: j,
              borderWidth: 1,
              borderDash: [5, 10],
              color: b === "light" ? c.OUTLINE : c.WASHED_DARK,
              drawTicks: !0,
              drawBorder: !0,
            },
            ticks: {
              font: {
                family: "Inter",
              },
              padding: 6,
              major: {
                enabled: !0,
              },
              stepSize:
                E && Math.min.apply(Math, a.datasets[0].data) <= 0
                  ? Math.ceil(Math.abs(Math.floor(Math.min.apply(Math, a.datasets[0].data))))
                  : 0,
              callback: function (e) {
                if (!r) return o ? this.getLabelForValue(e).concat(u ?? "") : n(e, "compact", 1);
                let t = o ? r(this.getLabelForValue(e)) : n(e, "compact", 1);
                return t.length > 25 && (t = t.slice(0, 25).concat("..")), t;
              },
            },
            stacked: g,
          },
          y: {
            // reverse: !isVertical,
            suggestedMax: T,
            grid: {
              display: B,
              borderWidth: 1,
              drawTicks: !1,
              drawBorder: !1,
              offset: !1,
              color: b === "light" ? c.OUTLINE : c.WASHED_DARK,
              borderDash(e) {
                return e.tick.value === 0 ? [0, 0] : [5, 5];
              },
              lineWidth(e) {
                return e.tick.value === 0 ? 2 : 1;
              },
            },
            ticks: {
              font: {
                family: "Inter",
              },
              precision: Array.isArray(s) ? s[1] : s,
              callback: function (e) {
                return O(o ? n(e, "compact", 1) : this.getLabelForValue(e).concat(u ?? ""));
              },
            },
            min: D,
            max: I,
            stacked: g,
          },
        },
      };
    return /* @__PURE__ */ d.jsxs("div", {
      className: "space-y-4",
      children: [
        /* @__PURE__ */ d.jsx(P, { title: A, menu: x, controls: k, state: M }),
        /* @__PURE__ */ d.jsx("div", {
          className: y,
          children: /* @__PURE__ */ d.jsx(G, {
            ref: F ?? l,
            onClick: e => {
              if (l != null && l.current) {
                const t = J(l.current, e);
                f &&
                  t.length &&
                  f(a == null ? void 0 : a.labels[t[0].index].toString(), t[0].index);
              }
            },
            data: a,
            options: v,
            plugins: [
              {
                id: "increase-legend-spacing",
                beforeInit(e) {
                  const t = e.legend.fit;
                  e.legend.fit = function () {
                    t.bind(e.legend)(), (this.height += 20);
                  };
                },
              },
            ],
          }),
        }),
      ],
    });
  },
  ee = {
    labels: ["0-4", "5-10", "11-14"],
    // x-values
    datasets: [
      // grouped y-values
      {
        label: "Moving Average (MA)",
        data: [1, 2, 3],
        // y-values
        fill: !0,
        backgroundColor: "#000",
      },
      {
        label: "Primary",
        data: [4, 1, 7],
        // y-values
        fill: !0,
        backgroundColor: "#a4a4a4",
        stack: "primary",
      },
    ],
  };
export { pe as default };
