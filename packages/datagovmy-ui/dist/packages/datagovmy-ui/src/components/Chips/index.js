import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { useTranslation as o } from "../../hooks/useTranslation.js";
import a from "../../../../../external/@heroicons/react/24/outline/esm/XMarkIcon.js";
const u = ({ data: n, onRemove: r, onClearAll: s }) => {
  const { t: l } = o();
  return /* @__PURE__ */ e.jsxs("ul", {
    className: "item-center flex flex-wrap gap-1.5",
    children: [
      n.map((t, i) =>
        /* @__PURE__ */ e.jsxs(
          "li",
          {
            className:
              "bg-outline dark:bg-washed-dark flex cursor-pointer flex-row items-center gap-0.5 truncate rounded-full px-2.5 py-1 text-sm font-medium text-black outline-none transition-colors dark:text-white",
            onClick: () => r(t.value),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.label }),
              /* @__PURE__ */ e.jsx(a, { className: "h-4 w-4 shrink-0 font-bold text-zinc-500" }),
            ],
          },
          t.value
        )
      ),
      n.length > 0 &&
        s &&
        /* @__PURE__ */ e.jsx("li", {
          className:
            "text-dim flex cursor-pointer flex-row items-center gap-0.5 rounded-full px-2.5 py-1 text-sm font-medium outline-none transition-colors",
          onClick: s,
          children: /* @__PURE__ */ e.jsxs("span", {
            children: [" ", l("common:common.clear_all")],
          }),
        }),
    ],
  });
};
export { u as default };
