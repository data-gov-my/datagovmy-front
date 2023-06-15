import { j as e } from "../../../../../external/react/jsx-runtime.js";
import h from "../Label/index.js";
import { clx as k } from "../../../../../helpers.js";
import { useRef as y, useEffect as N } from "react";
const I = ({
  name: a,
  label: r,
  className: o = "px-4 w-full text-sm md:text-base",
  type: n = "text",
  value: u,
  placeholder: i,
  min: m,
  max: x,
  icon: t,
  required: c = !1,
  autoFocus: f = !1,
  spellCheck: p = !1,
  validation: s = "",
  onChange: d,
  onKeyDown: g,
  disabled: j = !1,
}) => {
  const l = y(null);
  return (
    N(() => {
      l.current && f && l.current.focus();
    }, []),
    /* @__PURE__ */ e.jsxs("div", {
      className: "relative flex w-full flex-col gap-2",
      children: [
        r && /* @__PURE__ */ e.jsx(h, { name: a, label: r }),
        /* @__PURE__ */ e.jsx("div", {
          className: [
            "text-dim absolute left-2 h-full",
            r ? "translate-y-[65%]" : "translate-y-[25%]",
          ].join(" "),
          children: t && t,
        }),
        /* @__PURE__ */ e.jsx("input", {
          id: a,
          ref: l,
          autoFocus: f,
          disabled: j,
          spellCheck: p,
          type: n,
          min: m,
          max: x,
          className: k(
            "placeholder:text-dim focus:ring-dim rounded-md outline-none focus:outline-none dark:bg-black",
            "focus:ring-primary dark:focus:ring-primary-dark",
            t ? "pl-10" : "",
            s ? "border-danger border-2" : "border-outline dark:border-washed-dark",
            o
          ),
          placeholder: i,
          value: u,
          required: c,
          onChange: b => {
            d && d(b.target.value);
          },
          onKeyDown: g,
        }),
        s && /* @__PURE__ */ e.jsx("p", { className: "text-danger text-xs", children: s }),
      ],
    })
  );
};
export { I as default };
