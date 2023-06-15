import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { useState as w, Fragment as j } from "react";
import N from "../ImageWithFallback/index.js";
import { useTranslation as y } from "../../hooks/useTranslation.js";
import { clx as s } from "../../../../../helpers.js";
import { matchSorter as C } from "../../../../../external/match-sorter/dist/match-sorter.esm.js";
import F from "../Spinner/index.js";
import { Combobox as l } from "../../../../../external/@headlessui/react/dist/components/combobox/combobox.js";
import I from "../../../../../external/@heroicons/react/24/solid/esm/MagnifyingGlassIcon.js";
import x from "../../../../../external/@heroicons/react/24/solid/esm/XMarkIcon.js";
import S from "../../../../../external/@heroicons/react/24/solid/esm/CheckCircleIcon.js";
import { Transition as $ } from "../../../../../external/@headlessui/react/dist/components/transitions/transition.js";
const V = ({
  options: i,
  selected: n,
  onChange: o,
  onSearch: c,
  placeholder: f,
  enableFlag: p = !1,
  imageSource: b = "/static/images/parties/",
  fallback: g,
  enableType: v = !1,
  loading: d = !1,
}) => {
  const { t: m } = y(),
    [t, u] = w(""),
    h =
      t === ""
        ? i.slice(0, 50)
        : C(i, t.toLowerCase().replace(/\s+/g, ""), { keys: ["label"] }).slice(0, 50);
  return /* @__PURE__ */ e.jsx(l, {
    value: n,
    onChange: o,
    children: /* @__PURE__ */ e.jsxs("div", {
      className: "relative w-full overflow-visible rounded-full",
      children: [
        /* @__PURE__ */ e.jsx("div", {
          className: `border-outline hover:border-outlineHover dark:border-outlineHover-dark relative w-full select-none 
        overflow-hidden rounded-full border bg-white text-left text-base shadow-sm focus:outline-none focus-visible:ring-0 dark:bg-black`,
          children: /* @__PURE__ */ e.jsxs(l.Button, {
            as: "div",
            className: "w-full",
            children: [
              /* @__PURE__ */ e.jsx(l.Input, {
                placeholder: f,
                className:
                  "w-full border-none bg-white py-3 pl-12 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-black",
                displayValue: r => (r == null ? void 0 : r.label),
                onChange: r => {
                  u(r.target.value), c && c(r.target.value);
                },
                spellCheck: !1,
              }),
              /* @__PURE__ */ e.jsx("span", {
                className: "pointer-events-none absolute inset-y-0 left-2 flex items-center pl-1.5",
                children: /* @__PURE__ */ e.jsx(I, {
                  "className": "dark:text-dim h-5 w-5 text-black",
                  "aria-hidden": "true",
                }),
              }),
              t.length > 0 &&
                /* @__PURE__ */ e.jsx("button", {
                  "className":
                    "hover:bg-washed dark:hover:bg-washed-dark group absolute inset-y-0 right-2 top-2 flex h-8 w-8 items-center rounded-full",
                  "onClick": () => o(void 0),
                  "aria-hidden": "true",
                  "children": /* @__PURE__ */ e.jsx(x, {
                    className:
                      "text-dim absolute right-1.5 h-5 w-5 group-hover:text-black dark:group-hover:text-white",
                  }),
                }),
              n &&
                /* @__PURE__ */ e.jsx("button", {
                  "className":
                    "hover:bg-washed dark:hover:bg-washed-dark group absolute inset-y-0 right-2 top-2 flex h-8 w-8 items-center rounded-full",
                  "onClick": () => o(void 0),
                  "aria-hidden": "true",
                  "children": /* @__PURE__ */ e.jsx(x, {
                    className:
                      "text-dim absolute right-1.5 h-5 w-5 group-hover:text-black dark:group-hover:text-white",
                  }),
                }),
            ],
          }),
        }),
        /* @__PURE__ */ e.jsx($, {
          as: j,
          leave: "transition ease-in duration-100",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          afterLeave: () => u(""),
          children: /* @__PURE__ */ e.jsx(l.Options, {
            className:
              "absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black sm:text-sm",
            children: d
              ? /* @__PURE__ */ e.jsxs("div", {
                  className:
                    "text-dim cursor-deault relative flex select-none flex-row items-center gap-2 px-4 py-2	",
                  children: [
                    /* @__PURE__ */ e.jsx(F, { loading: d }),
                    " ",
                    m("common:placeholder.loading"),
                  ],
                })
              : h.length === 0 && t !== ""
              ? /* @__PURE__ */ e.jsx("div", {
                  className: "text-dim relative cursor-default select-none px-4 py-2",
                  children: m("common:placeholder.no_results"),
                })
              : h.map((r, k) =>
                  /* @__PURE__ */ e.jsx(
                    l.Option,
                    {
                      className: ({ active: a }) =>
                        s(
                          "relative flex w-full cursor-pointer select-none flex-row gap-2 px-4 py-2",
                          a && "bg-washed dark:bg-washed-dark"
                        ),
                      value: r,
                      children: ({ selected: a }) =>
                        /* @__PURE__ */ e.jsxs("div", {
                          className: "flex w-full items-center gap-2",
                          children: [
                            p
                              ? /* @__PURE__ */ e.jsxs(e.Fragment, {
                                  children: [
                                    /* @__PURE__ */ e.jsx(N, {
                                      className:
                                        "border-outline dark:border-outlineHover-dark absolute rounded border",
                                      src: `${b}${r.value}.png`,
                                      fallback: g,
                                      width: 32,
                                      height: 18,
                                      alt: r.value,
                                    }),
                                    /* @__PURE__ */ e.jsx("span", {
                                      className: s(
                                        "relative block truncate pl-10",
                                        a ? "font-medium" : "font-normal"
                                      ),
                                      children: r.label,
                                    }),
                                  ],
                                })
                              : v
                              ? /* @__PURE__ */ e.jsxs("span", {
                                  className: s(
                                    "block truncate",
                                    a ? "font-medium" : "font-normal",
                                    "flex flex-row gap-1"
                                  ),
                                  children: [
                                    /* @__PURE__ */ e.jsx(e.Fragment, {
                                      children: String(r.label).split("(")[0],
                                    }),
                                    /* @__PURE__ */ e.jsx("p", {
                                      className: "text-dim normal-case",
                                      children: ` (${String(r.label).split("(")[1]}`,
                                    }),
                                  ],
                                })
                              : /* @__PURE__ */ e.jsx("span", {
                                  className: s("block truncate", a ? "font-medium" : "font-normal"),
                                  children: r.label,
                                }),
                            a &&
                              /* @__PURE__ */ e.jsx("span", {
                                className: "absolute inset-y-0 right-0 flex items-center pr-3",
                                children: /* @__PURE__ */ e.jsx(S, {
                                  className: "text-primary dark:text-primary-dark h-4 w-4",
                                }),
                              }),
                          ],
                        }),
                    },
                    k
                  )
                ),
          }),
        }),
      ],
    }),
  });
};
export { V as default };
