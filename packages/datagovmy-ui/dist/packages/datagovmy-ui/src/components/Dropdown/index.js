import { j as r } from "../../../../../external/react/jsx-runtime.js";
import A from "next/image";
import T from "../Label/index.js";
import { useState as H, useRef as B, useMemo as E, Fragment as G } from "react";
import M from "../Input/index.js";
import { useTranslation as X } from "next-i18next";
import { clx as i } from "../../../../../helpers.js";
import { FixedSizeList as q } from "../../../../../external/react-window/dist/index.esm.js";
import { matchSorter as J } from "../../../../../external/match-sorter/dist/match-sorter.esm.js";
import { Listbox as n } from "../../../../../external/@headlessui/react/dist/components/listbox/listbox.js";
import K from "../../../../../external/@heroicons/react/20/solid/esm/ChevronDownIcon.js";
import P from "../../../../../external/@heroicons/react/20/solid/esm/MagnifyingGlassIcon.js";
import Q from "../../../../../external/@heroicons/react/20/solid/esm/XMarkIcon.js";
import U from "../../../../../external/@heroicons/react/20/solid/esm/CheckCircleIcon.js";
import { Transition as V } from "../../../../../external/@headlessui/react/dist/components/transitions/transition.js";
const dr = ({
  className: I = "lg:flex-row",
  disabled: l = !1,
  multiple: t = !1,
  icon: S,
  options: c,
  selected: a,
  onChange: o,
  enableSearch: b,
  title: C,
  description: g,
  anchor: m = "right",
  placeholder: L,
  width: p = "w-full lg:w-fit",
  label: w,
  sublabel: k,
  darkMode: d = !1,
  enableFlag: v = !1,
  enableClear: O = !1,
  virtualise: $ = !1,
}) => {
  const [h, z] = H(""),
    D = B(null),
    { t: j } = X(),
    F = e => t && e && a.some(s => s.value === e.value),
    R = e => a.filter(s => s.value !== e.value),
    y = e => {
      if (!t) return o(e);
      const s = e;
      F(s) ? o(R(s)) : a && Array.isArray(a) ? o([...a, e]) : o([e]);
    },
    x = E(() => (b ? J(c, h.toLowerCase(), { keys: ["label"] }) : c), [c, h]),
    N = ({ option: e, index: s, style: u }) =>
      /* @__PURE__ */ r.jsx(
        n.Option,
        {
          style: u,
          className: i(
            "relative flex w-full cursor-default select-none items-center gap-2 py-2 pr-4",
            t ? "pl-10" : "pl-4",
            d
              ? "hover:bg-washed/10 text-white"
              : "hover:bg-washed dark:hover:bg-washed-dark dark:text-white",
            t && a && Array.isArray(a) && a.some(f => f.value == e.value)
              ? "bg-washed dark:bg-washed-dark"
              : "bg-inherit"
          ),
          onClick: () => (t ? y(e) : null),
          value: e,
          children: /* @__PURE__ */ r.jsxs("div", {
            className: "flex w-full items-center justify-between gap-2",
            children: [
              v &&
                /* @__PURE__ */ r.jsx(A, {
                  src: `/static/images/states/${e.value}.jpeg`,
                  width: 20,
                  height: 12,
                  alt: e.label,
                }),
              /* @__PURE__ */ r.jsx("span", {
                className: [
                  "block flex-grow truncate",
                  e === a ? "font-medium" : "font-normal",
                ].join(" "),
                children: e.label,
              }),
              t &&
                /* @__PURE__ */ r.jsx("span", {
                  className: "absolute inset-y-0 left-0 flex items-center pl-3",
                  children: /* @__PURE__ */ r.jsx("input", {
                    type: "checkbox",
                    checked: a && a.some(f => f.value === e.value),
                    className:
                      "border-outline text-primary dark:border-outlineHover-dark dark:bg-washed-dark dark:checked:border-primary dark:checked:bg-primary-dark h-4 w-4 rounded focus:ring-0",
                  }),
                }),
              !t &&
                a &&
                a.value === e.value &&
                /* @__PURE__ */ r.jsx(U, {
                  className: "text-primary dark:text-primary-dark h-4 w-4",
                }),
            ],
          }),
        },
        s
      );
  return /* @__PURE__ */ r.jsxs("div", {
    className: i("space-y-3", p),
    children: [
      w && /* @__PURE__ */ r.jsx(T, { label: w }),
      /* @__PURE__ */ r.jsx(n, {
        value: a,
        onChange: e => !t && y(e),
        multiple: t,
        disabled: l,
        children: /* @__PURE__ */ r.jsxs("div", {
          className: `relative text-sm ${l ? "cursor-not-allowed" : ""}`,
          children: [
            /* @__PURE__ */ r.jsx(n.Button, {
              className: i(
                "dark:border-washed-dark relative flex gap-[6px] rounded-md border py-[6px] pl-3 pr-8 text-left shadow-sm dark:bg-black lg:items-center",
                I,
                p,
                d
                  ? "border-outline/10 active:bg-washed/10 bg-black"
                  : "border-outline active:bg-washed bg-white",
                l
                  ? "bg-outline text-dim pointer-events-none"
                  : "hover:border-outlineHover focus:outline-none focus-visible:ring-0"
              ),
              children: /* @__PURE__ */ r.jsxs(r.Fragment, {
                children: [
                  S,
                  k &&
                    /* @__PURE__ */ r.jsx("span", {
                      className: "text-dim block w-fit min-w-min truncate",
                      children: k,
                    }),
                  v &&
                    a &&
                    /* @__PURE__ */ r.jsx("div", {
                      className: "self-center",
                      children: /* @__PURE__ */ r.jsx(A, {
                        src: `/static/images/states/${a.value}.jpeg`,
                        width: 20,
                        height: 12,
                        alt: a.label,
                      }),
                    }),
                  /* @__PURE__ */ r.jsx("span", {
                    className: i(
                      l ? "dark:text-dim" : "dark:text-white",
                      "block w-full truncate lg:w-auto"
                    ),
                    children: t ? C : (a == null ? void 0 : a.label) || L || "Select",
                  }),
                  t &&
                    (a == null ? void 0 : a.length) > 0 &&
                    /* @__PURE__ */ r.jsx("span", {
                      className:
                        "dark:bg-primary-dark rounded-md bg-black px-1 py-0.5 text-xs text-white ",
                      children: a && a.length,
                    }),
                  /* @__PURE__ */ r.jsx("span", {
                    className:
                      "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5",
                    children: /* @__PURE__ */ r.jsx(K, {
                      "className": i(l ? "dark:text-dim" : "dark:text-white", "h-5 w-5 text-black"),
                      "aria-hidden": "true",
                    }),
                  }),
                ],
              }),
            }),
            /* @__PURE__ */ r.jsx(V, {
              as: G,
              leave: "transition ease-in duration-100",
              leaveFrom: "opacity-100",
              leaveTo: "opacity-0",
              children: /* @__PURE__ */ r.jsxs(n.Options, {
                ref: D,
                className: i(
                  "dark:ring-washed-dark absolute z-20 mt-1 min-w-full rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black",
                  m === "right" ? "right-0" : m === "left" ? "left-0" : m,
                  d ? "border-outline/10 border bg-black" : "bg-white"
                ),
                children: [
                  g &&
                    /* @__PURE__ */ r.jsx("p", {
                      className: "text-dim px-3 pb-1 pt-2 text-xs",
                      children: g,
                    }),
                  b &&
                    /* @__PURE__ */ r.jsx(M, {
                      type: "search",
                      icon: /* @__PURE__ */ r.jsx(P, { className: " h-4 w-4" }),
                      value: h,
                      className:
                        "border-outline dark:border-washed-dark w-full rounded-b-none border-0 border-b text-sm",
                      placeholder: j("common:placeholder.search") + " ...",
                      onChange: e => z(e),
                    }),
                  $
                    ? /* @__PURE__ */ r.jsx(q, {
                        height: 240,
                        width: "100%",
                        itemCount: x.length,
                        itemSize: 35,
                        children: ({ index: e, style: s }) => {
                          const u = x[e];
                          return /* @__PURE__ */ r.jsx(N, { option: u, index: e, style: s });
                        },
                      })
                    : /* @__PURE__ */ r.jsx("div", {
                        className: "max-h-60 overflow-auto",
                        children: x.map((e, s) =>
                          /* @__PURE__ */ r.jsx(N, { option: e, index: s, style: null }, s)
                        ),
                      }),
                  O &&
                    /* @__PURE__ */ r.jsxs("button", {
                      onClick: () => o(t ? [] : void 0),
                      className:
                        "text-dim hover:bg-washed dark:hover:bg-washed-dark group relative flex w-full cursor-default select-none items-center gap-2 border-t py-2 pl-10 pr-4 disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: Array.isArray(a) && a.length === 0,
                      children: [
                        /* @__PURE__ */ r.jsx("p", { children: j("common:common.clear") }),
                        /* @__PURE__ */ r.jsx("span", {
                          className: "absolute inset-y-0 left-0 flex items-center pl-3",
                          children: /* @__PURE__ */ r.jsx(Q, { className: "h-5 w-5" }),
                        }),
                      ],
                    }),
                ],
              }),
            }),
          ],
        }),
      }),
    ],
  });
};
export { dr as default };
