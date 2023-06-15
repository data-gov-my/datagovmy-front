import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { useState as h } from "react";
import o from "../Button/index.js";
import { useTranslation as f } from "../../hooks/useTranslation.js";
import p from "../../../../../external/@heroicons/react/24/outline/esm/Bars3BottomLeftIcon.js";
import b from "../../../../../external/@heroicons/react/24/outline/esm/XMarkIcon.js";
import { Transition as u } from "../../../../../external/@headlessui/react/dist/components/transitions/transition.js";
const T = ({ children: x, categories: r, onSelect: t }) => {
  const { t: i } = f(["catalogue", "common"]),
    [d, c] = h(),
    [j, m] = h(!1),
    s = {
      base: "px-4 lg:px-5 py-1.5 w-full rounded-none leading-tight",
      active:
        "border-l-2 border-black bg-washed text-black font-medium dark:bg-washed-dark dark:text-white dark:border-white",
      default: "text-dim",
    };
  return /* @__PURE__ */ e.jsx(e.Fragment, {
    children: /* @__PURE__ */ e.jsxs("div", {
      className: "flex w-full flex-row",
      children: [
        /* @__PURE__ */ e.jsx("div", {
          className: "dark:border-r-washed-dark hidden border-r lg:block lg:w-1/5",
          children: /* @__PURE__ */ e.jsxs("ul", {
            className: "sticky top-14 flex h-[90vh] flex-col gap-2 overflow-auto pt-3",
            children: [
              /* @__PURE__ */ e.jsx("li", {
                children: /* @__PURE__ */ e.jsx("h5", {
                  className: s.base,
                  children: i("category"),
                }),
              }),
              r.length > 0
                ? r.map(([l, n]) =>
                    /* @__PURE__ */ e.jsxs(
                      "li",
                      {
                        title: l,
                        children: [
                          /* @__PURE__ */ e.jsx(o, {
                            className: [s.base, d === l ? s.active : s.default].join(" "),
                            onClick: () => {
                              c(l), t(`${l}: ${n[0]}`);
                            },
                            children: l,
                          }),
                          /* @__PURE__ */ e.jsx("ul", {
                            className: "ml-5 space-y-1",
                            children:
                              n.length &&
                              n.map(a =>
                                /* @__PURE__ */ e.jsx(
                                  "li",
                                  {
                                    title: a,
                                    children: /* @__PURE__ */ e.jsx(o, {
                                      className: [s.base, d === a ? s.active : s.default].join(" "),
                                      onClick: () => {
                                        c(a), t(`${l}: ${a}`);
                                      },
                                      children: a,
                                    }),
                                  },
                                  a
                                )
                              ),
                          }),
                        ],
                      },
                      `${l}: ${n[0]}`
                    )
                  )
                : /* @__PURE__ */ e.jsx("p", {
                    className: [s.base, "text-dim text-sm italic"].join(" "),
                    children: i("common:common.no_entries"),
                  }),
            ],
          }),
        }),
        /* @__PURE__ */ e.jsxs("div", {
          className: "relative w-full",
          children: [
            /* @__PURE__ */ e.jsxs(e.Fragment, {
              children: [
                /* @__PURE__ */ e.jsx("div", {
                  className: "pointer-events-none absolute top-20 block h-full lg:hidden",
                  children: /* @__PURE__ */ e.jsx(o, {
                    className: "btn btn-default pointer-events-auto sticky top-36 z-10",
                    icon: /* @__PURE__ */ e.jsx(p, { className: "h-4 w-4" }),
                    onClick: () => m(!0),
                    children: i("category"),
                  }),
                }),
                /* @__PURE__ */ e.jsx(u, {
                  show: j,
                  as: "div",
                  className:
                    "dark:border-washed-dark fixed left-0 top-14 z-30 flex h-screen w-2/3 flex-col border border-l-0 bg-white shadow-md dark:bg-black",
                  enter: "transition-opacity duration-75",
                  enterFrom: "opacity-0",
                  enterTo: "opacity-100",
                  leave: "transition-opacity duration-150",
                  leaveFrom: "opacity-100",
                  leaveTo: "opacity-0",
                  children: /* @__PURE__ */ e.jsxs("ul", {
                    className: "flex flex-col gap-1 overflow-auto pt-2",
                    children: [
                      /* @__PURE__ */ e.jsxs("li", {
                        className: "flex items-baseline justify-between",
                        children: [
                          /* @__PURE__ */ e.jsx("h5", {
                            className: s.base,
                            children: i("category"),
                          }),
                          /* @__PURE__ */ e.jsx(o, {
                            className: "btn btn-default mr-3 border text-sm",
                            icon: /* @__PURE__ */ e.jsx(b, { className: "h-4 w-4" }),
                            onClick: () => m(!1),
                            children: i("common:common.close"),
                          }),
                        ],
                      }),
                      r.length > 0
                        ? r.map(([l, n]) =>
                            /* @__PURE__ */ e.jsxs(
                              "li",
                              {
                                title: l,
                                children: [
                                  /* @__PURE__ */ e.jsx(o, {
                                    className: [s.base, d === l ? s.active : s.default].join(" "),
                                    onClick: () => {
                                      c(l), t(`${l}: ${n[0]}`);
                                    },
                                    children: l,
                                  }),
                                  /* @__PURE__ */ e.jsx("ul", {
                                    className: "ml-4",
                                    children:
                                      n.length &&
                                      n.map(a =>
                                        /* @__PURE__ */ e.jsx(
                                          "li",
                                          {
                                            children: /* @__PURE__ */ e.jsx(o, {
                                              className: [
                                                s.base,
                                                d === a ? s.active : s.default,
                                              ].join(" "),
                                              onClick: () => {
                                                c(a), t(`${l}: ${a}`);
                                              },
                                              children: a,
                                            }),
                                          },
                                          a
                                        )
                                      ),
                                  }),
                                ],
                              },
                              `${l}: ${n[0]}`
                            )
                          )
                        : /* @__PURE__ */ e.jsx("p", {
                            className: [s.base, "text-dim text-sm italic"].join(" "),
                            children: i("common:common.no_entries"),
                          }),
                    ],
                  }),
                }),
              ],
            }),
            x,
          ],
        }),
      ],
    }),
  });
};
export { T as default };
