import * as e from "react";
function o({ title: r, titleId: n, ...a }, l) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": l,
        "aria-labelledby": n,
      },
      a
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
      fillRule: "evenodd",
      d: "M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z",
      clipRule: "evenodd",
    })
  );
}
const t = e.forwardRef(o),
  c = t;
export { c as default };
