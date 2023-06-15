import { f as m } from "./function-call.js";
import { i as v } from "./is-object.js";
import { i as l } from "./is-symbol.js";
import { __require as n } from "./get-method.js";
import { o as f } from "./ordinary-to-primitive.js";
import { w as s } from "./well-known-symbol.js";
var d = m,
  t = v,
  a = l,
  b = n(),
  c = f,
  u = s,
  y = TypeError,
  T = u("toPrimitive"),
  E = function (r, o) {
    if (!t(r) || a(r)) return r;
    var e = b(r, T),
      i;
    if (e) {
      if ((o === void 0 && (o = "default"), (i = d(e, r, o)), !t(i) || a(i))) return i;
      throw y("Can't convert object to primitive value");
    }
    return o === void 0 && (o = "number"), c(r, o);
  };
export { E as t };
