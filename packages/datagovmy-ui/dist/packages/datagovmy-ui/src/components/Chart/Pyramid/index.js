import { j as e } from "../../../../../../external/react/jsx-runtime.js";
import { useRef as M, useMemo as v } from "react";
import C from "../ChartHeader/index.js";
import {
  Chart as w,
  CategoryScale as A,
  LinearScale as E,
  PointElement as B,
  BarElement as F,
  Tooltip as I,
} from "../../../../../../external/chart.js/dist/chart.js";
import { Bar as R } from "../../../../../../external/react-chartjs-2/dist/index.js";
import { numFormat as D } from "../../../../../../helpers.js";
const X = ({
    className: s = "w-full h-full",
    // manage CSS here
    menu: i,
    title: n,
    controls: d,
    state: c,
    unitX: P,
    unitY: f,
    precision: u,
    data: t = L,
    enableLegend: m = !1,
    enableGridX: p = !0,
    enableGridY: b = !1,
    minX: h,
    maxX: x,
    _ref: g,
  }) => {
    const y = M();
    w.register(A, E, B, F, I);
    const l = (a, r) => D(a, r, u) + (f ?? ""),
      o = v(() => {
        let a = [];
        return (
          t.datasets.forEach(r => {
            a = a.concat(r.data.map(j => Math.abs(j)));
          }),
          Math.max(...a)
        );
      }, [t]),
      k = {
        indexAxis: "y",
        maintainAspectRatio: !1,
        responsive: !0,
        plugins: {
          legend: {
            display: m,
            position: "chartArea",
            align: "start",
          },
          tooltip: {
            bodyFont: {
              family: "Inter",
            },
            callbacks: {
              label: function (a) {
                return `${a.dataset.label} : ${
                  a.parsed.x ? l(Math.abs(a.parsed.x), "standard") : "-"
                }`;
              },
            },
          },
          crosshair: !1,
          annotation: !1,
          datalabels: !1,
        },
        scales: {
          x: {
            type: "linear",
            grid: {
              display: p,
              borderWidth: 1,
              borderDash: [5, 10],
            },
            ticks: {
              font: {
                family: "Inter",
              },
              padding: 6,
              callback: function (a) {
                return l(Math.abs(a), "compact");
              },
            },
            stacked: !0,
            min: h ?? -1 * o,
            max: x ?? o,
          },
          y: {
            reverse: !0,
            grid: {
              display: b,
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
              callback: function (a) {
                return this.getLabels()[a].replace("-above", "+");
              },
            },
            beginAtZero: !0,
            stacked: !0,
          },
        },
      };
    return /* @__PURE__ */ e.jsxs("div", {
      className: s,
      children: [
        /* @__PURE__ */ e.jsx(C, { title: n, menu: i, controls: d, state: c }),
        /* @__PURE__ */ e.jsx("div", {
          className: s,
          children: /* @__PURE__ */ e.jsx(R, { ref: g ?? y, data: t, options: k }),
        }),
      ],
    });
  },
  L = {
    labels: ["0-4", "5-10", "11-14", "15-19", "20-24", "25-29", "30-34", "35-39"],
    // x-values
    datasets: [
      // grouped y-values
      {
        label: "Male",
        data: [1, 2, 3, 4, 5, 6, 7, 8],
        // y-values
        fill: !0,
        backgroundColor: "#000",
      },
      {
        label: "Female",
        data: [-1, -2, -3, -4, -5, -6, -7, -8],
        // y-values
        fill: !0,
        backgroundColor: "#a4a4a4",
      },
    ],
  };
export { X as default };
