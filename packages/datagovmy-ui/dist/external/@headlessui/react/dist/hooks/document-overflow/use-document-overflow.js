import { useIsoMorphicEffect as c } from "../use-iso-morphic-effect.js";
import { useStore as p } from "../use-store.js";
import { overflows as t } from "./overflow-store.js";
function n(o, r, f) {
  let e = p(t),
    s = o ? e.get(o) : void 0,
    i = s ? s.count > 0 : !1;
  return (
    c(() => {
      if (!(!o || !r)) return t.dispatch("PUSH", o, f), () => t.dispatch("POP", o, f);
    }, [r, o]),
    i
  );
}
export { n as useDocumentOverflowLockedEffect };
