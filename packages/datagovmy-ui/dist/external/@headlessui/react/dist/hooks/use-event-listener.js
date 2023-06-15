import { useEffect as u } from "react";
import { useLatestValue as f } from "./use-latest-value.js";
function E(e, t, i, r) {
  let n = f(i);
  u(() => {
    e = e ?? window;
    function s(o) {
      n.current(o);
    }
    return e.addEventListener(t, s, r), () => e.removeEventListener(t, s, r);
  }, [e, t, r]);
}
export { E as useEventListener };
