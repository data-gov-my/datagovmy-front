import { j as r } from "../../../../../external/react/jsx-runtime.js";
import { useMemo as k } from "react";
import f from "../Container/index.js";
import { clx as d, toDate as u } from "../../../../../helpers.js";
import { useTranslation as x } from "next-i18next";
const N = ({
  background: o = "gray",
  className: c,
  children: l,
  category: e,
  header: t,
  description: a,
  last_updated: m,
  agencyBadge: s,
}) => {
  const { t: n, i18n: i } = x(),
    b = k(() => {
      switch (o) {
        case "blue":
          return "bg-gradient-radial from-[#A1BFFF] to-background dark:from-[#203053] dark:to-black";
        case "red":
          return "bg-gradient-radial from-[#FFE1E1] to-background dark:from-[#492424] dark:to-black";
        case "purple":
          return "bg-gradient-radial from-[#C4B5FD] to-background dark:from-[#281843] dark:to-black";
        case "green":
          return "bg-gradient-radial from-[#CFFCCC] to-background dark:from-[#1B2C1A] dark:to-black";
        case "orange":
          return "bg-gradient-radial from-[#FFE5CD] to-background dark:from-[#2E2014] dark:to-black";
        default:
          return "bg-gradient-radial from-[#E2E8F0] to-background dark:from-[#3F3F46] dark:to-black";
      }
    }, [o]);
  return /* @__PURE__ */ r.jsx(r.Fragment, {
    children: /* @__PURE__ */ r.jsxs(f, {
      background: b.concat(" border-b dark:border-washed-dark"),
      className: d("relative", c),
      children: [
        /* @__PURE__ */ r.jsx("div", {
          className: "sticky left-0 top-14 z-10 flex flex-row-reverse md:hidden md:pb-0",
          children: s,
        }),
        l ||
          /* @__PURE__ */ r.jsx(r.Fragment, {
            children: /* @__PURE__ */ r.jsxs("div", {
              className: "space-y-6 py-12 xl:w-full",
              children: [
                (e || s) &&
                  /* @__PURE__ */ r.jsxs("div", {
                    className: "relative flex justify-between",
                    children: [
                      /* @__PURE__ */ r.jsx("div", {
                        className: "hidden md:absolute md:right-0 md:top-0 md:block",
                        children: s,
                      }),
                      e &&
                        /* @__PURE__ */ r.jsx("span", {
                          className: d("text-base font-semibold uppercase", e[1]),
                          children: n(e[0]),
                        }),
                    ],
                  }),
                (t || a) &&
                  /* @__PURE__ */ r.jsxs("div", {
                    className: "space-y-3",
                    children: [
                      t &&
                        /* @__PURE__ */ r.jsx("h2", {
                          className: d("text-black", t[1]),
                          children: t[0],
                        }),
                      a && Array.isArray(a)
                        ? /* @__PURE__ */ r.jsx("p", {
                            className: d("text-dim xl:w-2/3", a[1]),
                            children: a[0],
                          })
                        : a,
                    ],
                  }),
                m &&
                  /* @__PURE__ */ r.jsx("p", {
                    className: "text-dim text-sm",
                    children: n("common:common.last_updated", {
                      date: u(m, "dd MMM yyyy, HH:mm", i.language),
                    }),
                  }),
              ],
            }),
          }),
      ],
    }),
  });
};
export { N as default };
