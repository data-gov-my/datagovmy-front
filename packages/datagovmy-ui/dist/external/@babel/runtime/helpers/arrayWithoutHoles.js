import { __module as e } from "../../../../_virtual/arrayWithoutHoles.js";
import { __require as s } from "./arrayLikeToArray.js";
var o;
function n() {
  return o
    ? e.exports
    : ((o = 1),
      (function (r) {
        var a = s();
        function i(t) {
          if (Array.isArray(t)) return a(t);
        }
        (r.exports = i), (r.exports.__esModule = !0), (r.exports.default = r.exports);
      })(e),
      e.exports);
}
export { n as __require };
