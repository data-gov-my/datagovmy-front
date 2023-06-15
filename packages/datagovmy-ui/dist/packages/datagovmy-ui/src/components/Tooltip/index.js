import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { WindowContext as d } from "../../hooks/useWindow.js";
import { useContext as x, useState as p, Fragment as o } from "react";
import { BREAKPOINTS as f } from "../../lib/constants.js";
import { clx as h } from "../../../../../helpers.js";
import n from "../../../../../external/@heroicons/react/24/outline/esm/InformationCircleIcon.js";
import { Transition as s } from "../../../../../external/@headlessui/react/dist/components/transitions/transition.js";
import { Dialog as r } from "../../../../../external/@headlessui/react/dist/components/dialog/dialog.js";
const C = ({ children: i, tip: t, fontFamily: l }) => {
  const { breakpoint: m } = x(d),
    [c, a] = p(!1);
  return /* @__PURE__ */ e.jsxs("div", {
    className: "tooltip w-fit",
    children: [
      i
        ? i(() => a(!0))
        : /* @__PURE__ */ e.jsx(e.Fragment, {
            children:
              !!t &&
              /* @__PURE__ */ e.jsxs(e.Fragment, {
                children: [
                  /* @__PURE__ */ e.jsx(n, {
                    className: "text-outlineHover mb-1 hidden h-4 w-4 md:inline-block",
                  }),
                  /* @__PURE__ */ e.jsx(n, {
                    className: "text-outlineHover mb-1 inline-block h-4 w-4 md:hidden",
                    onClick: () => a(!0),
                  }),
                ],
              }),
          }),
      m > f.MD
        ? /* @__PURE__ */ e.jsx("div", { className: "tooltip-content", children: t })
        : /* @__PURE__ */ e.jsx(s.Root, {
            show: c,
            as: o,
            children: /* @__PURE__ */ e.jsxs(r, {
              as: "div",
              className: h(l, "relative z-10 font-sans"),
              onClose: a,
              children: [
                /* @__PURE__ */ e.jsx(s.Child, {
                  as: o,
                  enter: "ease-out duration-300",
                  enterFrom: "opacity-0",
                  enterTo: "opacity-100",
                  leave: "ease-in duration-200",
                  leaveFrom: "opacity-100",
                  leaveTo: "opacity-0",
                  children: /* @__PURE__ */ e.jsx("div", {
                    className: "bg-outlineHover fixed inset-0 bg-opacity-70 transition-opacity",
                  }),
                }),
                /* @__PURE__ */ e.jsx("div", {
                  className: "fixed inset-0 z-10 overflow-y-auto",
                  children: /* @__PURE__ */ e.jsx("div", {
                    className: "flex min-h-full items-center justify-center p-4 text-center",
                    children: /* @__PURE__ */ e.jsx(s.Child, {
                      as: o,
                      enter: "ease-out duration-300",
                      enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                      enterTo: "opacity-100 translate-y-0 sm:scale-100",
                      leave: "ease-in duration-200",
                      leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
                      leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                      children: /* @__PURE__ */ e.jsx(r.Panel, {
                        className:
                          "relative h-fit transform overflow-hidden rounded bg-black p-3 text-left text-sm text-white shadow-xl transition-all",
                        children: t,
                      }),
                    }),
                  }),
                }),
              ],
            }),
          }),
    ],
  });
};
export { C as default };
