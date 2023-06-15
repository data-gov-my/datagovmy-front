import { __module as f } from "../../../../_virtual/asyncToGenerator.js";
var x;
function v() {
  return x
    ? f.exports
    : ((x = 1),
      (function (t) {
        function p(u, i, c, o, s, a, e) {
          try {
            var n = u[a](e),
              r = n.value;
          } catch (y) {
            c(y);
            return;
          }
          n.done ? i(r) : Promise.resolve(r).then(o, s);
        }
        function _(u) {
          return function () {
            var i = this,
              c = arguments;
            return new Promise(function (o, s) {
              var a = u.apply(i, c);
              function e(r) {
                p(a, o, s, e, n, "next", r);
              }
              function n(r) {
                p(a, o, s, e, n, "throw", r);
              }
              e(void 0);
            });
          };
        }
        (t.exports = _), (t.exports.__esModule = !0), (t.exports.default = t.exports);
      })(f),
      f.exports);
}
export { v as __require };
