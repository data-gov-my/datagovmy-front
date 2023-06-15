import { useRef as a, useEffect as p } from "react";
import { isFocusableElement as v, FocusableMode as E } from "../utils/focus-management.js";
import { useDocumentEvent as s } from "./use-document-event.js";
import { useWindowEvent as w } from "./use-window-event.js";
function A(f, m, c = !0) {
  let l = a(!1);
  p(() => {
    requestAnimationFrame(() => {
      l.current = c;
    });
  }, [c]);
  function i(e, u) {
    if (!l.current || e.defaultPrevented) return;
    let n = u(e);
    if (n === null || !n.getRootNode().contains(n)) return;
    let d = (function r(t) {
      return typeof t == "function" ? r(t()) : Array.isArray(t) || t instanceof Set ? t : [t];
    })(f);
    for (let r of d) {
      if (r === null) continue;
      let t = r instanceof HTMLElement ? r : r.current;
      if ((t != null && t.contains(n)) || (e.composed && e.composedPath().includes(t))) return;
    }
    return !v(n, E.Loose) && n.tabIndex !== -1 && e.preventDefault(), m(e, n);
  }
  let o = a(null);
  s(
    "mousedown",
    e => {
      var u, n;
      l.current &&
        (o.current =
          ((n = (u = e.composedPath) == null ? void 0 : u.call(e)) == null ? void 0 : n[0]) ||
          e.target);
    },
    !0
  ),
    s(
      "click",
      e => {
        o.current && (i(e, () => o.current), (o.current = null));
      },
      !0
    ),
    w(
      "blur",
      e =>
        i(e, () =>
          window.document.activeElement instanceof HTMLIFrameElement
            ? window.document.activeElement
            : null
        ),
      !0
    );
}
export { A as useOutsideClick };
