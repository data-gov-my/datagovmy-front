import { __module as t } from "../../../../_virtual/nonIterableRest.js";
var r;
function a() {
  return r
    ? t.exports
    : ((r = 1),
      (function (e) {
        function o() {
          throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
        }
        (e.exports = o), (e.exports.__esModule = !0), (e.exports.default = e.exports);
      })(t),
      t.exports);
}
export { a as __require };
