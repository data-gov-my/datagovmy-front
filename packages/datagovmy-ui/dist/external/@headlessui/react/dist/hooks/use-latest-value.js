import { useRef as e } from "react";
import { useIsoMorphicEffect as o } from "./use-iso-morphic-effect.js";
function f(r) {
  let t = e(r);
  return (
    o(() => {
      t.current = r;
    }, [r]),
    t
  );
}
export { f as useLatestValue };
