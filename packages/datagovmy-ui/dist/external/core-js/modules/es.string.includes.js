import { __exports as e } from "../../../_virtual/es.string.includes.js";
import { _ as g } from "../internals/export.js";
import { f } from "../internals/function-uncurry-this.js";
import { __require as m } from "../internals/not-a-regexp.js";
import { r as _ } from "../internals/require-object-coercible.js";
import { t as p } from "../internals/to-string.js";
import { __require as d } from "../internals/correct-is-regexp-logic.js";
var i;
function O() {
  if (i) return e;
  i = 1;
  var t = g,
    o = f,
    n = m(),
    s = _,
    r = p,
    u = d(),
    c = o("".indexOf);
  return (
    t(
      { target: "String", proto: !0, forced: !u("includes") },
      {
        includes: function (a) {
          return !!~c(r(s(this)), r(n(a)), arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    e
  );
}
export { O as __require };
