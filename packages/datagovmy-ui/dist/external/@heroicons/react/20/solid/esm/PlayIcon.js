import * as e from "react";
function n({ title: a, titleId: r, ...t }, l) {
  return /* @__PURE__ */ e.createElement(
    "svg",
    Object.assign(
      {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 20 20",
        "fill": "currentColor",
        "aria-hidden": "true",
        "ref": l,
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
      d: "M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z",
    })
  );
}
const o = e.forwardRef(n),
  c = o;
export { c as default };
