import { useMemo as o } from "react";
import { getOwnerDocument as r } from "../utils/owner.js";
function m(...e) {
  return o(() => r(...e), [...e]);
}
export { m as useOwnerDocument };
