import { __exports as r } from "../../../_virtual/es.array.map.js";
import { _ as s } from "../internals/export.js";
import { a as i } from "../internals/array-iteration.js";
import { a as u } from "../internals/array-method-has-species-support.js";
var a;
function d() {
  if (a) return r;
  a = 1;
  var e = s,
    t = i.map,
    p = u,
    o = p("map");
  return (
    e(
      { target: "Array", proto: !0, forced: !o },
      {
        map: function (m) {
          return t(this, m, arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    r
  );
}
export { d as __require };
