import { __exports as e } from "../../../../_virtual/utils.js";
import "../../../core-js/modules/es.object.define-property.js";
import { i as q } from "../../../@babel/runtime/helpers/interopRequireDefault.js";
import { __require as f } from "../../../@babel/runtime/helpers/toConsumableArray.js";
import { _ as y } from "../../../@babel/runtime/helpers/typeof.js";
import { __require as v } from "../../../core-js/modules/es.array.is-array.js";
import { __require as d } from "../../../core-js/modules/es.array.concat.js";
import { __require as F } from "../../../core-js/modules/es.array.from.js";
import "../../../core-js/modules/es.string.iterator.js";
import "../../../core-js/modules/es.array.iterator.js";
import { __require as E } from "../../../core-js/modules/es.object.to-string.js";
import { __require as A } from "../../../core-js/modules/es.set.js";
import "../../../core-js/modules/web.dom-collections.iterator.js";
var m;
function g() {
  if (m) return e;
  m = 1;
  var u = q;
  Object.defineProperty(e, "__esModule", {
    value: !0,
  }),
    (e.unique = e.getFallbackForLng = void 0);
  var _ = u(f()),
    n = u(y);
  v(), d(), F(), E(), A();
  var a = function s(t, r) {
    if (typeof r == "string") return [r];
    if (Array.isArray(r)) return r;
    if ((0, n.default)(r) === "object") {
      var o = r[t],
        i = r.default;
      return [].concat((0, _.default)(o ?? []), (0, _.default)(i ?? []));
    }
    return typeof r == "function" ? s(t, r(t)) : [];
  };
  e.getFallbackForLng = a;
  var p = function (t) {
    return Array.from(new Set(t));
  };
  return (e.unique = p), e;
}
export { g as __require };
