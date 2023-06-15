import { j as e } from "../../../../../external/react/jsx-runtime.js";
import x from "./Header.js";
import l from "./Footer.js";
const a = ({ className: s, children: r, stateSelector: o }) =>
  /* @__PURE__ */ e.jsxs("div", {
    className: s,
    children: [
      /* @__PURE__ */ e.jsx(x, { stateSelector: o }),
      /* @__PURE__ */ e.jsxs("div", {
        className: "flex min-h-screen flex-col",
        children: [
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-grow flex-col pt-14", children: r }),
          /* @__PURE__ */ e.jsx(l, {}),
        ],
      }),
    ],
  });
export { a as default };
