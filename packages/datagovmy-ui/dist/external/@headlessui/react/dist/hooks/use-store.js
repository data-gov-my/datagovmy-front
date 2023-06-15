import { useSyncExternalStore as r } from "../use-sync-external-store-shim/index.js";
function o(e) {
  return r(e.subscribe, e.getSnapshot, e.getSnapshot);
}
export { o as useStore };
