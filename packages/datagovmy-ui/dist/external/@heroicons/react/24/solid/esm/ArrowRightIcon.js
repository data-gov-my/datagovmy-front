import * as e from "react";
function o({ title: r, titleId: a, ...l }, t) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 24 24",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": t,
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
      d: "M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z",
      clipRule: "evenodd",
    })
  );
}
const n = e.forwardRef(o),
  c = n;
export { c as default };