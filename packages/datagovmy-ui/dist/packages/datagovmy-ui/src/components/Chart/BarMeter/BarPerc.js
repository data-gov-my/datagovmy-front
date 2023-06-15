import { j as e } from "../../../../../../external/react/jsx-runtime.js";
import { numFormat as h, clx as o, limitMax as m } from "../../../../../../helpers.js";
const j = ({
  label: r,
  value: s,
  className: d = "w-fit space-y-1",
  precision: i = 1,
  hidden: t = !1,
  total: l = 100,
  unit: n = "%",
  size: a = "h-[5px] w-[30px] md:w-[50px]",
}) => {
  const x = c => `${m((c / l) * 100)}%`;
  return /* @__PURE__ */ e.jsxs("div", {
    className: d,
    children: [
      !t &&
        /* @__PURE__ */ e.jsxs("div", {
          className: "flex justify-between",
          children: [
            r && /* @__PURE__ */ e.jsx("p", { children: r }),
            /* @__PURE__ */ e.jsx("div", {
              className: "text-inherit dark:text-white",
              children:
                s !== null
                  ? /* @__PURE__ */ e.jsxs("p", { children: [h(s, "standard", i), n] })
                  : /* @__PURE__ */ e.jsx("p", { children: "N/A" }),
            }),
          ],
        }),
      /* @__PURE__ */ e.jsx("div", {
        className: o("bg-washed dark:bg-washed-dark flex overflow-x-hidden rounded-full", a),
        children: /* @__PURE__ */ e.jsx("div", {
          className: "h-full items-center overflow-hidden rounded-full bg-[#0F172A] dark:bg-white",
          style: { width: x(s) },
        }),
      }),
    ],
  });
};
export { j as default };
