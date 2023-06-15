import { __exports as u } from "../../../_virtual/es.symbol.description.js";
import { _ as I } from "../internals/export.js";
import { d as q } from "../internals/descriptors.js";
import { g as w } from "../internals/global.js";
import { f as x } from "../internals/function-uncurry-this.js";
import { h as R } from "../internals/has-own-property.js";
import { i as T } from "../internals/is-callable.js";
import { o as A } from "../internals/object-is-prototype-of.js";
import { t as B } from "../internals/to-string.js";
import { d as E } from "../internals/define-built-in-accessor.js";
import { c as j } from "../internals/copy-constructor-properties.js";
var c;
function M() {
  if (c) return u;
  c = 1;
  var f = I,
    m = q,
    l = w,
    i = x,
    p = R,
    v = T,
    d = A,
    y = B,
    b = E,
    g = j,
    r = l.Symbol,
    o = r && r.prototype;
  if (
    m &&
    v(r) &&
    (!("description" in o) || // Safari 12 bug
      r().description !== void 0)
  ) {
    var n = {},
      s = function () {
        var t = arguments.length < 1 || arguments[0] === void 0 ? void 0 : y(arguments[0]),
          e = d(o, this) ? new r(t) : t === void 0 ? r() : r(t);
        return t === "" && (n[e] = !0), e;
      };
    g(s, r), (s.prototype = o), (o.constructor = s);
    var _ = String(r("test")) == "Symbol(test)",
      h = i(o.valueOf),
      S = i(o.toString),
      $ = /^Symbol\((.*)\)[^)]+$/,
      P = i("".replace),
      O = i("".slice);
    b(o, "description", {
      configurable: !0,
      get: function () {
        var t = h(this);
        if (p(n, t)) return "";
        var e = S(t),
          a = _ ? O(e, 7, -1) : P(e, $, "$1");
        return a === "" ? void 0 : a;
      },
    }),
      f(
        { global: !0, constructor: !0, forced: !0 },
        {
          Symbol: s,
        }
      );
  }
  return u;
}
export { M as __require };
