import { useRef as c, useEffect as i } from "react";
import { useEvent as l } from "./use-event.js";
function p(o, e) {
  let r = c([]),
    t = l(o);
  i(() => {
    let f = [...r.current];
    for (let [n, u] of e.entries())
      if (r.current[n] !== u) {
        let s = t(e, f);
        return (r.current = e), s;
      }
  }, [t, ...e]);
}
export { p as useWatch };
