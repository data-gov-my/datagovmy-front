import { __exports as r } from "../../../_virtual/es.array.some.js";
import { _ as i } from "../internals/export.js";
import { a as _ } from "../internals/array-iteration.js";
import { __require as u } from "../internals/array-method-is-strict.js";
var e;
function c() {
  if (e) return r;
  e = 1;
  var a = i,
    t = _.some,
    o = u(),
    s = o("some");
  return (
    a(
      { target: "Array", proto: !0, forced: !s },
      {
        some: function (m) {
          return t(this, m, arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    r
  );
}
export { c as __require };
