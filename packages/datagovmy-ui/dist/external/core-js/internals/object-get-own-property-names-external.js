import { __exports as a } from "../../../_virtual/object-get-own-property-names-external.js";
import { c as n } from "./classof-raw.js";
import { t as m } from "./to-indexed-object.js";
import "./object-get-own-property-names.js";
import { a as s } from "./array-slice-simple.js";
import { __exports as p } from "../../../_virtual/object-get-own-property-names.js";
var w = n,
  c = m,
  t = p.f,
  i = s,
  o =
    typeof window == "object" && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window)
      : [],
  f = function (e) {
    try {
      return t(e);
    } catch {
      return i(o);
    }
  };
a.f = function (r) {
  return o && w(r) == "Window" ? f(r) : t(c(r));
};
export { a as default };
