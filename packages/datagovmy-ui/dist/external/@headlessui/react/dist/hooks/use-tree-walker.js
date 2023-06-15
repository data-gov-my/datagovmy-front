import { useRef as i, useEffect as m } from "react";
import { useIsoMorphicEffect as d } from "./use-iso-morphic-effect.js";
import { getOwnerDocument as E } from "../utils/owner.js";
function T({ container: e, accept: r, walk: t, enabled: c = !0 }) {
  let o = i(r),
    n = i(t);
  m(() => {
    (o.current = r), (n.current = t);
  }, [r, t]),
    d(() => {
      if (!e || !c) return;
      let u = E(e);
      if (!u) return;
      let f = o.current,
        l = n.current,
        s = Object.assign(p => f(p), { acceptNode: f }),
        a = u.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, s, !1);
      for (; a.nextNode(); ) l(a.currentNode);
    }, [e, c, o, n]);
}
export { T as useTreeWalker };
