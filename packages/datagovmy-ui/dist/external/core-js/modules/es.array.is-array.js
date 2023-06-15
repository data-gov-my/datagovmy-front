import { __exports as r } from "../../../_virtual/es.array.is-array.js";
import { _ as i } from "../internals/export.js";
import { __require as t } from "../internals/is-array.js";
var a;
function u() {
  if (a) return r;
  a = 1;
  var e = i,
    s = t();
  return (
    e(
      { target: "Array", stat: !0 },
      {
        isArray: s,
      }
    ),
    r
  );
}
export { u as __require };
