import { __exports as a } from "../../../_virtual/es.array.reduce.js";
import { _ as m } from "../internals/export.js";
import { __require as c } from "../internals/array-reduce.js";
import { __require as f } from "../internals/array-method-is-strict.js";
import { e as p } from "../internals/engine-v8-version.js";
import { __require as q } from "../internals/engine-is-node.js";
var t;
function O() {
  if (t) return a;
  t = 1;
  var u = m,
    i = c().left,
    o = f(),
    r = p,
    _ = q(),
    s = !_ && r > 79 && r < 83,
    n = s || !o("reduce");
  return (
    u(
      { target: "Array", proto: !0, forced: n },
      {
        reduce: function (d) {
          var e = arguments.length;
          return i(this, d, e, e > 1 ? arguments[1] : void 0);
        },
      }
    ),
    a
  );
}
export { O as __require };
