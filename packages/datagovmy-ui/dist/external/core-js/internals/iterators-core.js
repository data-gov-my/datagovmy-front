import { f as l } from "./fails.js";
import { i as s } from "./is-callable.js";
import { i as n } from "./is-object.js";
import "./object-create.js";
import { o as p } from "./object-get-prototype-of.js";
import { d as m } from "./define-built-in.js";
import { w as y } from "./well-known-symbol.js";
var v = l,
  I = s,
  O = n,
  i = p,
  R = m,
  T = y,
  e = T("iterator"),
  f = !1,
  r,
  t,
  o;
[].keys &&
  ((o = [].keys()), "next" in o ? ((t = i(i(o))), t !== Object.prototype && (r = t)) : (f = !0));
var A =
  !O(r) ||
  v(function () {
    var a = {};
    return r[e].call(a) !== a;
  });
A && (r = {});
I(r[e]) ||
  R(r, e, function () {
    return this;
  });
var w = {
  IteratorPrototype: r,
  BUGGY_SAFARI_ITERATORS: f,
};
export { w as i };
