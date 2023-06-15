import { j as r } from "../../../../../external/react/jsx-runtime.js";
import { clx as i } from "../../../../../helpers.js";
import c from "next/image";
import { useState as d, useEffect as m } from "react";
const u = ({ children: e, inline: t = !1 }) =>
    /* @__PURE__ */ r.jsx("div", {
      className: i(
        "border-outline dark:border-outlineHover-dark h-5 w-[30px] rounded border bg-white",
        t ? "mr-2 inline-block" : "absolute"
      ),
      children:
        e ??
        /* @__PURE__ */ r.jsx("div", {
          className: "text-center font-black leading-4 text-black",
          children: "?",
        }),
    }),
  p = ({ fallback: e, alt: t, src: o, inline: a, ...n }) => {
    const [s, l] = d(null);
    return (
      m(() => {
        l(null);
      }, [o]),
      s
        ? /* @__PURE__ */ r.jsx(u, { inline: a, children: e })
        : /* @__PURE__ */ r.jsx(c, { alt: t, onError: l, src: o, ...n })
    );
  };
export { p as default };
