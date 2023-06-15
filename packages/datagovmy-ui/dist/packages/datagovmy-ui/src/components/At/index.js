import { j as r } from "../../../../../external/react/jsx-runtime.js";
import i from "next/link";
import m from "../../../../../external/@heroicons/react/20/solid/esm/ChevronRightIcon.js";
const c = ({
  href: t,
  children: s,
  className: o,
  scrollTop: e = !0,
  enableIcon: a = !1,
  onClick: n,
}) =>
  /* @__PURE__ */ r.jsx(i, {
    href: t,
    scroll: e,
    className: o,
    onClick: n,
    children: a
      ? /* @__PURE__ */ r.jsxs("div", {
          className: "group flex items-center gap-2",
          children: [
            s,
            /* @__PURE__ */ r.jsx(m, {
              className: "h-5 w-5 transition-transform group-hover:translate-x-0.5",
            }),
          ],
        })
      : s,
  });
export { c as default };
