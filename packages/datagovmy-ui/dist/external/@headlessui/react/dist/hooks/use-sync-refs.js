import { useRef as f, useEffect as l } from "react";
import { useEvent as c } from "./use-event.js";
let t = Symbol();
function a(e, o = !0) {
  return Object.assign(e, { [t]: o });
}
function m(...e) {
  let o = f(e);
  l(() => {
    o.current = e;
  }, [e]);
  let u = c(n => {
    for (let r of o.current) r != null && (typeof r == "function" ? r(n) : (r.current = n));
  });
  return e.every(n => n == null || (n == null ? void 0 : n[t])) ? void 0 : u;
}
export { a as optionalRef, m as useSyncRefs };
