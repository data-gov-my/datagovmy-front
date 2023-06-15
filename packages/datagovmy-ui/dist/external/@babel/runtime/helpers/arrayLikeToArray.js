import { __module as a } from "../../../../_virtual/arrayLikeToArray.js";
var i;
function y() {
  return i
    ? a.exports
    : ((i = 1),
      (function (e) {
        function s(o, r) {
          (r == null || r > o.length) && (r = o.length);
          for (var t = 0, u = new Array(r); t < r; t++) u[t] = o[t];
          return u;
        }
        (e.exports = s), (e.exports.__esModule = !0), (e.exports.default = e.exports);
      })(a),
      a.exports);
}
export { y as __require };
