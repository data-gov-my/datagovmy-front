import * as e from "react";
function n({ title: a, titleId: r, ...t }, l) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": l,
        "aria-labelledby": r,
      },
      t
    ),
    a
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: r,
          },
          a
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      d: "M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z",
    })
  );
}
const o = e.forwardRef(n),
  c = o;
export { c as default };
