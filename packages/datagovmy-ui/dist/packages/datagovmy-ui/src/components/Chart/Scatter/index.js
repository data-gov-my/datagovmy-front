import { j as s } from "../../../../../../external/react/jsx-runtime.js";
import O from "../ChartHeader/index.js";
import {
  Chart as H,
  CategoryScale as N,
  LinearScale as Y,
  LineElement as G,
  PointElement as J,
  Tooltip as Q,
  Legend as U,
} from "../../../../../../external/chart.js/dist/chart.js";
import { Scatter as V } from "../../../../../../external/react-chartjs-2/dist/index.js";
import {
  numFormat as X,
  standardDeviation as x,
  maxBy as Z,
  minBy as tt,
} from "../../../../../../helpers.js";
import { AKSARA_COLOR as h } from "../../../lib/constants.js";
import { useTheme as et } from "../../../../../../external/next-themes/dist/index.module.js";
import rt from "../../../../../../external/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.esm.js";
import at from "../../../../../../external/chartjs-plugin-crosshair/dist/chartjs-plugin-crosshair.esm.js";
const xt = ({
    className: g = "w-full h-full lg:h-[400px]",
    // manage CSS here
    menu: b,
    title: k,
    controls: w,
    state: S,
    unitX: _,
    unitY: C,
    prefixY: v,
    data: d = nt,
    enableCrosshair: M = !1,
    enableRegression: D = !1,
    enableLegend: I = !1,
    enableGridX: j = !0,
    enableGridY: B = !0,
    titleX: A,
    titleY: F,
    minX: L,
    minY: R,
    maxY: T,
    _ref: W,
  }) => {
    H.register(N, Y, G, J, Q, rt, at, U);
    const { theme: p } = et(),
      o = (t, e, a) => (v ?? "") + X(t, e, a) + (C ?? ""),
      m = t => ({
        display: !!t,
        text: t,
        color: p === "light" ? h.BLACK : h.DIM,
        font: {
          size: 14,
          family: "Inter",
          weight: "500",
        },
      }),
      f = t => {
        const { data: e } = t;
        let a = 0,
          n = 0,
          l = 0,
          i = 0,
          u = 0;
        if (e != null && e.length) {
          e.forEach(r => {
            r.y !== null &&
              ((l += r.x * r.y),
              (a += r.x),
              (n += r.y),
              (i += Math.pow(r.x, 2)),
              (u += Math.pow(r.y, 2)));
          });
          const P = l * e.length - a * n,
            $ = e.length * i - Math.pow(a, 2),
            q = e.length * u - Math.pow(n, 2),
            z = Math.sqrt($ * q),
            c =
              ((P / z) * x(e.map(({ y: r }) => (r !== null ? r : 0)))) / x(e.map(({ x: r }) => r)),
            y = n / e.length - (c * a) / e.length,
            K = Z(e, "x").x;
          return [tt(e, "x").x * c + y, K * c + y];
        }
        return [0, 0];
      },
      E = {
        maintainAspectRatio: !1,
        responsive: !0,
        plugins: {
          legend: {
            display: I,
            position: "top",
            align: "start",
            labels: {
              usePointStyle: !0,
              pointStyle: "rect",
            },
          },
          tooltip: {
            enabled: !0,
            mode: "nearest",
            bodyFont: {
              family: "Inter",
            },
            callbacks: {
              label: function (t) {
                return `${t.dataset.label}: (${o(t.parsed.x, "compact", [1, 1])}, ${o(
                  t.parsed.y,
                  "compact",
                  [1, 1]
                )})`;
              },
            },
          },
          crosshair: M
            ? {
                line: {
                  width: 0,
                  color: p === "light" ? "#000" : "#FFF",
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
          annotation: D
            ? {
                clip: !1,
                common: {
                  drawTime: "afterDatasetsDraw",
                },
                annotations: d.map(t => ({
                  id: t.label,
                  type: "line",
                  scaleID: t.label,
                  yMin: f(t)[0],
                  yMax: f(t)[1],
                  borderColor: t.backgroundColor ? t.backgroundColor + "cc" : "black",
                  display(e) {
                    var a, n, l;
                    return !(
                      (l =
                        (n = (a = e.chart.legend) == null ? void 0 : a.legendItems) == null
                          ? void 0
                          : n.find(i => i.text === t.label)) != null && l.hidden
                    );
                  },
                  borderWidth: 2,
                })),
              }
            : !1,
          datalabels: !1,
        },
        scales: {
          x: {
            title: m(A),
            type: "linear",
            grid: {
              display: j,
              borderWidth: 1,
              drawTicks: !0,
              drawBorder: !0,
              borderDash(t) {
                return t.tick.value === 0 ? [0, 0] : [5, 5];
              },
              lineWidth(t) {
                return t.tick.value === 0 ? 2 : 1;
              },
            },
            ticks: {
              font: {
                family: "Inter",
              },
              padding: 6,
              callback: function (t) {
                return o(t, "compact", 1);
              },
            },
            min: L,
          },
          y: {
            title: m(F),
            grid: {
              display: B,
              borderWidth: 1,
              drawTicks: !1,
              drawBorder: !1,
              offset: !1,
              borderDash(t) {
                return t.tick.value === 0 ? [0, 0] : [5, 5];
              },
              lineWidth(t) {
                return t.tick.value === 0 ? 2 : 1;
              },
            },
            ticks: {
              font: {
                family: "Inter",
              },
              padding: 6,
              callback: function (t) {
                return o(t, "compact", 1).concat(_ ?? "");
              },
            },
            min: R,
            max: T,
          },
        },
      };
    return /* @__PURE__ */ s.jsxs("div", {
      className: "space-y-4",
      children: [
        /* @__PURE__ */ s.jsx(O, { title: k, menu: b, controls: w, state: S }),
        /* @__PURE__ */ s.jsx("div", {
          className: g,
          children: /* @__PURE__ */ s.jsx(V, {
            ref: W,
            data: {
              datasets: d.map(({ label: t, data: e, ...a }) => ({
                label: t,
                data: e,
                ...a,
              })),
              //   ...(enableRegression
              //     ? data.map((set: ChartDataset<"scatter", any>) => yieldRegressionLine(set))
              //     : [{ data: [] }]),
              // ],
            },
            options: E,
          }),
        }),
      ],
    });
  },
  nt = [
    {
      label: "category 1",
      // label
      data: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 1,
          y: 1,
        },
        {
          x: 2,
          y: 2,
        },
        {
          x: 3,
          y: 3,
        },
        {
          x: 4,
          y: 4,
        },
      ],
    },
    {
      label: "category 2",
      data: [
        {
          x: 0,
          y: 4,
        },
        {
          x: 1,
          y: 3,
        },
        {
          x: 2,
          y: 2,
        },
        {
          x: 3,
          y: 1,
        },
        {
          x: 4,
          y: 0,
        },
      ],
    },
  ];
export { xt as default };
