import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { Fragment as s } from "react";
import { Menu as r } from "../../../../../external/@headlessui/react/dist/components/menu/menu.js";
import i from "../../../../../external/@heroicons/react/24/solid/esm/EllipsisHorizontalIcon.js";
import { Transition as n } from "../../../../../external/@headlessui/react/dist/components/transitions/transition.js";
const x = () =>
  /* @__PURE__ */ e.jsxs(r, {
    as: "div",
    className: "relative inline-block text-left",
    children: [
      /* @__PURE__ */ e.jsx(r.Button, {
        children: /* @__PURE__ */ e.jsx(i, { className: "h-5 px-2" }),
      }),
      /* @__PURE__ */ e.jsx(n, {
        as: s,
        enter: "transition ease-out duration-100",
        enterFrom: "transform opacity-0 scale-95",
        enterTo: "transform opacity-100 scale-100",
        leave: "transition ease-in duration-75",
        leaveFrom: "transform opacity-100 scale-100",
        leaveTo: "transform opacity-0 scale-95",
        children: /* @__PURE__ */ e.jsxs(r.Items, {
          className:
            "absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
          children: [
            /* @__PURE__ */ e.jsxs("div", {
              className: "px-1 py-1 ",
              children: [
                /* @__PURE__ */ e.jsx(r.Item, {
                  children: ({ active: t }) =>
                    /* @__PURE__ */ e.jsx("button", {
                      className: `${
                        t ? "bg-dim text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`,
                      children: "Edit",
                    }),
                }),
                /* @__PURE__ */ e.jsx(r.Item, {
                  children: ({ active: t }) =>
                    /* @__PURE__ */ e.jsx("button", {
                      className: `${
                        t ? "bg-dim text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`,
                      children: "Duplicate",
                    }),
                }),
              ],
            }),
            /* @__PURE__ */ e.jsxs("div", {
              className: "px-1 py-1",
              children: [
                /* @__PURE__ */ e.jsx(r.Item, {
                  children: ({ active: t }) =>
                    /* @__PURE__ */ e.jsx("button", {
                      className: `${
                        t ? "bg-dim text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`,
                      children: "Archive",
                    }),
                }),
                /* @__PURE__ */ e.jsx(r.Item, {
                  children: ({ active: t }) =>
                    /* @__PURE__ */ e.jsx("button", {
                      className: `${
                        t ? "bg-dim text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`,
                      children: "Move",
                    }),
                }),
              ],
            }),
            /* @__PURE__ */ e.jsx("div", {
              className: "px-1 py-1",
              children: /* @__PURE__ */ e.jsx(r.Item, {
                children: ({ active: t }) =>
                  /* @__PURE__ */ e.jsx("button", {
                    className: `${
                      t ? "bg-dim text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`,
                    children: "Delete",
                  }),
              }),
            }),
          ],
        }),
      }),
    ],
  });
export { x as default };
