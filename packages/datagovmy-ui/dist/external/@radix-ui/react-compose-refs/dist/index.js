import { useCallback as n } from "react";
function c(e, f) {
  typeof e == "function" ? e(f) : e != null && (e.current = f);
}
function t(...e) {
  return f => e.forEach(o => c(o, f));
}
function d(...e) {
  return n(t(...e), e);
}
export { t as composeRefs, d as useComposedRefs };
