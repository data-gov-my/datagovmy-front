import o, { createContext as l, useContext as r } from "react";
let n = l(null);
n.displayName = "OpenClosedContext";
var a = (e => (
  (e[(e.Open = 1)] = "Open"),
  (e[(e.Closed = 2)] = "Closed"),
  (e[(e.Closing = 4)] = "Closing"),
  (e[(e.Opening = 8)] = "Opening"),
  e
))(a || {});
function d() {
  return r(n);
}
function i({ value: e, children: t }) {
  return o.createElement(n.Provider, { value: e }, t);
}
export { i as OpenClosedProvider, a as State, d as useOpenClosed };
