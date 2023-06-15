import { f as l } from "./function-call.js";
import { g as a } from "./get-built-in.js";
import { w as n } from "./well-known-symbol.js";
import { d as e } from "./define-built-in.js";
var m = l,
  f = a,
  v = n,
  u = e,
  w = function () {
    var r = f("Symbol"),
      o = r && r.prototype,
      i = o && o.valueOf,
      t = v("toPrimitive");
    o &&
      !o[t] &&
      u(
        o,
        t,
        function (y) {
          return m(i, this);
        },
        { arity: 1 }
      );
  };
export { w as s };
