import { __exports as e } from "../../../_virtual/es.function.name.js";
import { d as m } from "../internals/descriptors.js";
import { f as p } from "../internals/function-name.js";
import { f as _ } from "../internals/function-uncurry-this.js";
import { d as v } from "../internals/define-built-in-accessor.js";
var o;
function h() {
  if (o) return e;
  o = 1;
  var i = m,
    a = p.EXISTS,
    r = _,
    u = v,
    n = Function.prototype,
    c = r(n.toString),
    t = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,
    s = r(t.exec),
    f = "name";
  return (
    i &&
      !a &&
      u(n, f, {
        configurable: !0,
        get: function () {
          try {
            return s(t, c(this))[1];
          } catch {
            return "";
          }
        },
      }),
    e
  );
}
export { h as __require };
