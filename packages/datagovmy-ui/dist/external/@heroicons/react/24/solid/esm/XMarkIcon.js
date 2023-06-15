import * as e from "react";
function n({ title: a, titleId: r, ...l }, t) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 24 24",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": t,
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
      d: "M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z",
      clipRule: "evenodd",
    })
  );
}
const o = e.forwardRef(n),
  c = o;
export { c as default };
