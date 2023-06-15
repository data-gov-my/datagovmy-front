import * as e from "react";
function t({ title: r, titleId: a, ...l }, o) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": o,
        "aria-labelledby": a,
      },
      l
    ),
    r
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: a,
          },
          r
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      fillRule: "evenodd",
      d: "M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z",
      clipRule: "evenodd",
    })
  );
}
const n = e.forwardRef(t),
  c = n;
export { c as default };
