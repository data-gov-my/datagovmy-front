import { j as t } from "../../../../../external/react/jsx-runtime.js";
import { useTranslation as d } from "../../hooks/useTranslation.js";
import { clx as f } from "../../../../../helpers.js";
import { useRef as u, useEffect as h } from "react";
import p from "../../../../../external/@heroicons/react/24/solid/esm/MagnifyingGlassIcon.js";
const k = ({ query: a, onChange: n, className: l, placeholder: c }) => {
  const r = u(null),
    { t: i } = d();
  return (
    h(() => {
      const e = s => {
        var o;
        const { key: m } = s;
        m === "/" && (s.preventDefault(), (o = r.current) == null || o.focus());
      };
      return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
    }, []),
    /* @__PURE__ */ t.jsxs("div", {
      className: f("relative flex items-center", l),
      children: [
        /* @__PURE__ */ t.jsx("input", {
          ref: r,
          id: "search",
          name: "search",
          type: "search",
          placeholder: c ?? i("common:placeholder.search"),
          value: a,
          onChange: e => n(e.target.value),
          autoComplete: "off",
          className:
            "text-dim dark:border-outlineHover-dark block w-full border-0 bg-inherit pl-10 text-sm focus:ring-0 lg:text-base",
        }),
        /* @__PURE__ */ t.jsx("div", {
          className: "absolute inset-y-0 left-0 flex items-center pl-3",
          children: /* @__PURE__ */ t.jsx(p, { className: "text-dim h-4 w-4" }),
        }),
      ],
    })
  );
};
export { k as default };
