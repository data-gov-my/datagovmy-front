import * as e from "react";
function t({ title: o, titleId: r, ...n }, a) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": a,
        "aria-labelledby": r,
      },
      n
    ),
    o
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: r,
          },
          o
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      fillRule: "evenodd",
      d: "M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z",
      clipRule: "evenodd",
    })
  );
}
const l = e.forwardRef(t),
  c = l;
export { c as default };
