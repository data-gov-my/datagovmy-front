import { __module as r } from "../../../../_virtual/typeof.js";
(function (t) {
  function e(p) {
    "@babel/helpers - typeof";
    return (
      (t.exports = e =
        typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
          ? function (o) {
              return typeof o;
            }
          : function (o) {
              return o &&
                typeof Symbol == "function" &&
                o.constructor === Symbol &&
                o !== Symbol.prototype
                ? "symbol"
                : typeof o;
            }),
      (t.exports.__esModule = !0),
      (t.exports.default = t.exports),
      e(p)
    );
  }
  (t.exports = e), (t.exports.__esModule = !0), (t.exports.default = t.exports);
})(r);
var s = r.exports;
export { s as _ };
