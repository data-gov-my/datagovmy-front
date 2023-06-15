import { useState as u } from "react";
import { useIsoMorphicEffect as m } from "./use-iso-morphic-effect.js";
import { useLatestValue as a } from "./use-latest-value.js";
function c(t, o) {
  let [s, r] = u(t),
    e = a(t);
  return m(() => r(e.current), [e, r, ...o]), s;
}
export { c as useComputed };
