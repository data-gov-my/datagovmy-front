import { __module as i } from "../../../../../_virtual/browser.js";
import "../../../../core-js/modules/es.object.define-property.js";
import { i as d } from "../../../../@babel/runtime/helpers/interopRequireDefault.js";
import { __require as m } from "../../../../core-js/modules/es.array.for-each.js";
import { __require as p } from "../../../../core-js/modules/es.object.to-string.js";
import { __require as q } from "../../../../core-js/modules/web.dom-collections.for-each.js";
import { __require as v } from "../../../../core-js/modules/es.promise.js";
import E from "i18next";
var s;
function j() {
  return s
    ? i.exports
    : ((s = 1),
      (function (a, e) {
        var f = d;
        Object.defineProperty(e, "__esModule", {
          value: !0,
        }),
          (e.default = void 0),
          m(),
          p(),
          q(),
          v();
        var n = f(E),
          _ = function (r) {
            r.ns === void 0 && (r.ns = []);
            var t = n.default.createInstance(r),
              o;
            if (t.isInitialized) o = Promise.resolve(n.default.t);
            else {
              var u;
              r == null ||
                (u = r.use) === null ||
                u === void 0 ||
                u.forEach(function (l) {
                  return t.use(l);
                }),
                typeof r.onPreInitI18next == "function" && r.onPreInitI18next(t),
                (o = t.init(r));
            }
            return {
              i18n: t,
              initPromise: o,
            };
          };
        (e.default = _), (a.exports = e.default), (a.exports.default = e.default);
      })(i, i.exports),
      i.exports);
}
export { j as __require };
