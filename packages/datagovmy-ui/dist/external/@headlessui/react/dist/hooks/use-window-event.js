import { useEffect as i } from "react";
import { useLatestValue as u } from "./use-latest-value.js";
function d(e, o, t) {
  let r = u(o);
  i(() => {
    function n(s) {
      r.current(s);
    }
    return window.addEventListener(e, n, t), () => window.removeEventListener(e, n, t);
  }, [e, t]);
}
export { d as useWindowEvent };
