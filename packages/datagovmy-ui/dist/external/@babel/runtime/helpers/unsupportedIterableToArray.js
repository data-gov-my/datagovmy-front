import { __module as a } from "../../../../_virtual/unsupportedIterableToArray.js";
import { __require as i } from "./arrayLikeToArray.js";
var n;
function y() {
  return n
    ? a.exports
    : ((n = 1),
      (function (t) {
        var o = i();
        function p(r, u) {
          if (r) {
            if (typeof r == "string") return o(r, u);
            var e = Object.prototype.toString.call(r).slice(8, -1);
            if (
              (e === "Object" && r.constructor && (e = r.constructor.name),
              e === "Map" || e === "Set")
            )
              return Array.from(r);
            if (e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))
              return o(r, u);
          }
        }
        (t.exports = p), (t.exports.__esModule = !0), (t.exports.default = t.exports);
      })(a),
      a.exports);
}
export { y as __require };
