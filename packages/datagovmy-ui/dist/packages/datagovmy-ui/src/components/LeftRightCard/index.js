import { j as r } from "../../../../../external/react/jsx-runtime.js";
const l = ({ left: e, right: s }) =>
  /* @__PURE__ */ r.jsx(r.Fragment, {
    children: /* @__PURE__ */ r.jsxs("div", {
      className:
        "flex flex-col items-stretch overflow-visible rounded-xl border border-slate-200 dark:border-zinc-800 lg:flex-row",
      children: [
        /* @__PURE__ */ r.jsx("div", {
          className:
            "basis-1/3 overflow-visible border-slate-200 dark:border-zinc-800 dark:bg-zinc-800/50 lg:border-r",
          children: e,
        }),
        /* @__PURE__ */ r.jsx("div", {
          className: "basis-2/3 rounded-b-xl bg-slate-50 dark:bg-zinc-900 lg:rounded-r-xl",
          children: s,
        }),
      ],
    }),
  });
export { l as default };
