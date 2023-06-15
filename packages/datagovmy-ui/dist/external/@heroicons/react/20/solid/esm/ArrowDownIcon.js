import * as e from "react";
function n({ title: r, titleId: l, ...a }, o) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": o,
        "aria-labelledby": l,
      },
      a
    ),
    r
      ? /* @__PURE__ */ e.createElement(
          "title",
          {
            id: l,
          },
          r
        )
      : null,
    /* @__PURE__ */ e.createElement("path", {
      fillRule: "evenodd",
      d: "M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z",
      clipRule: "evenodd",
    })
  );
}
const t = e.forwardRef(n),
  c = t;
export { c as default };
