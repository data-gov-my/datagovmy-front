import { j as o } from "../../../../../external/react/jsx-runtime.js";
import { statesOptions as g } from "../../lib/options.js";
import x from "next/link";
import l from "next/image";
import { useContext as j, useState as n, useEffect as y } from "react";
import w from "./index.js";
import { WindowContext as b } from "../../hooks/useWindow.js";
import { useTranslation as v } from "../../hooks/useTranslation.js";
import { clx as k } from "../../../../../helpers.js";
const O = ({ state: c, exclude: e, url: m, title: h }) => {
  const { scroll: s } = j(b),
    r = c || "mys",
    { t: f } = v(),
    [d, i] = n(!1),
    [p, u] = n(s.y);
  return (
    y(() => {
      p > s.y ? i(!0) : i(!1), u(s.y);
    }, [s.y]),
    /* @__PURE__ */ o.jsx(w, {
      trigger: a =>
        /* @__PURE__ */ o.jsx("button", {
          className: k(
            "fixed bottom-0 right-4 z-30 block h-14 w-14 transform rounded-[50%] border bg-white shadow-2xl transition-all lg:hidden",
            d ? "-translate-y-4" : "translate-y-12"
          ),
          onClick: () => a(),
          children: /* @__PURE__ */ o.jsx(l, {
            src: "/static/images/states/".concat(r, ".jpeg"),
            height: 16,
            width: 28,
            alt: r,
          }),
        }),
      title: h ?? f("common:common.check_out"),
      children: a =>
        /* @__PURE__ */ o.jsx("ul", {
          className: "space-y-2",
          children: g
            .filter(t => !(e != null && e.includes(t.value)))
            .map(t =>
              /* @__PURE__ */ o.jsx(
                "li",
                {
                  className: `rounded px-2 py-1 ${t.value === r ? "bg-washed" : ""}`,
                  children: /* @__PURE__ */ o.jsxs(x, {
                    href: m.concat("/", t.value !== "mys" ? t.value : ""),
                    scroll: !1,
                    onClick: () => a(),
                    children: [
                      /* @__PURE__ */ o.jsx(l, {
                        src: "/static/images/states/".concat(t.value, ".jpeg"),
                        height: 16,
                        width: 28,
                        alt: t.value,
                      }),
                      /* @__PURE__ */ o.jsx("span", { children: t.label }),
                    ],
                  }),
                },
                t.value
              )
            ),
        }),
    })
  );
};
export { O as default };
