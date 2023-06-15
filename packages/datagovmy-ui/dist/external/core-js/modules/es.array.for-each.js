import { __exports as a } from "../../../_virtual/es.array.for-each.js";
import { _ } from "../internals/export.js";
import { __require as t } from "../internals/array-for-each.js";
var o;
function s() {
  if (o) return a;
  o = 1;
  var e = _,
    r = t();
  return (
    e(
      { target: "Array", proto: !0, forced: [].forEach != r },
      {
        forEach: r,
      }
    ),
    a
  );
}
export { s as __require };
