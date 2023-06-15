import { __module as c } from "../../../_virtual/make-built-in.js";
import { f as p } from "./function-uncurry-this.js";
import { f as u } from "./fails.js";
import { i as g } from "./is-callable.js";
import { h as m } from "./has-own-property.js";
import { d as S } from "./descriptors.js";
import { f as y } from "./function-name.js";
import { i as h } from "./inspect-source.js";
import { i as v } from "./internal-state.js";
var n = p,
  I = u,
  E = g,
  i = m,
  o = S,
  d = y.CONFIGURABLE,
  N = h,
  l = v,
  O = l.enforce,
  b = l.get,
  s = String,
  a = Object.defineProperty,
  C = n("".slice),
  T = n("".replace),
  B = n([].join),
  _ =
    o &&
    !I(function () {
      return a(function () {}, "length", { value: 8 }).length !== 8;
    }),
  $ = String(String).split("String"),
  A = (c.exports = function (r, t, e) {
    C(s(t), 0, 7) === "Symbol(" && (t = "[" + T(s(t), /^Symbol\(([^)]*)\)/, "$1") + "]"),
      e && e.getter && (t = "get " + t),
      e && e.setter && (t = "set " + t),
      (!i(r, "name") || (d && r.name !== t)) &&
        (o ? a(r, "name", { value: t, configurable: !0 }) : (r.name = t)),
      _ && e && i(e, "arity") && r.length !== e.arity && a(r, "length", { value: e.arity });
    try {
      e && i(e, "constructor") && e.constructor
        ? o && a(r, "prototype", { writable: !1 })
        : r.prototype && (r.prototype = void 0);
    } catch {}
    var f = O(r);
    return i(f, "source") || (f.source = B($, typeof t == "string" ? t : "")), r;
  });
Function.prototype.toString = A(function () {
  return (E(this) && b(this).source) || N(this);
}, "toString");
var M = c.exports;
export { M as m };
