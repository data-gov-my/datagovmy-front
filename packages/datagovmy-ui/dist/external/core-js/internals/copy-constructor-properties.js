import { h as i } from "./has-own-property.js";
import { o as m } from "./own-keys.js";
import "./object-get-own-property-descriptor.js";
import "./object-define-property.js";
import { __exports as v } from "../../../_virtual/object-define-property.js";
import { __exports as y } from "../../../_virtual/object-get-own-property-descriptor.js";
var s = i,
  P = m,
  c = y,
  w = v,
  u = function (t, e, p) {
    for (var a = P(e), n = w.f, f = c.f, o = 0; o < a.length; o++) {
      var r = a[o];
      !s(t, r) && !(p && s(p, r)) && n(t, r, f(e, r));
    }
  };
export { u as c };
