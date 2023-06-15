import { g as a } from "./global.js";
import { i as o } from "./is-object.js";
var m = a,
  t = o,
  e = m.document,
  n = t(e) && t(e.createElement),
  i = function (r) {
    return n ? e.createElement(r) : {};
  };
export { i as d };
