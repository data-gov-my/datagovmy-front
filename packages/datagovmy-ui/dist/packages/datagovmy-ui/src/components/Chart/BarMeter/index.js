import { j as s } from "../../../../../../external/react/jsx-runtime.js";
import { useMemo as b } from "react";
import k from "../ChartHeader/index.js";
import { CountryAndStates as o } from "../../../lib/constants.js";
import { clx as $, numFormat as x, limitMax as F, maxBy as z } from "../../../../../../helpers.js";
import _ from "next/image";
const R = ({
    className: f = "relative",
    title: u,
    menu: w,
    controls: y,
    state: m,
    max: j = 100,
    data: r = A,
    layout: h = "vertical",
    unit: t = "",
    sort: a = void 0,
    relative: v = !1,
    formatY: c,
    formatX: i,
  }) => {
    const g = () => (v ? z(r, "y").y : j),
      d = e => `${F((e / g()) * 100)}%`,
      n = b(
        () =>
          a
            ? typeof a == "string"
              ? r.sort((e, l) => (a === "asc" ? e.y - l.y : l.y - e.y))
              : r.sort(a)
            : r,
        [r, a]
      ),
      p = {
        "horizontal": "flex flex-col w-full space-y-3",
        "state-horizontal": "flex flex-col w-full space-y-2",
        "vertical": "flex flex-col lg:flex-row justify-around lg:h-[400px] ",
      },
      N = (e, l) => {
        switch (h) {
          case "horizontal":
            return /* @__PURE__ */ s.jsxs(
              "div",
              {
                className: "space-y-2",
                children: [
                  /* @__PURE__ */ s.jsxs("div", {
                    className: "flex justify-between",
                    children: [
                      /* @__PURE__ */ s.jsx("p", {
                        className: "text-sm",
                        children: i ? i(e.x) : e.x,
                      }),
                      /* @__PURE__ */ s.jsxs("div", {
                        className: "text-dim text-sm dark:text-white",
                        children: [
                          c
                            ? c(e.y, e.x)
                            : /* @__PURE__ */ s.jsx("p", {
                                className: "inline",
                                children: x(e.y, "standard", 1),
                              }),
                          t,
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ s.jsx("div", {
                    className:
                      "bg-washed dark:bg-washed-dark flex h-3 w-full overflow-x-hidden rounded-full",
                    children: /* @__PURE__ */ s.jsx("div", {
                      className:
                        "animate-slide h-full w-0 items-center overflow-hidden rounded-full bg-black dark:bg-white",
                      style: {
                        ["--from-width"]: 0,
                        ["--to-width"]: d(e.y),
                        width: d(e.y),
                      },
                    }),
                  }),
                ],
              },
              e.x.concat(`_${l}`)
            );
          case "state-horizontal":
            return /* @__PURE__ */ s.jsxs(
              "div",
              {
                className: "flex w-full items-center",
                children: [
                  /* @__PURE__ */ s.jsxs("div", {
                    className: "flex w-[40%] items-center gap-2 lg:w-[35%]",
                    children: [
                      /* @__PURE__ */ s.jsx(_, {
                        src: `/static/images/states/${e.x}.jpeg`,
                        width: 20,
                        height: 12,
                        alt: o[e.x],
                      }),
                      /* @__PURE__ */ s.jsx("p", {
                        className: "text-dim truncate text-sm dark:text-white",
                        children: o[e.x],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ s.jsxs("div", {
                    className: "flex flex-grow items-center gap-2",
                    children: [
                      /* @__PURE__ */ s.jsxs("p", {
                        className: "text-dim w-[40px] text-sm",
                        children: [x(e.y, "standard", [1, 1]), t],
                      }),
                      /* @__PURE__ */ s.jsx("div", {
                        className:
                          "bg-washed dark:bg-washed-dark flex h-3 w-full overflow-x-hidden rounded-full",
                        children: /* @__PURE__ */ s.jsx("div", {
                          className:
                            "animate-slide h-full items-center overflow-hidden rounded-full bg-black transition dark:bg-white",
                          style: {
                            ["--from-width"]: 0,
                            ["--to-width"]: d(e.y),
                            width: d(e.y),
                          },
                        }),
                      }),
                    ],
                  }),
                ],
              },
              e.x.concat(`_${l}`)
            );
          default:
            return /* @__PURE__ */ s.jsxs(s.Fragment, {
              children: [
                /* @__PURE__ */ s.jsxs(
                  "div",
                  {
                    className: "hidden h-full flex-col items-center space-y-2 pt-4 lg:flex",
                    children: [
                      /* @__PURE__ */ s.jsxs("p", { children: [x(e.y, "standard", [1, 1]), t] }),
                      /* @__PURE__ */ s.jsx("div", {
                        className:
                          "bg-washed dark:bg-washed-dark relative flex h-[80%] w-6 overflow-x-hidden rounded-full",
                        children: /* @__PURE__ */ s.jsx("div", {
                          className:
                            " animate-slide absolute bottom-0 w-full items-center overflow-hidden rounded-full bg-[#0F172A] dark:bg-white",
                          style: {
                            ["--from-width"]: 0,
                            ["--to-width"]: d(e.y),
                            height: d(e.y),
                          },
                        }),
                      }),
                      /* @__PURE__ */ s.jsx("p", { children: e.x }),
                    ],
                  },
                  e.x.concat(`_${l}`)
                ),
                /* @__PURE__ */ s.jsxs(
                  "div",
                  {
                    className: "block space-y-1 pb-2 lg:hidden",
                    children: [
                      /* @__PURE__ */ s.jsxs("div", {
                        className: "flex justify-between",
                        children: [
                          /* @__PURE__ */ s.jsx("p", { children: i ? i(e.x) : e.x }),
                          /* @__PURE__ */ s.jsxs("div", {
                            className: "text-dim dark:text-white",
                            children: [c ? c(e.y, e.x) : x(e.y, "standard", 1), t],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ s.jsx("div", {
                        className:
                          "bg-washed dark:bg-washed-dark flex h-2.5 w-full overflow-x-hidden rounded-full",
                        children: /* @__PURE__ */ s.jsx("div", {
                          className:
                            "h-full items-center overflow-hidden rounded-full bg-[#0F172A] dark:bg-white",
                          style: { width: d(e.y) },
                        }),
                      }),
                    ],
                  },
                  e.x.concat(`_${l}`)
                ),
              ],
            });
        }
      };
    return /* @__PURE__ */ s.jsxs("div", {
      className: "space-y-6",
      children: [
        /* @__PURE__ */ s.jsx(k, { title: u, menu: w, controls: y, state: m }),
        /* @__PURE__ */ s.jsx("div", {
          className: $(p[h], f),
          children:
            n == null
              ? void 0
              : n.map((e, l) =>
                  /* @__PURE__ */ s.jsx("div", { className: "h-full", children: N(e, l) }, l)
                ),
        }),
      ],
    });
  },
  A = [
    {
      x: "80+",
      y: 80.6,
    },
    {
      x: "70-79",
      y: 90.8,
    },
    {
      x: "60-69",
      y: 98.4,
    },
    {
      x: "50-59",
      y: 97.6,
    },
    {
      x: "40-49",
      y: 102.3,
    },
    {
      x: "30-39",
      y: 96.4,
    },
    {
      x: "20-29",
      y: 91.2,
    },
    {
      x: "10-19",
      y: 94.7,
    },
    {
      x: "5-9",
      y: 49.9,
    },
    {
      x: "0-4",
      y: 0,
    },
  ];
export { R as default };
