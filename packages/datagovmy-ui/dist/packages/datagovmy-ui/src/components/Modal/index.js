import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { useState as c } from "react";
import { clx as t } from "../../../../../helpers.js";
import { Dialog as a } from "../../../../../external/@headlessui/react/dist/components/dialog/dialog.js";
import n from "../../../../../external/@heroicons/react/24/solid/esm/XMarkIcon.js";
const p = ({ trigger: l, title: r, children: o, fontFamily: i }) => {
  const [d, s] = c(!1);
  return /* @__PURE__ */ e.jsxs(e.Fragment, {
    children: [
      l && l(() => s(!0)),
      /* @__PURE__ */ e.jsxs(a, {
        open: d,
        onClose: () => s(!1),
        className: "relative z-50",
        children: [
          /* @__PURE__ */ e.jsx("div", {
            "className": "fixed inset-0 bg-black/30",
            "aria-hidden": "true",
          }),
          /* @__PURE__ */ e.jsx("div", {
            className: "fixed inset-0 pt-[15%] ",
            children: /* @__PURE__ */ e.jsx("div", {
              className: t("block h-full lg:p-4"),
              children: /* @__PURE__ */ e.jsxs(a.Panel, {
                className: t(
                  i,
                  "absolute bottom-0 mx-auto flex w-full flex-col rounded bg-white px-4 pt-4 font-sans dark:bg-black"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("div", {
                    className:
                      "dark:border-outlineHover-dark flex justify-between border-b bg-white pb-2 dark:bg-black",
                    children: [
                      /* @__PURE__ */ e.jsx(a.Title, {
                        as: "h4",
                        className: "text-black dark:text-white ",
                        children: r,
                      }),
                      /* @__PURE__ */ e.jsx(n, {
                        onClick: () => s(!1),
                        className: "text-dim h-5 w-5",
                      }),
                    ],
                  }),
                  o(() => s(!1)),
                ],
              }),
            }),
          }),
        ],
      }),
    ],
  });
};
export { p as default };
