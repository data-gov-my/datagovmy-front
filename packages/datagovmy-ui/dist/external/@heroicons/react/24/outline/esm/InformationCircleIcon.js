import * as e from "react";
function a({ title: r, titleId: n, ...o }, t) {
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
        "ref": t,
        "aria-labelledby": n,
      },
      o
    ),
    r
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: n,
          },
          r
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
    })
  );
}
const l = e.forwardRef(a),
  i = l;
export { i as default };
