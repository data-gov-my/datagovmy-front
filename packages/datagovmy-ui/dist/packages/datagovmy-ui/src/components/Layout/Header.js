import { j as e } from "../../../../../external/react/jsx-runtime.js";
import n from "next/link";
import m from "next/image";
import { useTranslation as r } from "../../hooks/useTranslation.js";
import t from "../Nav/index.js";
import s from "../Container/index.js";
const j = ({ stateSelector: o }) => {
  const { t: i } = r("common");
  return /* @__PURE__ */ e.jsx("div", {
    className: "dark:border-washed-dark fixed left-0 top-0 z-30 w-full border-b",
    children: /* @__PURE__ */ e.jsx(s, {
      background: "bg-white dark:bg-black",
      className: "flex items-center gap-4 py-[11px]",
      children: /* @__PURE__ */ e.jsxs("div", {
        className: "flex w-full items-center gap-4",
        children: [
          /* @__PURE__ */ e.jsx(n, {
            href: "/",
            children: /* @__PURE__ */ e.jsxs("div", {
              className: "flex cursor-pointer gap-2",
              children: [
                /* @__PURE__ */ e.jsx("div", {
                  className: "flex w-8 items-center justify-center",
                  children: /* @__PURE__ */ e.jsx(m, {
                    src: "/static/images/logo.png",
                    width: 48,
                    height: 36,
                    alt: "datagovmy_logo",
                  }),
                }),
                /* @__PURE__ */ e.jsx("h4", { children: "data.gov.my" }),
              ],
            }),
          }),
          /* @__PURE__ */ e.jsx(t, {
            stateSelector: o,
            children: a =>
              /* @__PURE__ */ e.jsxs(e.Fragment, {
                children: [
                  /* @__PURE__ */ e.jsx(
                    t.Item,
                    { title: i("common:nav.home"), link: "/", onClick: a },
                    "/"
                  ),
                  /* @__PURE__ */ e.jsx(
                    t.Item,
                    {
                      title: i("common:nav.dashboards"),
                      link: "/dashboard",
                      onClick: a,
                    },
                    "/dashboard"
                  ),
                  /* @__PURE__ */ e.jsx(
                    t.Item,
                    {
                      title: i("common:nav.catalogue"),
                      link: "/data-catalogue",
                      onClick: a,
                    },
                    "/data-catalogue"
                  ),
                  /* @__PURE__ */ e.jsx(t.Item, { title: "API Docs", link: "#", onClick: a }),
                  /* @__PURE__ */ e.jsx(
                    t.Item,
                    {
                      title: i("common:nav.community"),
                      link: "/community",
                      onClick: a,
                    },
                    "/community"
                  ),
                  /* @__PURE__ */ e.jsx(
                    t.Item,
                    {
                      title: i("common:nav.helpdesk"),
                      link: "/helpdesk",
                      onClick: a,
                    },
                    "/heldesk"
                  ),
                ],
              }),
          }),
        ],
      }),
    }),
  });
};
export { j as default };
