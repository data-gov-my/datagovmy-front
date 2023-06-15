import "./object-define-property.js";
import { h as i } from "./has-own-property.js";
import { w as p } from "./well-known-symbol.js";
import { __exports as a } from "../../../_virtual/object-define-property.js";
var f = a.f,
  m = i,
  s = p,
  r = s("toStringTag"),
  y = function (o, n, e) {
    o && !e && (o = o.prototype), o && !m(o, r) && f(o, r, { configurable: !0, value: n });
  };
export { y as s };
