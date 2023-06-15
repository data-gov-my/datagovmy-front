import * as e from "react";
import { useSyncExternalStore as t } from "./useSyncExternalStoreShimClient.js";
import { useSyncExternalStore as o } from "./useSyncExternalStoreShimServer.js";
const r =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  a = !r,
  c = a ? o : t,
  i = "useSyncExternalStore" in e ? (n => n.useSyncExternalStore)(e) : c;
export { i as useSyncExternalStore };
