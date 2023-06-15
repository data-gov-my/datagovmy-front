import { useRef as s } from "react";
import { useWindowEvent as a } from "./use-window-event.js";
var o = (e => ((e[(e.Forwards = 0)] = "Forwards"), (e[(e.Backwards = 1)] = "Backwards"), e))(
  o || {}
);
function i() {
  let e = s(0);
  return (
    a(
      "keydown",
      r => {
        r.key === "Tab" && (e.current = r.shiftKey ? 1 : 0);
      },
      !0
    ),
    e
  );
}
export { o as Direction, i as useTabDirection };
