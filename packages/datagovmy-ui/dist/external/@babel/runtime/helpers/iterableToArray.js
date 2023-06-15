import { __module as t } from "../../../../_virtual/iterableToArray.js";
var o;
function u() {
  return o
    ? t.exports
    : ((o = 1),
      (function (r) {
        function a(e) {
          if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
            return Array.from(e);
        }
        (r.exports = a), (r.exports.__esModule = !0), (r.exports.default = r.exports);
      })(t),
      t.exports);
}
export { u as __require };
