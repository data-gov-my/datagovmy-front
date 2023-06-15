import { __module as o } from "../../../../_virtual/toConsumableArray.js";
import { __require as p } from "./arrayWithoutHoles.js";
import { __require as _ } from "./iterableToArray.js";
import { __require as l } from "./unsupportedIterableToArray.js";
import { __require as m } from "./nonIterableSpread.js";
var a;
function x() {
  return a
    ? o.exports
    : ((a = 1),
      (function (r) {
        var t = p(),
          u = _(),
          i = l(),
          s = m();
        function n(e) {
          return t(e) || u(e) || i(e) || s();
        }
        (r.exports = n), (r.exports.__esModule = !0), (r.exports.default = r.exports);
      })(o),
      o.exports);
}
export { x as __require };
