import { __module as i } from "../../../../_virtual/defineProperty.js";
import { __require as f } from "./toPropertyKey.js";
var n;
function _() {
  return n
    ? i.exports
    : ((n = 1),
      (function (e) {
        var u = f();
        function p(t, r, o) {
          return (
            (r = u(r)),
            r in t
              ? Object.defineProperty(t, r, {
                  value: o,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (t[r] = o),
            t
          );
        }
        (e.exports = p), (e.exports.__esModule = !0), (e.exports.default = e.exports);
      })(i),
      i.exports);
}
export { _ as __require };
