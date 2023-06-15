import { __module as t } from "../../../../_virtual/toPrimitive.js";
import { _ as s } from "./typeof.js";
var a;
function p() {
  return a
    ? t.exports
    : ((a = 1),
      (function (e) {
        var i = s.default;
        function m(r, o) {
          if (i(r) !== "object" || r === null) return r;
          var f = r[Symbol.toPrimitive];
          if (f !== void 0) {
            var u = f.call(r, o || "default");
            if (i(u) !== "object") return u;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return (o === "string" ? String : Number)(r);
        }
        (e.exports = m), (e.exports.__esModule = !0), (e.exports.default = e.exports);
      })(t),
      t.exports);
}
export { p as __require };
