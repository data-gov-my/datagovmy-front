import { __exports as t } from "../../../_virtual/es.array.index-of.js";
import { _ } from "../internals/export.js";
import { f as x } from "../internals/function-uncurry-this-clause.js";
import { a as m } from "../internals/array-includes.js";
import { __require as O } from "../internals/array-method-is-strict.js";
var n;
function q() {
  if (n) return t;
  n = 1;
  var f = _,
    o = x,
    s = m.indexOf,
    u = O(),
    r = o([].indexOf),
    e = !!r && 1 / r([1], 1, -0) < 0,
    d = e || !u("indexOf");
  return (
    f(
      { target: "Array", proto: !0, forced: d },
      {
        indexOf: function (a) {
          var i = arguments.length > 1 ? arguments[1] : void 0;
          return e ? r(this, a, i) || 0 : s(this, a, i);
        },
      }
    ),
    t
  );
}
export { q as __require };
