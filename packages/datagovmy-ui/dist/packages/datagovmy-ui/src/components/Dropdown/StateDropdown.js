import { j as i } from "../../../../../external/react/jsx-runtime.js";
import { WindowContext as b } from "../../hooks/useWindow.js";
import { statesOptions as c } from "../../lib/options.js";
import { useTranslation as y } from "../../hooks/useTranslation.js";
import { useRouter as N } from "next/router";
import { useContext as $, useMemo as g } from "react";
import k from "./index.js";
import { clx as C } from "../../../../../helpers.js";
const q = ({
  anchor: p,
  className: D,
  url: s,
  currentState: f,
  onChange: r,
  include: e,
  exclude: t,
  width: a = "w-64",
  sublabel: d,
  disabled: u = !1,
  hideOnScroll: h = !1,
  darkMode: v = !1,
}) => {
  const { t: w } = y(),
    n = N(),
    { scroll: l } = $(b),
    x = o => {
      if (o.value === "mys") {
        s && n.push(s, void 0, { scroll: !1 });
        return;
      }
      s && n.push(`${s}/${o.value}`, void 0, { scroll: !1 });
    },
    j = g(() => l.y > 300, [l.y]),
    m = e ? c.concat(e) : c;
  return /* @__PURE__ */ i.jsx("div", {
    className: C(h ? (j ? "hidden lg:block" : "hidden") : `block ${a}`),
    children: /* @__PURE__ */ i.jsx(k, {
      className: "flex-row items-center",
      onChange: o => (r ? r(o) : x(o)),
      disabled: u,
      selected: m.find(o => o.value === f),
      options: m.filter(o => !(t != null && t.includes(o.value))),
      placeholder: w("common:placeholder.state"),
      enableFlag: !0,
      anchor: p,
      darkMode: v,
      width: a,
      sublabel: d,
    }),
  });
};
export { q as default };
