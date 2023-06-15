import { useState as m, useCallback as o } from "react";
import { useIsMounted as f } from "./use-is-mounted.js";
function i(s = 0) {
  let [l, r] = m(s),
    a = f(),
    u = o(
      e => {
        a.current && r(t => t | e);
      },
      [l, a]
    ),
    g = o(e => !!(l & e), [l]),
    n = o(
      e => {
        a.current && r(t => t & ~e);
      },
      [r, a]
    ),
    c = o(
      e => {
        a.current && r(t => t ^ e);
      },
      [r]
    );
  return { flags: l, addFlag: u, hasFlag: g, removeFlag: n, toggleFlag: c };
}
export { i as useFlags };
