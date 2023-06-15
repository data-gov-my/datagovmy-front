import { useRef as o, useEffect as n } from "react";
import { microTask as u } from "../utils/micro-task.js";
import { useEvent as m } from "./use-event.js";
function i(t) {
  let e = m(t),
    r = o(!1);
  n(
    () => (
      (r.current = !1),
      () => {
        (r.current = !0),
          u(() => {
            r.current && e();
          });
      }
    ),
    [e]
  );
}
export { i as useOnUnmount };
