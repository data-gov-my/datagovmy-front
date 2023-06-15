import * as e from "react";
function c({ title: l, titleId: r, ...a }, t) {
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
      d: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z",
      clipRule: "evenodd",
    })
  );
}
const n = e.forwardRef(c),
  o = n;
export { o as default };
