import * as e from "react";
function t({ title: a, titleId: l, ...n }, r) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": r,
        "aria-labelledby": l,
      },
      n
    ),
    a
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: l,
          },
          a
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      fillRule: "evenodd",
      d: "M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z",
      clipRule: "evenodd",
    })
  );
}
const o = e.forwardRef(t),
  i = o;
export { i as default };