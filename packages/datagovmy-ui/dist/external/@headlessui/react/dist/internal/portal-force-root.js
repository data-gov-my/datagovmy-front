import r, { createContext as o, useContext as n } from "react";
let t = o(!1);
function c() {
  return n(t);
}
function l(e) {
  return r.createElement(t.Provider, { value: e.force }, e.children);
}
export { l as ForcePortalRoot, c as usePortalRoot };
