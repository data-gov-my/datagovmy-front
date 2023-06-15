import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { useState as o } from "react";
const p = ({ enabled: t, label: r = "", onStateChanged: a, disabled: i = !1 }) => {
  const [s, l] = o(t);
  return /* @__PURE__ */ e.jsxs("div", {
    className: "flex flex-row items-center gap-1.5",
    children: [
      /* @__PURE__ */ e.jsxs("label", {
        className: "relative inline-flex cursor-pointer items-center",
        children: [
          /* @__PURE__ */ e.jsx("input", {
            type: "checkbox",
            className: "peer sr-only",
            checked: s,
            onChange: n => {
              l(c => !c), a(n.target.checked);
            },
          }),
          /* @__PURE__ */ e.jsx("span", {
            className:
              "bg-outline peer-checked:bg-primary peer h-4 w-[26px]  rounded-full after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-2.5 peer-focus:ring-blue-500 dark:bg-zinc-800 dark:after:bg-slate-100",
          }),
        ],
      }),
      /* @__PURE__ */ e.jsx("span", {
        className: "text-sm text-black dark:text-white",
        children: r,
      }),
    ],
  });
};
export { p as default };
