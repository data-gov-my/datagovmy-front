import * as e from "react";
function t({ title: a, titleId: r, ...l }, n) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 24 24",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": n,
        "aria-labelledby": r,
      },
      l
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
      fillRule: "evenodd",
      d: "M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z",
      clipRule: "evenodd",
    })
  );
}
const o = e.forwardRef(t),
  c = o;
export { c as default };
