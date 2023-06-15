import { __module as i } from "../../../../_virtual/objectWithoutPropertiesLoose.js";
var n;
function c() {
  return n
    ? i.exports
    : ((n = 1),
      (function (e) {
        function p(o, f) {
          if (o == null) return {};
          var s = {},
            u = Object.keys(o),
            t,
            r;
          for (r = 0; r < u.length; r++) (t = u[r]), !(f.indexOf(t) >= 0) && (s[t] = o[t]);
          return s;
        }
        (e.exports = p), (e.exports.__esModule = !0), (e.exports.default = e.exports);
      })(i),
      i.exports);
}
export { c as __require };
