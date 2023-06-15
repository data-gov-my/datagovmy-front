import { j as l } from "../../../../../external/react/jsx-runtime.js";
const t = ({ background: e, className: s, children: x }) =>
  /* @__PURE__ */ l.jsx("div", {
    className: `flex h-full w-full justify-center ${e ?? ""}`,
    children: /* @__PURE__ */ l.jsx("div", {
      className: `md:px-4.5 h-full w-full max-w-screen-2xl px-3 lg:px-6 ${s}`,
      children: x,
    }),
  });
export { t as default };
