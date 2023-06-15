import { __module as r } from "../../../../_virtual/nonIterableSpread.js";
var t;
function n() {
  return t
    ? r.exports
    : ((t = 1),
      (function (e) {
        function o() {
          throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
        }
        (e.exports = o), (e.exports.__esModule = !0), (e.exports.default = e.exports);
      })(r),
      r.exports);
}
export { n as __require };
