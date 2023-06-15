import { j as l } from "../../../../../../external/react/jsx-runtime.js";
import { useCallback as G, useMemo as S } from "react";
import J from "../../Tooltip/index.js";
import Y from "../ChartHeader/index.js";
import {
  Chart as ee,
  CategoryScale as te,
  LinearScale as le,
  BarElement as re,
  BarController as ae,
  PointElement as se,
  LineElement as ne,
  LineController as ie,
  TimeScale as oe,
  TimeSeriesScale as de,
  Legend as ce,
  Filler as me,
  Tooltip as fe,
} from "../../../../../../external/chart.js/dist/chart.js";
import ue from "../../../../../../external/chartjs-plugin-crosshair/dist/chartjs-plugin-crosshair.esm.js";
import ye from "../../../../../../external/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.esm.js";
import { Chart as pe } from "../../../../../../external/react-chartjs-2/dist/index.js";
import { numFormat as A, clx as T } from "../../../../../../helpers.js";
import "../../../../../../external/chartjs-adapter-luxon/dist/chartjs-adapter-luxon.esm.js";
import { useTheme as he } from "../../../../../../external/next-themes/dist/index.module.js";
import { AKSARA_COLOR as I } from "../../../lib/constants.js";
import ge from "../../Spinner/index.js";
const ve = ({
    className: i = "w-full h-[450px]",
    // manage CSS here
    menu: u,
    title: o,
    description: r,
    controls: d,
    isLoading: c = !1,
    interval: s = "auto",
    tooltipFormat: b,
    prefixY: F,
    unitY: N,
    round: n = "day",
    mode: y = "stacked",
    data: t = be,
    stats: x,
    state: R,
    subheader: k,
    type: E = "bar",
    axisY: v = void 0,
    precision: j = 1,
    enableRightScale: q = !1,
    enableCallout: p = !1,
    enableCrosshair: B = !0,
    enableLegend: D = !1,
    enableGridX: L = !1,
    enableGridY: P = !0,
    enableAnimation: M = !0,
    gridOffsetX: W = !0,
    tooltipCallback: w,
    tickXCallback: _,
    beginZero: $ = !1,
    minY: O,
    maxY: z,
    displayNumFormat: H = A,
    _ref: K,
  }) => {
    ee.register(te, le, re, ae, se, ne, ie, oe, de, ce, me, fe, ue, ye);
    const { theme: h } = he(),
      C = (e, m, f) => (F ?? "") + H(e, m, f) + (N ?? ""),
      Q = G(
        () => ({
          responsive: !0,
          maintainAspectRatio: !1,
          normalized: !0,
          animation: {
            duration: M ? 1e3 : 0,
          },
          elements: {
            point: {
              borderWidth: 0,
              radius: 0,
              hoverRadius: 2,
            },
          },
          plugins: {
            legend: {
              display: D,
              labels: {
                usePointStyle: !0,
                pointStyle: "rect",
              },
              position: "top",
              align: "start",
            },
            tooltip: {
              enabled: !0,
              bodyFont: {
                family: "Inter",
              },
              animation: {
                duration: M ? 1e3 : 0,
              },
              mode: "index",
              intersect: !1,
              callbacks: {
                label:
                  w ||
                  function (e) {
                    return `${e.dataset.label}: ${
                      e.parsed.y !== void 0 || e.parsed.y !== null
                        ? C(e.parsed.y, "standard", j)
                        : "-"
                    }`;
                  },
              },
              filter: function (e) {
                return !!e.dataset.label;
              },
            },
            annotation: p
              ? {
                  clip: !1,
                  common: {
                    drawTime: "afterDraw",
                  },
                  annotations: t.datasets.map((e, m) => {
                    const f = {
                        year: t.labels.length - 200,
                        quarter: t.labels.length - 45,
                        month: t.labels.length - 15,
                        week: t.labels.length - 4,
                        millisecond: t.labels.length - 1,
                        second: t.labels.length - 1,
                        minute: t.labels.length - 1,
                        hour: t.labels.length - 1,
                        day: t.labels.length - 1,
                      },
                      X = n && n !== "auto" ? f[n] : t.labels.length - 1,
                      g = t.labels.length - 1;
                    return {
                      type: "label",
                      callout: {
                        display: !0,
                      },
                      content() {
                        let a = e.label;
                        return a.length > 25 && (a = a.slice(0, 25).concat("..")), a;
                      },
                      font: {
                        family: "Inter",
                        style: "normal",
                        lineHeight: 1,
                        weight: "400",
                        size: 12,
                      },
                      color: e.borderColor,
                      position: {
                        x: "start",
                        y: "center",
                      },
                      xAdjust: 0,
                      xValue: t.labels[X],
                      yAdjust: t.datasets.reduce(
                        (a, Z) => (Math.abs(Z.data[g] - e.data[g]) < 3 ? a + 1 : a),
                        -1
                      ),
                      yValue: e.data[g],
                    };
                  }),
                }
              : !1,
            crosshair: B
              ? {
                  line: {
                    width: 0,
                    color: h === "light" ? "#000" : "#FFF",
                    dashPattern: [6, 4],
                  },
                  zoom: {
                    enabled: !1,
                  },
                  sync: {
                    enabled: !1,
                  },
                }
              : !1,
            datalabels: !1,
          },
          layout: {
            padding: {
              right: p ? 160 : 0,
              top: p ? 20 : 0,
            },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: s === "auto" ? V : s,
                round: n === "auto" ? U : n,
                displayFormats: {
                  quarter: "qQ yyyy",
                  month: "MMM",
                  week: "dd MMM",
                },
                tooltipFormat:
                  b ||
                  (["year", "month", "quarter", "day"].includes(s)
                    ? { quarter: "qQ yyyy", month: "MMM yyyy", year: "yyyy", day: "dd MMM" }[s]
                    : "dd MMM yyyy"),
              },
              grid: {
                offset: W,
                display: L,
                borderWidth: 1,
                borderDash: [5, 10],
              },
              ticks: {
                callback: _,
                major: {
                  enabled: !0,
                },
                minRotation: 0,
                maxRotation: 0,
                font: {
                  family: "Inter",
                },
              },
              stacked: y === "stacked",
            },
            y: {
              grid: {
                display: P,
                borderWidth: 1,
                borderDash(e) {
                  return e.tick.value === 0 ? [0, 0] : [5, 5];
                },
                drawTicks: !1,
                drawBorder: !1,
                color: h === "light" ? I.OUTLINE : I.WASHED_DARK,
                offset: !1,
                lineWidth(e) {
                  return e.tick.value === 0 ? 2 : 1;
                },
              },
              ticks: {
                padding: 6,
                callback: e => e && C(e, "compact", j),
                font: {
                  family: "Inter",
                },
              },
              min: O,
              max: z,
              stacked: y === "stacked",
              beginAtZero: $,
            },
            ...(q
              ? {
                  y1: {
                    position: "right",
                    grid: {
                      drawOnChartArea: !1,
                      drawTicks: !1,
                      drawBorder: !1,
                      offset: !1,
                    },
                    ticks: {
                      padding: 6,
                      callback: e => A(e).concat("%"),
                      font: {
                        family: "Inter",
                      },
                    },
                    stacked: y === "stacked",
                  },
                }
              : {}),
            ...v,
          },
        }),
        [t, s, h]
      ),
      V = S(() => t.labels && (t.labels.length > 200 ? "month" : "day"), [t.labels]),
      U = S(() => t.labels && (t.labels.length > 720 ? "week" : "day"), [t.labels]);
    return /* @__PURE__ */ l.jsxs("div", {
      children: [
        c
          ? /* @__PURE__ */ l.jsx("div", {
              className: T("flex items-center justify-center", i),
              children: /* @__PURE__ */ l.jsx(ge, { loading: c }),
            })
          : /* @__PURE__ */ l.jsxs("div", {
              className: "flex flex-col gap-y-6",
              children: [
                /* @__PURE__ */ l.jsxs("div", {
                  className: "flex flex-col gap-y-3",
                  children: [
                    /* @__PURE__ */ l.jsx(Y, { title: o, menu: u, controls: d, state: R }),
                    x && /* @__PURE__ */ l.jsx(xe, { data: x }),
                    k && /* @__PURE__ */ l.jsx("div", { children: k }),
                  ],
                }),
                /* @__PURE__ */ l.jsx("div", {
                  className: i,
                  children: /* @__PURE__ */ l.jsx(pe, {
                    ref: K,
                    data: t,
                    options: Q(),
                    type: E,
                    plugins: [
                      {
                        id: "increase-legend-spacing",
                        beforeInit(e) {
                          const m = e.legend.fit;
                          e.legend.fit = function () {
                            m.bind(e.legend)(), (this.height += 20);
                          };
                        },
                      },
                    ],
                  }),
                }),
              ],
            }),
        r && /* @__PURE__ */ l.jsx("p", { className: "text-dim pt-4 text-sm", children: r }),
      ],
    });
  },
  be = {
    labels: [1111111111111, 15794784e5],
    // x-values - must be epoch millis eg. [168231311000, 16856172321, ...] etc
    datasets: [
      // stacked y-values
      {
        type: "line",
        label: "Moving Average (MA)",
        data: [1, 2, 3],
        // y-values
        borderColor: "red",
      },
      {
        type: "bar",
        label: "Primary",
        data: [4, 5, 6],
        // y-values
        backgroundColor: "blue",
      },
      {
        type: "bar",
        label: "Booster 1",
        data: [1, 2, 3],
        // y-values
        backgroundColor: "teal",
      },
      {
        type: "bar",
        label: "Booster 2",
        data: [10, 11, 12],
        // y-values
        backgroundColor: "green",
      },
    ],
  },
  xe = ({ data: i, className: u }) =>
    /* @__PURE__ */ l.jsx("div", {
      className: T("flex flex-row space-x-6 lg:space-x-8", u),
      children: i.map(({ title: o, value: r, tooltip: d }) =>
        /* @__PURE__ */ l.jsxs(
          "div",
          {
            children: [
              /* @__PURE__ */ l.jsx("p", { className: "text-dim text-sm", children: o }),
              d
                ? /* @__PURE__ */ l.jsx(J, {
                    tip: d,
                    children: c =>
                      /* @__PURE__ */ l.jsx(l.Fragment, {
                        children: /* @__PURE__ */ l.jsx("p", {
                          className: "font-medium underline decoration-dashed underline-offset-4",
                          onClick: () => c(),
                          children: r,
                        }),
                      }),
                  })
                : r &&
                  /* @__PURE__ */ l.jsx("p", {
                    className: "text-lg font-medium dark:text-white",
                    children: r,
                  }),
            ],
          },
          `${o}_${r}`
        )
      ),
    });
export { xe as Stats, ve as default };
