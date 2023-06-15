import { __module as t } from "../../../../_virtual/toPropertyKey.js";
import { _ as y } from "./typeof.js";
import { __require as _ } from "./toPrimitive.js";
var o;
function x() {
  return o
    ? t.exports
    : ((o = 1),
      (function (r) {
        var i = y.default,
          p = _();
        function s(u) {
          var e = p(u, "string");
          return i(e) === "symbol" ? e : String(e);
        }
        (r.exports = s), (r.exports.__esModule = !0), (r.exports.default = r.exports);
      })(t),
      t.exports);
}
export { x as __require };
