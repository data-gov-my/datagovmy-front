import * as e from "react";
function a({ title: t, titleId: r, ...o }, n) {
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
        "ref": n,
        "aria-labelledby": r,
      },
      o
    ),
    t
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: r,
          },
          t
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12",
    })
  );
}
const s = e.forwardRef(a),
  c = s;
export { c as default };
