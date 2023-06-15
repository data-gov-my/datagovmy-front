import { j as e } from "../../../../../external/react/jsx-runtime.js";
import { toDate as i } from "../../../../../helpers.js";
import { useTranslation as c } from "../../hooks/useTranslation.js";
import { forwardRef as d, useMemo as p } from "react";
import { DateTime as g } from "luxon";
const y = d(
  (
    {
      title: l,
      className: n = "border-b dark:border-b-outlineHover-dark py-8 lg:py-12",
      description: r,
      children: o,
      date: s,
      menu: a,
    },
    t
  ) => {
    const { t: x, i18n: m } = c("common"),
      f = p(
        () =>
          s == null
            ? ""
            : typeof s == "string"
            ? g.fromSQL(s).isValid && s.length > 4
              ? i(s, "dd MMM yyyy, HH:mm", m.language)
              : s
            : i(s, "dd MMM yyyy, HH:mm", m.language),
        [s]
      );
    return /* @__PURE__ */ e.jsx("section", {
      className: n,
      ref: t,
      children: /* @__PURE__ */ e.jsxs("div", {
        className: "flex flex-col gap-6 lg:gap-8",
        children: [
          l || s || r
            ? /* @__PURE__ */ e.jsxs("div", {
                className: "space-y-2",
                children: [
                  /* @__PURE__ */ e.jsxs("div", {
                    className:
                      "flex flex-col flex-wrap items-start gap-2 lg:flex-row lg:items-center lg:justify-between",
                    children: [
                      l && typeof l == "string" ? /* @__PURE__ */ e.jsx("h4", { children: l }) : l,
                      s &&
                        s !== null &&
                        /* @__PURE__ */ e.jsx("span", {
                          className: "text-dim text-right text-sm",
                          children: x("common:common.data_of", { date: f }),
                        }),
                    ],
                  }),
                  (r || a) &&
                    /* @__PURE__ */ e.jsxs("div", {
                      className:
                        "text-dim flex flex-wrap gap-x-6 gap-y-3 md:flex-nowrap md:items-end md:justify-between",
                      children: [
                        r && typeof r == "string"
                          ? /* @__PURE__ */ e.jsx("p", {
                              className: [
                                "whitespace-pre-line text-base",
                                a ? "md:max-w-[70%]" : "",
                              ].join(" "),
                              children: r,
                            })
                          : /* @__PURE__ */ e.jsx("div", { children: r }),
                        a &&
                          /* @__PURE__ */ e.jsx("div", {
                            className: "flex w-full justify-end gap-3 md:w-auto",
                            children: a,
                          }),
                      ],
                    }),
                ],
              })
            : /* @__PURE__ */ e.jsx(e.Fragment, {}),
          /* @__PURE__ */ e.jsx("div", { children: o }),
        ],
      }),
    });
  }
);
y.displayName = "Section";
export { y as default };
