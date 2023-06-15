import a from "react";
import { useLatestValue as u } from "./use-latest-value.js";
let l = function (t) {
  let e = u(t);
  return a.useCallback((...r) => e.current(...r), [e]);
};
export { l as useEvent };
