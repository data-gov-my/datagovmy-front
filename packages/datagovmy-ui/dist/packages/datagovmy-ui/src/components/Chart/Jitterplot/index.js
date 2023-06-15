import { j as c } from "../../../../../../external/react/jsx-runtime.js";
import { useCallback as E, useMemo as v } from "react";
import {
  Chart as k,
  LinearScale as R,
  PointElement as j,
  LineElement as w,
  Tooltip as L,
} from "../../../../../../external/chart.js/dist/chart.js";
import { Bubble as A } from "../../../../../../external/react-chartjs-2/dist/index.js";
import N from "../ChartHeader/index.js";
import { CountryAndStates as x, AKSARA_COLOR as W } from "../../../lib/constants.js";
const I = ({
    title: r,
    data: e = _,
    className: o,
    active: s = "",
    actives: h = [],
    formatTitle: u,
    formatTooltip: b,
  }) =>
    /* @__PURE__ */ c.jsxs("div", {
      children: [
        /* @__PURE__ */ c.jsx(N, { title: r, className: "z-10" }),
        /* @__PURE__ */ c.jsx("div", {
          className: ["space-y-2 pt-3", o].join(" "),
          children: e.map((a, y) =>
            /* @__PURE__ */ c.jsx(
              S,
              {
                data: a,
                active: s,
                actives: h,
                formatTitle: u,
                formatTooltip: b,
              },
              y
            )
          ),
        }),
      ],
    }),
  S = ({ data: r, active: e, actives: o, formatTitle: s, formatTooltip: h }) => {
    k.register(R, j, w, L);
    const u = {
        backgroundColor: r.data.length < 20 ? "#E0E0E0" : "#EEEEEE",
        radius: 5,
        hoverRadius: 1,
      },
      b = {
        plugins: {
          legend: {
            display: !1,
            position: "chartArea",
            align: "start",
          },
          tooltip: {
            external: B,
            position: "nearest",
            displayColors: !1,
            enabled: !1,
            bodyFont: {
              family: "Inter",
              size: 14,
            },
            callbacks: {
              label: function (t) {
                return t.raw.id
                  ? h
                    ? h(r.key, t.raw.tooltip)
                      ? `${t.raw.id}: ${h(r.key, t.raw.tooltip)}`
                      : t.raw.id
                    : `${t.raw.id}: ${t.raw.tooltip}`
                  : "";
              },
            },
          },
          crosshair: !1,
          datalabels: !1,
        },
        maintainAspectRatio: !1,
        responsive: !0,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            display: !1,
            max: 1.01,
            min: -1.01,
          },
          y: {
            display: !1,
            beginAtZero: !0,
          },
        },
      },
      a = E(
        ({ raw: t }) => {
          if (e.toLowerCase().includes(t == null ? void 0 : t.id.toLowerCase()))
            return { backgroundColor: W.BLACK, radius: 6, hoverRadius: 1 };
          switch (o.findIndex(n => n.toLowerCase().includes(t.id.toLowerCase()))) {
            case 0:
              return { backgroundColor: "#DC2626", radius: 6, hoverRadius: 1 };
            case 1:
              return { backgroundColor: "#2563EB", radius: 6, hoverRadius: 1 };
            case 2:
              return { backgroundColor: "#FBBF24", radius: 6, hoverRadius: 1 };
            default:
              return u;
          }
        },
        [o, e]
      ),
      y = v(() => {
        let t = {
          actives: [],
          default: [],
        };
        return (
          r.data.forEach(p => {
            [e, ...o].some(n => n.split(",")[0].includes(p.id))
              ? t.actives.push(p)
              : t.default.push(p);
          }),
          t
        );
      }, [o, e]);
    return /* @__PURE__ */ c.jsx(c.Fragment, {
      children:
        r.data[0].x !== null &&
        /* @__PURE__ */ c.jsxs("div", {
          className: "grid w-full grid-cols-1 items-center gap-1 lg:grid-cols-5",
          children: [
            /* @__PURE__ */ c.jsx("p", { className: "bg-white", children: s ? s(r.key) : r.key }),
            /* @__PURE__ */ c.jsx("div", {
              className: "col-span-1 overflow-visible lg:col-span-4",
              children: /* @__PURE__ */ c.jsx(A, {
                className: "bg-outline/20 h-10 overflow-visible rounded-full border px-4",
                options: b,
                data: {
                  datasets: [
                    {
                      data: y.actives,
                      borderWidth: 0,
                      backgroundColor(t) {
                        return a(t).backgroundColor;
                      },
                      radius(t) {
                        return a(t).radius;
                      },
                      hoverRadius(t) {
                        return a(t).hoverRadius;
                      },
                      order: 0,
                    },
                    {
                      data: y.default,
                      borderWidth: 0,
                      backgroundColor: u.backgroundColor,
                      radius: u.radius,
                      hoverRadius: u.hoverRadius,
                      order: 1,
                    },
                  ],
                },
              }),
            }),
          ],
        }),
    });
  },
  T = Array(Object.keys(x).length)
    .fill(0)
    .map((r, e) => ({
      x: Math.floor(Math.random() * 100 + 0),
      y: Math.floor(Math.random() * 100 + 0),
      id: Object.values(x)[e],
      tooltip: 1,
    })),
  C = ["Land area", "Population Density", "Household income", "Access to electricity"],
  _ = Array(C.length)
    .fill(0)
    .map((r, e) => ({ key: C[e], data: T })),
  z = r => {
    let e = r.canvas.parentNode.querySelector("div");
    if (!e) {
      (e = document.createElement("div")),
        (e.style.background = "rgba(0, 0, 0, 0.7)"),
        (e.style.borderRadius = "3px"),
        (e.style.color = "white"),
        (e.style.opacity = 1),
        (e.style.pointerEvents = "none"),
        (e.style.position = "absolute"),
        (e.style.transform = "translate(-50%, 0)"),
        (e.style.transition = "all .1s ease"),
        (e.style.zIndex = 20),
        (e.style.width = "max-content");
      const o = document.createElement("table");
      (o.style.margin = "0px"), e.appendChild(o), r.canvas.parentNode.appendChild(e);
    }
    return e;
  },
  B = r => {
    const { chart: e, tooltip: o } = r,
      s = z(e);
    if (o.opacity === 0) {
      s.style.opacity = 0;
      return;
    }
    if (o.body) {
      const b = o.title || [],
        a = o.body.map(n => n.lines),
        y = document.createElement("thead");
      b.forEach(n => {
        const l = document.createElement("tr");
        l.style.borderWidth = "0";
        const d = document.createElement("th");
        d.style.borderWidth = "0";
        const i = document.createTextNode(n);
        d.appendChild(i), l.appendChild(d), y.appendChild(l);
      });
      const t = document.createElement("tbody");
      if (a.length > 5) {
        for (let i = 0; i < 5; i++) {
          const m = document.createElement("tr");
          (m.style.backgroundColor = "inherit"), (m.style.borderWidth = "0");
          const f = document.createElement("td");
          (f.style.borderWidth = "0"), (f.style.fontSize = "14px");
          const g = document.createTextNode(a[i]);
          f.appendChild(g), m.appendChild(f), t.appendChild(m);
        }
        const n = document.createElement("tr");
        (n.style.backgroundColor = "inherit"), (n.style.borderWidth = "0");
        const l = document.createElement("td");
        (l.style.borderWidth = "0"), (l.style.fontSize = "14px");
        const d = document.createTextNode(`and ${a.length - 5} more.`);
        l.appendChild(d), n.appendChild(l), t.appendChild(n);
      } else
        a.forEach((n, l) => {
          o.labelColors[l];
          const d = document.createElement("tr");
          (d.style.backgroundColor = "inherit"), (d.style.borderWidth = "0");
          const i = document.createElement("td");
          (i.style.borderWidth = "0"), (i.style.fontSize = "14px");
          const m = document.createTextNode(n);
          i.appendChild(m), d.appendChild(i), t.appendChild(d);
        });
      const p = s.querySelector("table");
      for (; p.firstChild; ) p.firstChild.remove();
      p.appendChild(y), p.appendChild(t);
    }
    const { offsetLeft: h, offsetTop: u } = e.canvas;
    (s.style.opacity = 1),
      (s.style.left = h + o.caretX + "px"),
      (s.style.top = u + o.caretY + "px"),
      (s.style.font = o.options.bodyFont.string),
      (s.style.padding = o.options.padding + "px " + o.options.padding + "px");
  };
export { I as default };
