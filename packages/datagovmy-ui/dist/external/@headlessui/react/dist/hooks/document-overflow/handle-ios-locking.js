import { isIOS as f } from "../../utils/platform.js";
function u() {
  if (!f()) return {};
  let r;
  return {
    before() {
      r = window.pageYOffset;
    },
    after({ doc: o, d: a, meta: c }) {
      function s(e) {
        return c.containers.flatMap(t => t()).some(t => t.contains(e));
      }
      a.style(o.body, "marginTop", `-${r}px`), window.scrollTo(0, 0);
      let n = null;
      a.addEventListener(
        o,
        "click",
        e => {
          if (e.target instanceof HTMLElement)
            try {
              let t = e.target.closest("a");
              if (!t) return;
              let { hash: l } = new URL(t.href),
                i = o.querySelector(l);
              i && !s(i) && (n = i);
            } catch {}
        },
        !0
      ),
        a.addEventListener(
          o,
          "touchmove",
          e => {
            e.target instanceof HTMLElement && !s(e.target) && e.preventDefault();
          },
          { passive: !1 }
        ),
        a.add(() => {
          window.scrollTo(0, window.pageYOffset + r),
            n && n.isConnected && (n.scrollIntoView({ block: "nearest" }), (n = null));
        });
    },
  };
}
export { u as handleIOSLocking };
