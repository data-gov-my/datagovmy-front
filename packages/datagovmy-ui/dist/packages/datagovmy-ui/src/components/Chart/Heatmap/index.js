import { j as o } from "../../../../../../external/react/jsx-runtime.js";
import { useMemo as b } from "react";
import {
  Chart as j,
  LinearScale as v,
  CategoryScale as A,
  TimeScale as I,
  Tooltip as S,
} from "../../../../../../external/chart.js/dist/chart.js";
import { Chart as w } from "../../../../../../external/react-chartjs-2/dist/index.js";
import {
  MatrixController as M,
  MatrixElement as X,
} from "../../../../../../external/chartjs-chart-matrix/dist/chartjs-chart-matrix.esm.js";
import Y from "../../../../../../external/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.esm.js";
import $ from "../ChartHeader/index.js";
import { useColor as B } from "../../../hooks/useColor.js";
import "../../../../../../external/chartjs-adapter-luxon/dist/chartjs-adapter-luxon.esm.js";
import { minMax as Z, normalize as _, numFormat as k } from "../../../../../../helpers.js";
const K = ({
    className: m = "h-[400px]",
    title: p,
    data: e = q,
    menu: u,
    state: d,
    color: x = "blues",
    prefix: c,
    unit: y,
    controls: f,
    _ref: h,
  }) => {
    j.register(M, X, v, A, I, S, Y);
    const [n, l, s, i] = b(() => {
        if (!e) return [0, 1, [], []];
        const [r, t] = Z(e.map(a => a.z));
        return [r, t, [...new Set(e.map(a => a.x))], [...new Set(e.map(a => a.y))]];
      }, [e]),
      { interpolate: g } = B(x, [n, l]),
      z = (r, t, a) => (c ?? "") + k(r, t, a) + (y ?? ""),
      C = {
        maintainAspectRatio: !1,
        plugins: {
          legend: {
            display: !1,
          },
          datalabels: {
            display: !0,
            color(r) {
              return e[r.dataIndex].z === null
                ? "#000"
                : _(e[r.dataIndex].z, n, l) > 0.7
                ? "#fff"
                : "#000";
            },
            formatter(r) {
              return r.z;
            },
          },
          tooltip: {
            bodyFont: {
              family: "Inter",
            },
            callbacks: {
              title() {
                return "";
              },
              label(r) {
                const t = e[r.dataIndex];
                return `${t.y}, ${t.x}: ${t.z === null ? "No data" : z(t.z, "standard", [1, 1])}`;
              },
            },
          },
          crosshair: !1,
          annotation: !1,
        },
        scales: (() => ({
          x: {
            type: "category",
            labels: s,
            grid: {
              display: !1,
            },
          },
          y: {
            type: "category",
            labels: i.slice().reverse(),
            offset: !0,
            grid: {
              display: !1,
            },
          },
        }))(),
      };
    return /* @__PURE__ */ o.jsxs("div", {
      children: [
        /* @__PURE__ */ o.jsx($, { title: p, menu: u, controls: f, state: d }),
        /* @__PURE__ */ o.jsx("div", {
          className: m,
          children: /* @__PURE__ */ o.jsx(w, {
            ref: h,
            type: "matrix",
            data: {
              datasets: [
                {
                  data: e,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.5)",
                  backgroundColor(r) {
                    return g(r.dataset.data[r.dataIndex].z);
                  },
                  width: ({ chart: r }) => (r.chartArea || {}).width / s.length - 1,
                  height: ({ chart: r }) => (r.chartArea || {}).height / i.length - 1,
                },
              ],
            },
            options: C,
          }),
        }),
      ],
    });
  },
  q = [
    { x: "A", y: "X", z: 11 },
    { x: "A", y: "Y", z: 12 },
    { x: "A", y: "Z", z: 13 },
    { x: "B", y: "X", z: 21 },
    { x: "B", y: "Y", z: 22 },
    { x: "B", y: "Z", z: 23 },
    { x: "C", y: "X", z: 31 },
    { x: "C", y: "Y", z: 32 },
    { x: "C", y: "Z", z: 33 },
  ];
export { K as default };
