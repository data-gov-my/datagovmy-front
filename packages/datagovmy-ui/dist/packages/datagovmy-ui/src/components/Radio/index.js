import { j as r } from "../../../../../external/react/jsx-runtime.js";
import m from "../Label/index.js";
const h = ({
  label: a,
  name: c,
  options: d,
  value: s,
  onChange: l,
  className: i = "space-y-1 pt-2",
}) =>
  /* @__PURE__ */ r.jsxs("div", {
    children: [
      a && /* @__PURE__ */ r.jsx(m, { label: a }),
      /* @__PURE__ */ r.jsx("ul", {
        className: i,
        children: d.map(e =>
          /* @__PURE__ */ r.jsx(
            "li",
            {
              children: /* @__PURE__ */ r.jsxs("label", {
                htmlFor: e.value,
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ r.jsx("input", {
                    id: e.value,
                    value: e.value,
                    type: "radio",
                    name: c,
                    checked: s && e.value === s.value,
                    className:
                      "border-outline text-primary focus:ring-primary dark:checked:bg-primary border-2 dark:bg-inherit",
                    onChange: t => l && l(e),
                  }),
                  /* @__PURE__ */ r.jsx("span", { className: "block text-sm", children: e.label }),
                ],
              }),
            },
            e.value
          )
        ),
      }),
    ],
  });
export { h as default };
