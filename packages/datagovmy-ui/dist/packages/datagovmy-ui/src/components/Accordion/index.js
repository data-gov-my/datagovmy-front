import { j as r } from "../../../../../external/react/jsx-runtime.js";
import { clx as a } from "../../../../../helpers.js";
import { Disclosure as e } from "../../../../../external/@headlessui/react/dist/components/disclosure/disclosure.js";
import { Transition as l } from "../../../../../external/@headlessui/react/dist/components/transitions/transition.js";
const h = ({ className: s, width: o = "w-full", icon: d, title: n, children: t }) =>
  /* @__PURE__ */ r.jsx(e, {
    children: ({ open: i }) =>
      /* @__PURE__ */ r.jsxs("div", {
        children: [
          /* @__PURE__ */ r.jsx(e.Button, {
            as: "div",
            children: /* @__PURE__ */ r.jsx("div", {
              className: a(
                i ? "rounded-none" : "rounded-b-xl",
                "hover:bg-washed dark:hover:bg-washed-dark cursor-pointer rounded-t-xl p-4 shadow",
                "border-outline dark:border-washed-dark hover:border-outlineHover dark:hover:border-outlineHover-dark border",
                o,
                s
              ),
              children: /* @__PURE__ */ r.jsxs("div", {
                className: "flex",
                children: [d, /* @__PURE__ */ r.jsx("p", { className: "pl-8", children: n })],
              }),
            }),
          }),
          /* @__PURE__ */ r.jsx(l, {
            enter: "transition duration-100 ease-out",
            enterFrom: "transform scale-95 opacity-0",
            enterTo: "transform scale-100 opacity-100",
            leave: "transition duration-75 ease-out",
            leaveFrom: "transform scale-100 opacity-100",
            leaveTo: "transform scale-95 opacity-0",
            children: /* @__PURE__ */ r.jsx(e.Panel, {
              children: /* @__PURE__ */ r.jsx("div", {
                className: a(
                  "text-dim border-outline dark:border-washed-dark rounded-b-xl border border-t-0 p-4 font-normal shadow",
                  o
                ),
                children: t,
              }),
            }),
          }),
        ],
      }),
  });
export { h as default };
