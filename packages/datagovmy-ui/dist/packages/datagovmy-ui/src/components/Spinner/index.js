import { j as r } from "../../../../../external/react/jsx-runtime.js";
const o = ({ loading: e, className: a }) =>
  e
    ? /* @__PURE__ */ r.jsx("div", {
        className: [
          "h-4 w-4 animate-spin rounded-[50%] border-2 border-gray-300 border-t-black",
          a,
        ].join(" "),
      })
    : /* @__PURE__ */ r.jsx(r.Fragment, {});
export { o as default };
