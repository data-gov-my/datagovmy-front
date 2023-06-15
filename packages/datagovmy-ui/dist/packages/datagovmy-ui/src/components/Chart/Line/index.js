import { j as a } from "../../../../../../external/react/jsx-runtime.js";
import A from "../ChartHeader/index.js";
import {
  Chart as E,
  CategoryScale as I,
  LinearScale as N,
  PointElement as $,
  LineElement as z,
  TimeScale as D,
  TimeSeriesScale as M,
  Filler as R,
  Tooltip as W,
  Legend as _,
} from "../../../../../../external/chart.js/dist/chart.js";
import B from "../../../../../../external/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.esm.js";
import { Line as H } from "../../../../../../external/react-chartjs-2/dist/index.js";
import { numFormat as l } from "../../../../../../helpers.js";
import { Stats as q } from "../Timeseries/index.js";
import G from "../../../../../../external/chartjs-plugin-crosshair/dist/chartjs-plugin-crosshair.esm.js";
import { useTheme as J } from "../../../../../../external/next-themes/dist/index.module.js";
const le = ({
    className: r = "relative w-full h-[500px]",
    // manage CSS here
    menu: d,
    controls: m,
    subheader: i,
    title: f,
    state: c,
    type: p = "linear",
    prefixX: g,
    prefixY: n,
    unitX: u,
    unitY: s,
    data: x = K,
    enableGridX: h = !0,
    enableGridY: y = !0,
    precision: t = 1,
    minY: b,
    maxY: j,
    stats: o,
    annotation: v = null,
    graceX: S = 0,
    enableTooltip: k = !1,
    enableCrosshair: F = !1,
    enableLegend: L = !1,
    _ref: C,
  }) => {
    E.register(I, N, $, z, D, M, R, W, G, B, _);
    const { theme: T } = J(),
      w = {
        maintainAspectRatio: !1,
        responsive: !0,
        normalized: !0,
        plugins: {
          legend: {
            display: L,
            labels: {
              usePointStyle: !0,
              pointStyle: "rect",
            },
            position: "top",
            align: "start",
          },
          crosshair: F
            ? {
                line: {
                  width: 0,
                  color: T === "light" ? "#000" : "#FFF",
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
          tooltip: {
            enabled: k,
            callbacks: {
              label: e =>
                `${e.dataset.label}: ${
                  e.parsed.y !== void 0 || e.parsed.y !== null
                    ? (n ?? "") + l(e.parsed.y, "standard", t) + (s ?? "")
                    : "-"
                }`,
            },
          },
          annotation: {
            annotations: { annotation: v },
          },
        },
        scales: {
          x: {
            type: p,
            grace: S,
            grid: {
              display: h,
              borderWidth: 1,
              borderDash: [5, 10],
            },
            ticks: {
              font: {
                family: "Inter",
              },
              padding: 6,
              callback: e => (g ?? "") + l(e, "standard", t) + (u ?? ""),
            },
          },
          y: {
            grid: {
              display: y,
              borderWidth: 1,
              borderDash: [5, 5],
              drawTicks: !1,
              drawBorder: !1,
              offset: !1,
            },
            ticks: {
              font: {
                family: "Inter",
              },
              padding: 6,
              callback: e => (n ?? "") + l(e, "compact", t) + (s ?? ""),
            },
            min: b,
            max: j,
          },
        },
      };
    return /* @__PURE__ */ a.jsxs("div", {
      className: "flex flex-col gap-y-6",
      children: [
        /* @__PURE__ */ a.jsxs("div", {
          className: "flex flex-col gap-y-3",
          children: [
            /* @__PURE__ */ a.jsx(A, { title: f, menu: d, controls: m, state: c }),
            i && /* @__PURE__ */ a.jsx("div", { className: "text-dim text-sm", children: i }),
            o && /* @__PURE__ */ a.jsx(q, { data: o }),
          ],
        }),
        /* @__PURE__ */ a.jsx("div", {
          className: r,
          children: /* @__PURE__ */ a.jsx(H, {
            ref: C,
            options: w,
            data: x,
            plugins: [
              {
                id: "increase-legend-spacing",
                beforeInit(e) {
                  const P = e.legend.fit;
                  e.legend.fit = function () {
                    P.bind(e.legend)(), (this.height += 20);
                  };
                },
              },
            ],
          }),
        }),
      ],
    });
  },
  K = {
    labels: [1, 2, 3],
    // x-values
    datasets: [
      // stacked y-values
      {
        type: "line",
        label: "Moving Average (MA)",
        data: [1, 2, 3],
        // y-values
        fill: !0,
        backgroundColor: "#000",
      },
    ],
  };
export { le as default };
