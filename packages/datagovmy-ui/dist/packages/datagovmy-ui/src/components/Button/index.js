import { j as t } from "../../../../../external/react/jsx-runtime.js";
import { clx as d } from "../../../../../helpers.js";
const m = ({
  className: e = "text-dim text-sm hover:bg-washed dark:hover:bg-washed-dark",
  icon: r,
  type: s = "button",
  onClick: o,
  children: a,
  disabled: n = !1,
}) =>
  /* @__PURE__ */ t.jsx(t.Fragment, {
    children: /* @__PURE__ */ t.jsxs("button", {
      onClick: o,
      disabled: n,
      type: s,
      className: d(
        "flex items-center gap-2 self-center rounded-md p-2 text-start text-sm leading-none transition hover:bg-opacity-50 disabled:cursor-not-allowed disabled:opacity-50",
        e
      ),
      children: [r, a],
    }),
  });
export { m as default };
