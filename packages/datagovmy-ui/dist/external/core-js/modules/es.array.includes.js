import { __exports as r } from "../../../_virtual/es.array.includes.js";
import { _ as t } from "../internals/export.js";
import { a as d } from "../internals/array-includes.js";
import { f as c } from "../internals/fails.js";
import { a as l } from "../internals/add-to-unscopables.js";
var a;
function g() {
  if (a) return r;
  a = 1;
  var e = t,
    s = d.includes,
    n = c,
    i = l,
    u = n(function () {
      return !Array(1).includes();
    });
  return (
    e(
      { target: "Array", proto: !0, forced: u },
      {
        includes: function (o) {
          return s(this, o, arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    i("includes"),
    r
  );
}
export { g as __require };
