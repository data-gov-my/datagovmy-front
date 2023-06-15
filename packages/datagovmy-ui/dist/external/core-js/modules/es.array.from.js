import { __exports as r } from "../../../_virtual/es.array.from.js";
import { _ as s } from "../internals/export.js";
import { __require as _ } from "../internals/array-from.js";
import { c as i } from "../internals/check-correctness-of-iteration.js";
var e;
function y() {
  if (e) return r;
  e = 1;
  var o = s,
    a = _(),
    t = i,
    f = !t(function (m) {
      Array.from(m);
    });
  return (
    o(
      { target: "Array", stat: !0, forced: f },
      {
        from: a,
      }
    ),
    r
  );
}
export { y as __require };
