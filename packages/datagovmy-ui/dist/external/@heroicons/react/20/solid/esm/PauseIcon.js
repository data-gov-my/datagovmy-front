import * as e from "react";
function o({ title: a, titleId: r, ...t }, n) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": n,
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
      d: "M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z",
    })
  );
}
const c = e.forwardRef(o),
  l = c;
export { l as default };
