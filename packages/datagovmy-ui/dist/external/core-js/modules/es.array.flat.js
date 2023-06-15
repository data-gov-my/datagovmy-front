import { __exports as a } from "../../../_virtual/es.array.flat.js";
import { _ } from "../internals/export.js";
import { __require as l } from "../internals/flatten-into-array.js";
import { t as y } from "../internals/to-object.js";
import { l as v } from "../internals/length-of-array-like.js";
import { t as g } from "../internals/to-integer-or-infinity.js";
import { a as c } from "../internals/array-species-create.js";
var n;
function L() {
  if (n) return a;
  n = 1;
  var o = _,
    i = l(),
    f = y,
    s = v,
    m = g,
    u = c;
  return (
    o(
      { target: "Array", proto: !0 },
      {
        flat: function () {
          var e = arguments.length ? arguments[0] : void 0,
            r = f(this),
            p = s(r),
            t = u(r, 0);
          return (t.length = i(t, r, r, p, 0, e === void 0 ? 1 : m(e))), t;
        },
      }
    ),
    a
  );
}
export { L as __require };
