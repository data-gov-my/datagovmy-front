import { w as a } from "./well-known-symbol.js";
import { o as t } from "./object-create.js";
import "./object-define-property.js";
import { __exports as n } from "../../../_virtual/object-define-property.js";
var p = a,
  l = t,
  f = n.f,
  r = p("unscopables"),
  o = Array.prototype;
o[r] == null &&
  f(o, r, {
    configurable: !0,
    value: l(null),
  });
var y = function (e) {
  o[r][e] = !0;
};
export { y as a };
