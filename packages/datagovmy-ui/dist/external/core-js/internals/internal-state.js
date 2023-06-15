import { w as v } from "./weak-map-basic-detection.js";
import { g as m } from "./global.js";
import { i as l } from "./is-object.js";
import { c as y } from "./create-non-enumerable-property.js";
import { h as g } from "./has-own-property.js";
import { s as d } from "./shared-store.js";
import { s as b } from "./shared-key.js";
import { h as w } from "./hidden-keys.js";
var I = v,
  p = m,
  O = l,
  K = y,
  i = g,
  f = d,
  _ = b,
  $ = w,
  h = "Object already initialized",
  c = p.TypeError,
  M = p.WeakMap,
  o,
  n,
  s,
  N = function (r) {
    return s(r) ? n(r) : o(r, {});
  },
  j = function (r) {
    return function (e) {
      var u;
      if (!O(e) || (u = n(e)).type !== r) throw c("Incompatible receiver, " + r + " required");
      return u;
    };
  };
if (I || f.state) {
  var a = f.state || (f.state = new M());
  (a.get = a.get),
    (a.has = a.has),
    (a.set = a.set),
    (o = function (r, e) {
      if (a.has(r)) throw c(h);
      return (e.facade = r), a.set(r, e), e;
    }),
    (n = function (r) {
      return a.get(r) || {};
    }),
    (s = function (r) {
      return a.has(r);
    });
} else {
  var t = _("state");
  ($[t] = !0),
    (o = function (r, e) {
      if (i(r, t)) throw c(h);
      return (e.facade = r), K(r, t, e), e;
    }),
    (n = function (r) {
      return i(r, t) ? r[t] : {};
    }),
    (s = function (r) {
      return i(r, t);
    });
}
var q = {
  set: o,
  get: n,
  has: s,
  enforce: N,
  getterFor: j,
};
export { q as i };
