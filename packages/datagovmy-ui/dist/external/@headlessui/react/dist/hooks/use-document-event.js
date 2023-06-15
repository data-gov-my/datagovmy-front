import { useEffect as s } from "react";
import { useLatestValue as m } from "./use-latest-value.js";
function i(e, o, t) {
  let r = m(o);
  s(() => {
    function n(u) {
      r.current(u);
    }
    return document.addEventListener(e, n, t), () => document.removeEventListener(e, n, t);
  }, [e, t]);
}
export { i as useDocumentEvent };
