import c, { useRef as f, useMemo as m } from "react";
import { Hidden as d, Features as p } from "../internal/hidden.js";
import { useEvent as l } from "./use-event.js";
import { useOwnerDocument as h } from "./use-owner.js";
function v({ defaultContainers: a = [], portals: o } = {}) {
  let t = f(null),
    u = h(t),
    s = l(() => {
      var r;
      let n = [];
      for (let e of a)
        e !== null &&
          (e instanceof HTMLElement
            ? n.push(e)
            : "current" in e && e.current instanceof HTMLElement && n.push(e.current));
      if (o != null && o.current) for (let e of o.current) n.push(e);
      for (let e of (r = u == null ? void 0 : u.querySelectorAll("html > *, body > *")) != null
        ? r
        : [])
        e !== document.body &&
          e !== document.head &&
          e instanceof HTMLElement &&
          e.id !== "headlessui-portal-root" &&
          (e.contains(t.current) || n.some(i => e.contains(i)) || n.push(e));
      return n;
    });
  return {
    resolveContainers: s,
    contains: l(r => s().some(n => n.contains(r))),
    mainTreeNodeRef: t,
    MainTreeNode: m(
      () =>
        function () {
          return c.createElement(d, { features: p.Hidden, ref: t });
        },
      [t]
    ),
  };
}
export { v as useRootContainers };
