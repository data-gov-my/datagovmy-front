import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { useMemo as b } from "react";
import { CountryAndStates as w } from "../../lib/constants.js";
import { useTranslation as k } from "../../hooks/useTranslation.js";
import { clx as x } from "../../../../../helpers.js";
import { Tab as n } from "../../../../../external/@headlessui/react/dist/components/tabs/tabs.js";
const y = ({ children: r, name: l }) => /* @__PURE__ */ e.jsx(e.Fragment, { children: r }),
  N = ({ options: r, current: l, onChange: s, icons: t }) =>
    /* @__PURE__ */ e.jsx("ul", {
      className: "flex",
      children: r.map((o, a) =>
        /* @__PURE__ */ e.jsxs(
          "li",
          {
            className: x(
              "flex cursor-pointer self-center whitespace-nowrap rounded-full px-[10px] py-1 text-sm outline-none transition-colors",
              l === a
                ? "bg-outline dark:bg-washed-dark font-medium text-black dark:text-white"
                : "text-dim bg-transparent hover:text-black dark:hover:text-white"
            ),
            onClick: () => s(a),
            children: [t && t[a], o],
          },
          o
        )
      ),
    }),
  f = ({
    className: r = "flex justify-start gap-2",
    hidden: l,
    children: s,
    title: t,
    controls: o,
    current: a,
    state: i,
    menu: c,
    onChange: u = () => {},
  }) => {
    const { t: h } = k(),
      p = b(() => (Array.isArray(s) ? s : [s]), [s]);
    return /* @__PURE__ */ e.jsx(e.Fragment, {
      children: /* @__PURE__ */ e.jsxs(n.Group, {
        selectedIndex: a,
        onChange: u,
        children: [
          /* @__PURE__ */ e.jsxs("div", {
            className: x("flex flex-wrap items-baseline justify-between gap-4", r),
            children: [
              /* @__PURE__ */ e.jsxs("div", {
                children: [
                  t && typeof t == "string"
                    ? /* @__PURE__ */ e.jsx("span", {
                        className: "text-base font-bold",
                        children: t,
                      })
                    : t,
                  i && typeof i == "string"
                    ? /* @__PURE__ */ e.jsx("p", {
                        className: "text-dim pt-4 text-sm",
                        children: h("common:common.data_for", { state: w[i] }),
                      })
                    : /* @__PURE__ */ e.jsx(e.Fragment, { children: i }),
                ],
              }),
              /* @__PURE__ */ e.jsxs(n.List, {
                className: x(
                  "flex flex-wrap items-center justify-between gap-[10px] lg:items-start lg:justify-end",
                  l && "hidden"
                ),
                children: [
                  o,
                  /* @__PURE__ */ e.jsx("div", {
                    className: "flex flex-grow flex-wrap",
                    children: p.map(({ props: { name: m, icon: d } }, j) =>
                      /* @__PURE__ */ e.jsxs(
                        n,
                        {
                          className: ({ selected: g }) =>
                            x(
                              "group flex flex-row rounded-full px-[10px] py-1 text-sm outline-none transition-colors",
                              g
                                ? "bg-outline dark:bg-washed-dark font-medium text-black dark:text-white"
                                : "text-dim bg-transparent hover:text-black dark:hover:text-white"
                            ),
                          children: [d, m],
                        },
                        j
                      )
                    ),
                  }),
                  c && /* @__PURE__ */ e.jsx("div", { children: c }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ e.jsx(n.Panels, {
            className: "w-full",
            children: p.map(({ props: { children: m } }, d) =>
              /* @__PURE__ */ e.jsx(n.Panel, { className: "overflow-auto", children: m }, d)
            ),
          }),
        ],
      }),
    });
  };
f.Panel = y;
f.List = N;
export { N as List, y as Panel, f as default };
