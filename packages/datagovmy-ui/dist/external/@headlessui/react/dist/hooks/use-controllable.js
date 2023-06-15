import { useState as s, useRef as o } from "react";
import { useEvent as h } from "./use-event.js";
function p(r, t, a) {
  let [i, d] = s(a),
    e = r !== void 0,
    n = o(e),
    u = o(!1),
    c = o(!1);
  return (
    e && !n.current && !u.current
      ? ((u.current = !0),
        (n.current = e),
        console.error(
          "A component is changing from uncontrolled to controlled. This may be caused by the value changing from undefined to a defined value, which should not happen."
        ))
      : !e &&
        n.current &&
        !c.current &&
        ((c.current = !0),
        (n.current = e),
        console.error(
          "A component is changing from controlled to uncontrolled. This may be caused by the value changing from a defined value to undefined, which should not happen."
        )),
    [e ? r : i, h(l => (e || d(l), t == null ? void 0 : t(l)))]
  );
}
export { p as useControllable };
