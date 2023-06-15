import { j as e } from "../../../../../../external/react/jsx-runtime.js";
import { CountryAndStates as t } from "../../../lib/constants.js";
import { useTranslation as m } from "../../../hooks/useTranslation.js";
import { clx as c } from "../../../../../../helpers.js";
const h = ({ title: s, menu: d, controls: i, state: r, className: a }) => {
  const { t: n } = m();
  return /* @__PURE__ */ e.jsx(e.Fragment, {
    children:
      [s, r, i, d].some(Boolean) &&
      /* @__PURE__ */ e.jsxs("div", {
        className: c("flex flex-wrap items-start justify-between gap-2", a),
        children: [
          /* @__PURE__ */ e.jsxs("div", {
            children: [
              s && typeof s == "string"
                ? /* @__PURE__ */ e.jsx("span", {
                    className: "text-lg font-bold dark:text-white",
                    children: s,
                  })
                : s,
              r && typeof r == "string"
                ? /* @__PURE__ */ e.jsx("p", {
                    className: "text-dim pt-4 text-sm",
                    children: n("common:common.data_for", { state: t[r] }),
                  })
                : /* @__PURE__ */ e.jsx(e.Fragment, { children: r }),
            ],
          }),
          d && /* @__PURE__ */ e.jsx("div", { className: "block md:hidden", children: d }),
          i &&
            /* @__PURE__ */ e.jsx("div", {
              className: "flex items-center justify-end gap-2 md:hidden",
              children: i,
            }),
          /* @__PURE__ */ e.jsxs("div", {
            className: "hidden items-center justify-end gap-2 md:flex",
            children: [
              i,
              d && /* @__PURE__ */ e.jsx("div", { className: "hidden md:block", children: d }),
            ],
          }),
        ],
      }),
  });
};
export { h as default };
