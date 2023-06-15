import * as e from "react";
function l({ title: a, titleId: t, ...r }, o) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": o,
        "aria-labelledby": t,
      },
      r
    ),
    a
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: t,
          },
          a
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      fillRule: "evenodd",
      d: "M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm7 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z",
      clipRule: "evenodd",
    })
  );
}
const n = e.forwardRef(l),
  c = n;
export { c as default };
