import { j as e } from "../../../../../external/react/jsx-runtime.js";
import r from "../Button/index.js";
import s from "../../../../../external/@heroicons/react/20/solid/esm/MoonIcon.js";
import n from "../../../../../external/@heroicons/react/20/solid/esm/SunIcon.js";
import { useTheme as i } from "../../../../../external/next-themes/dist/index.module.js";
import { Transition as a } from "../../../../../external/@headlessui/react/dist/components/transitions/transition.js";
const u = () => {
  const { theme: t, setTheme: o } = i();
  return /* @__PURE__ */ e.jsx(e.Fragment, {
    children: /* @__PURE__ */ e.jsxs(r, {
      className: "hover:bg-washed dark:hover:bg-washed-dark group relative",
      onClick: () => o(t === "light" ? "dark" : "light"),
      children: [
        /* @__PURE__ */ e.jsx(a, {
          show: t === "light",
          enter: "delay-200 transition ease-out duration-150",
          enterFrom: " opacity-0 translate-y-1",
          enterTo: " opacity-100 translate-y-0",
          leave: "duration-150",
          leaveFrom: "absolute opacity-100 translate-y-0",
          leaveTo: "absolute opacity-0 translate-y-1",
          children: /* @__PURE__ */ e.jsx(s, {
            className: " text-dim h-4 w-4 group-hover:text-black",
          }),
        }),
        /* @__PURE__ */ e.jsx(a, {
          show: t !== "light",
          enter: "delay-200 transition ease-out duration-150",
          enterFrom: "opacity-0 translate-y-1",
          enterTo: "opacity-100 translate-y-0",
          leave: "duration-150",
          leaveFrom: "absolute  opacity-100 translate-y-0",
          leaveTo: "absolute  opacity-0 translate-y-1",
          children: /* @__PURE__ */ e.jsx(n, {
            className: "text-dim -m-0.5 h-5 w-5 dark:group-hover:text-white",
          }),
        }),
      ],
    }),
  });
};
export { u as default };
