import { j as e } from "../../../../../../external/react/jsx-runtime.js";
import w from "../ChartHeader/index.js";
import { numFormat as h, clx as g } from "../../../../../../helpers.js";
import j from "../../../../../../external/@heroicons/react/24/solid/esm/ArrowRightIcon.js";
const H = ({ title: r, className: t = "", menu: i, controls: m, data: s, state: n }) =>
    /* @__PURE__ */ e.jsxs("div", {
      children: [
        /* @__PURE__ */ e.jsx(w, { title: r, menu: i, controls: m, state: n }),
        /* @__PURE__ */ e.jsxs("div", {
          className: t,
          children: [
            (s == null ? void 0 : s.header) &&
              /* @__PURE__ */ e.jsxs("div", {
                className:
                  "bg-washed dark:bg-washed-dark m-auto w-fit min-w-[200px] rounded px-3 py-1.5 text-center",
                children: [
                  /* @__PURE__ */ e.jsx("span", {
                    className: "text-dim text-xs",
                    children: s.header.name,
                  }),
                  /* @__PURE__ */ e.jsxs("div", {
                    className: "flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ e.jsx("span", {
                        className: "text-xl dark:text-white",
                        children: h(s.header.value, "standard"),
                      }),
                      /* @__PURE__ */ e.jsxs("small", {
                        className: g(
                          "inline-block rounded bg-opacity-20 px-1.5",
                          N(s.header.delta, s.header.inverse)
                        ),
                        children: [p(s.header.delta), h(s.header.delta, "standard")],
                      }),
                    ],
                  }),
                ],
              }),
            /* @__PURE__ */ e.jsxs("div", {
              className: "mt-6 grid h-full grid-cols-1 lg:grid-cols-3",
              children: [
                /* @__PURE__ */ e.jsx("ul", {
                  className: "m-auto space-y-10",
                  children:
                    s == null
                      ? void 0
                      : s.col_1.map(
                          ({ name: l, icon: x, value: c, delta: a, unit: o, inverse: d }) =>
                            c &&
                            /* @__PURE__ */ e.jsx(
                              "li",
                              {
                                children: /* @__PURE__ */ e.jsx(f, {
                                  name: l,
                                  value: c,
                                  delta: a,
                                  icon: x,
                                  unit: o,
                                  inverse: d,
                                }),
                              },
                              l
                            )
                        ),
                }),
                /* @__PURE__ */ e.jsxs("div", {
                  className: "flex flex-col justify-center lg:flex-row",
                  children: [
                    /* @__PURE__ */ e.jsx(u, {
                      arrowLeft: /* @__PURE__ */ e.jsx("div", {
                        className: "flex h-full w-full items-center justify-center lg:w-auto",
                        children: /* @__PURE__ */ e.jsx(j, {
                          className: "text-dim my-3 h-5 w-5 rotate-90 lg:mr-3 lg:rotate-0",
                        }),
                      }),
                    }),
                    /* @__PURE__ */ e.jsx("div", {
                      className: "w-full lg:flex-grow",
                      children: /* @__PURE__ */ e.jsx("ul", {
                        className:
                          "flex flex-row flex-wrap justify-evenly gap-12 py-7 lg:mx-auto lg:block lg:w-fit lg:gap-0 lg:space-y-10 lg:py-0",
                        children:
                          s == null
                            ? void 0
                            : s.col_2.map(
                                ({ name: l, icon: x, value: c, delta: a, unit: o, inverse: d }) =>
                                  c !== null &&
                                  /* @__PURE__ */ e.jsx(
                                    "li",
                                    {
                                      children: /* @__PURE__ */ e.jsx(f, {
                                        name: l,
                                        value: c,
                                        delta: a,
                                        icon: x,
                                        unit: o,
                                        iconPlacement: "left",
                                        inverse: d,
                                      }),
                                    },
                                    l
                                  )
                              ),
                      }),
                    }),
                    /* @__PURE__ */ e.jsx(u, {
                      className: "rotate-180",
                      arrowRight: /* @__PURE__ */ e.jsxs("div", {
                        className: "flex h-full flex-row justify-evenly pl-3 lg:flex-col",
                        children: [
                          /* @__PURE__ */ e.jsx(j, {
                            className: "text-dim my-3 h-5 w-5 rotate-90 lg:mr-3 lg:rotate-0",
                          }),
                          /* @__PURE__ */ e.jsx(j, {
                            className: "text-dim my-3 h-5 w-5 rotate-90 lg:mr-3 lg:rotate-0",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                /* @__PURE__ */ e.jsx("ul", {
                  className: "m-auto space-y-10",
                  children:
                    s == null
                      ? void 0
                      : s.col_3.map(
                          ({ name: l, icon: x, value: c, delta: a, unit: o, inverse: d }) =>
                            c &&
                            /* @__PURE__ */ e.jsx(
                              "li",
                              {
                                children: /* @__PURE__ */ e.jsx(f, {
                                  name: l,
                                  value: c,
                                  delta: a,
                                  icon: x,
                                  unit: o,
                                  inverse: d,
                                }),
                              },
                              l
                            )
                        ),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  f = ({
    className: r = "",
    name: t,
    icon: i,
    iconPlacement: m = "top",
    value: s,
    delta: n = 0,
    unit: l = void 0,
    inverse: x = !1,
  }) =>
    /* @__PURE__ */ e.jsxs("div", {
      className: g(
        "flex",
        r,
        m === "top"
          ? "flex-col items-center space-y-4"
          : "flex-col items-center lg:flex-row lg:items-start lg:space-x-4"
      ),
      children: [
        i && i,
        /* @__PURE__ */ e.jsxs("div", {
          className: g(
            "flex flex-col",
            m === "top" ? "items-center" : "items-center lg:items-start"
          ),
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-dim text-xs", children: t }),
            /* @__PURE__ */ e.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ e.jsx("span", {
                  className: "text-xl",
                  children: s && h(s, "standard"),
                }),
                /* @__PURE__ */ e.jsxs("small", {
                  className: g(
                    "inline-block rounded px-1.5",
                    l
                      ? "bg-washed dark:bg-washed-dark text-gray-500"
                      : N(n, x).concat(" bg-opacity-20")
                  ),
                  children: [!l && p(n), n && h(n, "standard", 1), l],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  p = r => (r > 0 ? "+" : ""),
  N = (r, t = !1) =>
    t
      ? r > 0
        ? "bg-red-400 text-red-500"
        : "bg-green-400 text-green-500"
      : r > 0
      ? "bg-green-400 text-green-500"
      : "bg-red-400 text-red-500",
  u = ({ className: r = "", arrowLeft: t, arrowRight: i }) =>
    /* @__PURE__ */ e.jsxs(e.Fragment, {
      children: [
        t && t,
        /* @__PURE__ */ e.jsxs("div", {
          className: `relative ${r}`,
          children: [
            /* @__PURE__ */ e.jsx("div", {
              className: "bg-outline dark:bg-outlineHover-dark h-1 lg:h-full lg:w-1",
            }),
            /* @__PURE__ */ e.jsx("div", {
              className:
                "bg-outline dark:bg-outlineHover-dark absolute left-0 top-0 h-2 w-1 rounded-xl lg:h-1 lg:w-2",
            }),
            /* @__PURE__ */ e.jsx("div", {
              className:
                "bg-outline dark:bg-outlineHover-dark absolute bottom-0 right-0 top-0 h-2 w-1 lg:left-0 lg:top-full lg:h-1 lg:w-2",
            }),
          ],
        }),
        i && i,
      ],
    });
export { H as default };
