import { __module as u } from "../../../../../_virtual/node.js";
import { __require as y } from "../../../../core-js/modules/es.object.keys.js";
import "../../../../core-js/modules/es.symbol.constructor.js";
import "../../../../core-js/modules/es.symbol.for.js";
import "../../../../core-js/modules/es.symbol.key-for.js";
import "../../../../core-js/modules/es.json.stringify.js";
import "../../../../core-js/modules/es.object.get-own-property-symbols.js";
import "../../../../core-js/modules/es.array.filter.js";
import "../../../../core-js/modules/es.object.get-own-property-descriptor.js";
import "../../../../core-js/modules/es.object.get-own-property-descriptors.js";
import "../../../../core-js/modules/es.object.define-properties.js";
import "../../../../core-js/modules/es.object.define-property.js";
import { i as P } from "../../../../@babel/runtime/helpers/interopRequireDefault.js";
import { __require as j } from "../../../../core-js/modules/es.array.some.js";
import { __require as E } from "../../../../core-js/modules/es.object.to-string.js";
import { __require as I } from "../../../../core-js/modules/es.array.for-each.js";
import { __require as h } from "../../../../core-js/modules/web.dom-collections.for-each.js";
import { __require as w } from "../../../../core-js/modules/es.promise.js";
import { __require as x } from "../../../../@babel/runtime/helpers/defineProperty.js";
import D from "i18next";
import { __require as S } from "../../../../i18next-fs-backend/cjs/index.js";
var v;
function Z() {
  return v
    ? u.exports
    : ((v = 1),
      (function (f, o) {
        y();
        var s = P;
        Object.defineProperty(o, "__esModule", {
          value: !0,
        }),
          (o.default = void 0),
          j(),
          E(),
          I(),
          h(),
          w();
        var c = s(x()),
          l = s(D),
          q = s(S());
        function d(i, e) {
          var r = Object.keys(i);
          if (Object.getOwnPropertySymbols) {
            var t = Object.getOwnPropertySymbols(i);
            e &&
              (t = t.filter(function (n) {
                return Object.getOwnPropertyDescriptor(i, n).enumerable;
              })),
              r.push.apply(r, t);
          }
          return r;
        }
        function _(i) {
          for (var e = 1; e < arguments.length; e++) {
            var r = arguments[e] != null ? arguments[e] : {};
            e % 2
              ? d(Object(r), !0).forEach(function (t) {
                  (0, c.default)(i, t, r[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(r))
              : d(Object(r)).forEach(function (t) {
                  Object.defineProperty(i, t, Object.getOwnPropertyDescriptor(r, t));
                });
          }
          return i;
        }
        var a,
          O = function (e) {
            e.ns === void 0 && (e.ns = []);
            var r;
            a
              ? (r = a.cloneInstance(
                  _(
                    _({}, e),
                    {},
                    {
                      initImmediate: !1,
                    }
                  )
                ))
              : ((a = l.default.createInstance(e)), (r = a));
            var t;
            if (r.isInitialized) t = Promise.resolve(l.default.t);
            else {
              var n,
                p,
                b =
                  e == null || (n = e.use) === null || n === void 0
                    ? void 0
                    : n.some(function (m) {
                        return m.type === "backend";
                      });
              b || r.use(q.default),
                e == null ||
                  (p = e.use) === null ||
                  p === void 0 ||
                  p.forEach(function (m) {
                    return r.use(m);
                  }),
                typeof e.onPreInitI18next == "function" && e.onPreInitI18next(r),
                (t = r.init(e));
            }
            return {
              i18n: r,
              initPromise: t,
            };
          };
        (o.default = O), (f.exports = o.default), (f.exports.default = o.default);
      })(u, u.exports),
      u.exports);
}
export { Z as __require };
