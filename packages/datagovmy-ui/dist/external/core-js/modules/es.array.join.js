import { __exports as e } from "../../../_virtual/es.array.join.js";
import { _ as c } from "../internals/export.js";
import { f } from "../internals/function-uncurry-this.js";
import { i as j } from "../internals/indexed-object.js";
import { t as m } from "../internals/to-indexed-object.js";
import { __require as v } from "../internals/array-method-is-strict.js";
var t;
function q() {
  if (t) return e;
  t = 1;
  var i = c,
    o = f,
    a = j,
    n = m,
    s = v(),
    u = o([].join),
    _ = a != Object,
    d = _ || !s("join", ",");
  return (
    i(
      { target: "Array", proto: !0, forced: d },
      {
        join: function (r) {
          return u(n(this), r === void 0 ? "," : r);
        },
      }
    ),
    e
  );
}
export { q as __require };
