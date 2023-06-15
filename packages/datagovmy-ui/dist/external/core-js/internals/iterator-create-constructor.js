import { i } from "./iterators-core.js";
import { o as s } from "./object-create.js";
import { c as p } from "./create-property-descriptor.js";
import { s as m } from "./set-to-string-tag.js";
import { i as n } from "./iterators.js";
var c = i.IteratorPrototype,
  f = s,
  v = p,
  T = m,
  y = n,
  g = function () {
    return this;
  },
  x = function (r, e, o, a) {
    var t = e + " Iterator";
    return (r.prototype = f(c, { next: v(+!a, o) })), T(r, t, !1), (y[t] = g), r;
  };
export { x as i };
