import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { clx as a } from "../../../../../helpers.js";
const n = ({ children: t, className: o, onClick: r }) =>
  /* @__PURE__ */ e.jsx("div", {
    className: a(
      "border-outline dark:border-washed-dark rounded-xl border transition",
      r && "cursor-pointer transition",
      o
    ),
    tabIndex: r ? 0 : -1,
    onClick: r,
    children: t,
  });
export { n as default };
