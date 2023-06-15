import { __module as p } from "../../../../_virtual/extends.js";
var o;
function i() {
  return o
    ? p.exports
    : ((o = 1),
      (function (r) {
        function t() {
          return (
            (r.exports = t =
              Object.assign
                ? Object.assign.bind()
                : function (a) {
                    for (var e = 1; e < arguments.length; e++) {
                      var s = arguments[e];
                      for (var n in s) Object.prototype.hasOwnProperty.call(s, n) && (a[n] = s[n]);
                    }
                    return a;
                  }),
            (r.exports.__esModule = !0),
            (r.exports.default = r.exports),
            t.apply(this, arguments)
          );
        }
        (r.exports = t), (r.exports.__esModule = !0), (r.exports.default = r.exports);
      })(p),
      p.exports);
}
export { i as __require };
