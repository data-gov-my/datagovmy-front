import { g as e } from "./get-built-in.js";
import { f as a } from "./function-uncurry-this.js";
import "./object-get-own-property-names.js";
import "./object-get-own-property-symbols.js";
import { a as n } from "./an-object.js";
import { __exports as s } from "../../../_virtual/object-get-own-property-names.js";
import { __exports as m } from "../../../_virtual/object-get-own-property-symbols.js";
var p = e,
  y = a,
  c = s,
  i = m,
  f = n,
  u = y([].concat),
  _ =
    p("Reflect", "ownKeys") ||
    function (r) {
      var o = c.f(f(r)),
        t = i.f;
      return t ? u(o, t(r)) : o;
    };
export { _ as o };
