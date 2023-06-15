import { useIsoMorphicEffect as s } from "./use-iso-morphic-effect.js";
let a = /* @__PURE__ */ new Map(),
  t = /* @__PURE__ */ new Map();
function c(r, u = !0) {
  s(() => {
    var d;
    if (!u) return;
    let e = typeof r == "function" ? r() : r.current;
    if (!e) return;
    function o() {
      var f;
      if (!e) return;
      let n = (f = t.get(e)) != null ? f : 1;
      if ((n === 1 ? t.delete(e) : t.set(e, n - 1), n !== 1)) return;
      let i = a.get(e);
      i &&
        (i["aria-hidden"] === null
          ? e.removeAttribute("aria-hidden")
          : e.setAttribute("aria-hidden", i["aria-hidden"]),
        (e.inert = i.inert),
        a.delete(e));
    }
    let l = (d = t.get(e)) != null ? d : 0;
    return (
      t.set(e, l + 1),
      l !== 0 ||
        (a.set(e, { "aria-hidden": e.getAttribute("aria-hidden"), "inert": e.inert }),
        e.setAttribute("aria-hidden", "true"),
        (e.inert = !0)),
      o
    );
  }, [r, u]);
}
export { c as useInert };
