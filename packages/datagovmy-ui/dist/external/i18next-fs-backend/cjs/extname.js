import { __module as t } from "../../../_virtual/extname.js";
var u;
function i() {
  return u
    ? t.exports
    : ((u = 1),
      (function (n, e) {
        Object.defineProperty(e, "__esModule", {
          value: !0,
        }),
          (e.default = void 0);
        var a = function (r) {
          if (!(r.indexOf(".") < 0)) return ".".concat(r.split(".").pop());
        };
        (e.default = a), (n.exports = e.default);
      })(t, t.exports),
      t.exports);
}
export { i as __require };
