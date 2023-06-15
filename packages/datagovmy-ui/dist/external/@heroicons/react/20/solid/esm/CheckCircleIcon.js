import * as e from "react";
function n({ title: l, titleId: r, ...a }, t) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": t,
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
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
      clipRule: "evenodd",
    })
  );
}
const c = e.forwardRef(n),
  o = c;
export { o as default };
