import * as e from "react";
function t({ title: l, titleId: r, ...a }, o) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 24 24",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": o,
        "aria-labelledby": r,
      },
      a
    ),
    l
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: r,
          },
          l
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      fillRule: "evenodd",
      d: "M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z",
      clipRule: "evenodd",
    })
  );
}
const n = e.forwardRef(t),
  i = n;
export { i as default };
