import { __module as i } from "../../../../_virtual/objectWithoutProperties.js";
import { __require as b } from "./objectWithoutPropertiesLoose.js";
var s;
function O() {
  return s
    ? i.exports
    : ((s = 1),
      (function (r) {
        var a = b();
        function f(t, p) {
          if (t == null) return {};
          var n = a(t, p),
            e,
            o;
          if (Object.getOwnPropertySymbols) {
            var u = Object.getOwnPropertySymbols(t);
            for (o = 0; o < u.length; o++)
              (e = u[o]),
                !(p.indexOf(e) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(t, e) &&
                  (n[e] = t[e]);
          }
          return n;
        }
        (r.exports = f), (r.exports.__esModule = !0), (r.exports.default = r.exports);
      })(i),
      i.exports);
}
export { O as __require };
