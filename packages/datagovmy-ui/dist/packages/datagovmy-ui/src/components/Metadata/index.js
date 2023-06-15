import { j as t } from "../../../../../external/react/jsx-runtime.js";
import r from "next/head";
import { useTranslation as m } from "next-i18next";
const d = ({ title: o, description: a, keywords: n }) => {
  const { t: i } = m(),
    e = {
      title: o ? o.concat(" | data.gov.my") : "data.gov.my",
      icon: "/favicon.ico",
      description: a || i("common:site.description"),
      author: "Government of Malaysia",
      themeColor: "#13293D",
      keywords: n ?? "data dosm statistics malaysia",
      domain: "data.gov.my",
      url: "https://data.gov.my",
      image: "https://open.dosm.gov.my/static/images/jata_512.png",
    };
  return /* @__PURE__ */ t.jsxs(r, {
    children: [
      /* @__PURE__ */ t.jsx("title", { children: e.title }),
      /* @__PURE__ */ t.jsx("link", { rel: "shortcut icon", href: e.icon, type: "image/x-icon" }),
      /* @__PURE__ */ t.jsx("meta", {
        name: "viewport",
        content: "initial-scale=1.0, width=device-width",
      }),
      /* @__PURE__ */ t.jsx("meta", { name: "description", content: e.description }),
      /* @__PURE__ */ t.jsx("meta", { name: "author", content: e.author }),
      /* @__PURE__ */ t.jsx("meta", { name: "theme-color", content: e.themeColor }),
      /* @__PURE__ */ t.jsx("meta", { property: "og:url", content: e.url }),
      /* @__PURE__ */ t.jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ t.jsx("meta", { property: "og:title", content: e.title }),
      /* @__PURE__ */ t.jsx("meta", { property: "og:description", content: e.description }),
      /* @__PURE__ */ t.jsx("meta", { property: "og:image", content: e.image }),
      /* @__PURE__ */ t.jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ t.jsx("meta", { property: "twitter:domain", content: e.domain }),
      /* @__PURE__ */ t.jsx("meta", { property: "twitter:url", content: e.url }),
      /* @__PURE__ */ t.jsx("meta", { name: "twitter:title", content: e.title }),
      /* @__PURE__ */ t.jsx("meta", { name: "twitter:description", content: e.description }),
      /* @__PURE__ */ t.jsx("meta", { name: "twitter:image", content: e.image }),
    ],
  });
};
export { d as default };
