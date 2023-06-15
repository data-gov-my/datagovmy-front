import * as e from "react";
function a({ title: r, titleId: t, ...n }, o) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "fill": "none",
        "viewBox": "0 0 24 24",
        "strokeWidth": 1.5,
        "stroke": "currentColor",
        "aria-hidden": "true",
        "ref": o,
        "aria-labelledby": t,
      },
      n
    ),
    r
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: t,
          },
          r
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M6 18L18 6M6 6l12 12",
    })
  );
}
const l = e.forwardRef(a),
  s = l;
export { s as default };
