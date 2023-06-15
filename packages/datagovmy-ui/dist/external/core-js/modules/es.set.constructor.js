import { __exports as r } from "../../../_virtual/es.set.constructor.js";
import { c as i } from "../internals/collection.js";
import { __require as s } from "../internals/collection-strong.js";
var t;
function l() {
  if (t) return r;
  t = 1;
  var e = i,
    o = s();
  return (
    e(
      "Set",
      function (n) {
        return function () {
          return n(this, arguments.length ? arguments[0] : void 0);
        };
      },
      o
    ),
    r
  );
}
export { l as __require };
