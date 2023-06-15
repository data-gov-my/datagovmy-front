import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { clx as f } from "../../../../../helpers.js";
import g from "../At/index.js";
import { useRouter as x } from "next/router";
import { useState as p } from "react";
import m from "../Dropdown/index.js";
import { languages as r } from "../../lib/options.js";
import c from "./theme.js";
import { useLanguage as u } from "../../hooks/useLanguage.js";
import w from "../../../../../external/@heroicons/react/20/solid/esm/XMarkIcon.js";
import b from "../../../../../external/@heroicons/react/20/solid/esm/Bars3BottomRightIcon.js";
const j = ({ link: t, onClick: s, className: o, icon: a, title: d }) => {
    const { pathname: i } = x();
    return /* @__PURE__ */ e.jsxs(g, {
      href: t,
      scroll: !1,
      onClick: s,
      className: f(
        "hover:bg-washed dark:hover:bg-washed-dark flex items-center gap-2 rounded-none px-2 py-2 text-sm font-medium transition hover:cursor-pointer md:rounded-md md:py-[6px]",
        i.startsWith(t) && t !== "/" ? "bg-washed dark:bg-washed-dark" : "",
        o
      ),
      children: [a, d],
    });
  },
  k = ({ children: t, stateSelector: s }) => {
    const [o, a] = p(!1),
      { language: d, onLanguageChange: i } = u(),
      l = () => a(!1),
      h = () => a(!0);
    return /* @__PURE__ */ e.jsxs("div", {
      className: "flex w-full items-center justify-end lg:justify-between",
      children: [
        /* @__PURE__ */ e.jsx("div", { className: "hidden w-fit gap-1 lg:flex", children: t(l) }),
        /* @__PURE__ */ e.jsxs("div", {
          className: "hidden w-fit gap-4 lg:flex",
          children: [
            s,
            /* @__PURE__ */ e.jsx(c, {}),
            /* @__PURE__ */ e.jsx(m, {
              width: "w-fit",
              selected: r.find(n => n.value === d),
              onChange: i,
              options: r,
            }),
          ],
        }),
        /* @__PURE__ */ e.jsxs("div", {
          className: "flex w-full items-center justify-end gap-3 lg:hidden",
          children: [
            s,
            /* @__PURE__ */ e.jsx(c, {}),
            /* @__PURE__ */ e.jsx(m, {
              width: "w-fit",
              selected: r.find(n => n.value === d),
              onChange: i,
              options: r,
            }),
            o
              ? /* @__PURE__ */ e.jsx(w, {
                  className: "box-content block h-5 w-5 text-black dark:text-white lg:hidden",
                  onClick: l,
                })
              : /* @__PURE__ */ e.jsx(b, {
                  className: "box-content block h-5 w-5 text-black dark:text-white lg:hidden",
                  onClick: h,
                }),
          ],
        }),
        /* @__PURE__ */ e.jsx("div", {
          className: f(
            "dark:divide-washed-dark fixed left-0 top-[57px] flex w-full flex-col gap-0 divide-y bg-white px-4 py-2 shadow-lg backdrop-blur-md dark:bg-black/80 lg:hidden lg:gap-1 lg:divide-y-0 lg:p-1",
            o ? "flex" : "hidden"
          ),
          children: t(l),
        }),
      ],
    });
  };
k.Item = j;
export { k as default };
