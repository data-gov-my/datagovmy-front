import { useState as s } from "react";
import { useIsoMorphicEffect as o } from "./use-iso-morphic-effect.js";
function u(t) {
  var e;
  if (t.type) return t.type;
  let n = (e = t.as) != null ? e : "button";
  if (typeof n == "string" && n.toLowerCase() === "button") return "button";
}
function p(t, e) {
  let [n, r] = s(() => u(t));
  return (
    o(() => {
      r(u(t));
    }, [t.type, t.as]),
    o(() => {
      n ||
        (e.current &&
          e.current instanceof HTMLButtonElement &&
          !e.current.hasAttribute("type") &&
          r("button"));
    }, [n, e]),
    n
  );
}
export { p as useResolveButtonType };
