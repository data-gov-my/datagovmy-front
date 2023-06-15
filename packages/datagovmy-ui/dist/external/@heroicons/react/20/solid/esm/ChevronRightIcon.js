import * as e from "react";
function n({ title: r, titleId: a, ...t }, l) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": l,
        "aria-labelledby": a,
      },
      t
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
      d: "M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z",
      clipRule: "evenodd",
    })
  );
}
const o = e.forwardRef(n),
  c = o;
export { c as default };
