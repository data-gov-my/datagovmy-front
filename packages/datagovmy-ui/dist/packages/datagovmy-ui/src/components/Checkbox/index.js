import { j as l } from "../../../../../external/react/jsx-runtime.js";
import b from "../Label/index.js";
const j = ({
  label: c,
  name: t,
  options: d,
  value: r,
  onChange: a,
  className: u = "space-y-1 pt-2",
}) => {
  const x = e => e && r.some(s => s.value === e.value),
    m = e => r.filter(s => s.value !== e.value),
    n = e => {
      if (!a) return;
      const s = e;
      x(s) ? a(m(s)) : a(r ? [...r, e] : [e]);
    };
  return /* @__PURE__ */ l.jsxs("div", {
    children: [
      /* @__PURE__ */ l.jsx(b, { label: c }),
      /* @__PURE__ */ l.jsx("ul", {
        className: u,
        children: d.map((e, s) =>
          /* @__PURE__ */ l.jsx(
            "li",
            {
              children: /* @__PURE__ */ l.jsxs("label", {
                htmlFor: e.value,
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ l.jsx("input", {
                    id: e.value,
                    value: e.value,
                    type: "checkbox",
                    name: t,
                    checked: r.some(i => i.value === e.value),
                    className:
                      "border-outline rounded border-2 text-black focus:ring-0 focus:ring-transparent",
                    onChange: () => a && n(e),
                  }),
                  /* @__PURE__ */ l.jsx("span", { className: "block text-sm", children: e.label }),
                ],
              }),
            },
            s
          )
        ),
      }),
    ],
  });
};
export { j as default };
