import { j as e } from "../../../../../external/react/jsx-runtime.js";
import s from "next/image";
import { useTranslation as l } from "next-i18next";
import o from "../Container/index.js";
import n from "../At/index.js";
const i = () => {
  const { t: a } = l();
  return /* @__PURE__ */ e.jsx(o, {
    background:
      "bg-washed dark:bg-black border-t border-outline dark:border-washed-dark pt-12 pb-16 z-10",
    children: /* @__PURE__ */ e.jsxs("div", {
      className: "flex w-full flex-col gap-6 text-sm md:flex-row md:justify-between md:gap-0",
      children: [
        /* @__PURE__ */ e.jsxs("div", {
          className: "flex flex-row gap-4",
          children: [
            /* @__PURE__ */ e.jsx("div", {
              className: "mt-1 w-12",
              children: /* @__PURE__ */ e.jsx(s, {
                src: "/static/images/jata_logo.png",
                width: 48,
                height: 36,
                alt: "jata negara",
              }),
            }),
            /* @__PURE__ */ e.jsxs("div", {
              children: [
                /* @__PURE__ */ e.jsx("div", {
                  className: "mb-2 uppercase",
                  children: /* @__PURE__ */ e.jsx("p", {
                    className: "text-base font-bold",
                    children: a("common:nav.gov"),
                  }),
                }),
                /* @__PURE__ */ e.jsxs("p", {
                  className: "text-dim",
                  children: [
                    "© ",
                    /* @__PURE__ */ new Date().getFullYear(),
                    " ",
                    a("common:nav.public_open_data"),
                  ],
                }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ e.jsxs("div", {
          className: "flex flex-row gap-8 md:gap-14",
          children: [
            /* @__PURE__ */ e.jsxs("div", {
              className: "flex w-full flex-col gap-2 md:w-auto",
              children: [
                /* @__PURE__ */ e.jsx("p", {
                  className: "font-bold",
                  children: a("common:nav.open_source"),
                }),
                /* @__PURE__ */ e.jsx("a", {
                  className: "text-footer-link",
                  href: "#",
                  target: "_blank",
                  children: a("common:nav.frontend"),
                }),
                /* @__PURE__ */ e.jsx("a", {
                  className: "text-footer-link",
                  href: "#",
                  target: "_blank",
                  children: a("common:nav.backend"),
                }),
                /* @__PURE__ */ e.jsx("a", {
                  className: "text-footer-link",
                  href: "#",
                  target: "_blank",
                  children: a("common:nav.uiux"),
                }),
              ],
            }),
            /* @__PURE__ */ e.jsxs("div", {
              className: "flex w-full flex-col gap-2 md:w-auto",
              children: [
                /* @__PURE__ */ e.jsx("p", {
                  className: "font-bold",
                  children: a("common:nav.open_data"),
                }),
                /* @__PURE__ */ e.jsx("a", {
                  className: "text-footer-link",
                  href: "#",
                  target: "_blank",
                  children: a("common:nav.guiding_principles"),
                }),
                /* @__PURE__ */ e.jsx(n, {
                  className: "text-footer-link",
                  href: "#",
                  children: a("common:nav.terms_of_use"),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
};
export { i as default };
