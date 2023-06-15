import { p } from "./path.js";
import { h as a } from "./has-own-property.js";
import "./well-known-symbol-wrapped.js";
import "./object-define-property.js";
import { __exports as m } from "../../../_virtual/object-define-property.js";
import { __exports as t } from "../../../_virtual/well-known-symbol-wrapped.js";
var e = p,
  l = a,
  n = t,
  f = m.f,
  S = function (o) {
    var r = e.Symbol || (e.Symbol = {});
    l(r, o) ||
      f(r, o, {
        value: n.f(o),
      });
  };
export { S as w };
