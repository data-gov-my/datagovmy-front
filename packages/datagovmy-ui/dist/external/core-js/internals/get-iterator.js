import { f as o } from "./function-call.js";
import { a as e } from "./a-callable.js";
import { a as i } from "./an-object.js";
import { t as l } from "./try-to-string.js";
import { g as n } from "./get-iterator-method.js";
var f = o,
  m = e,
  p = i,
  s = l,
  v = n,
  g = TypeError,
  T = function (r, a) {
    var t = arguments.length < 2 ? v(r) : a;
    if (m(t)) return p(f(t, r));
    throw g(s(r) + " is not iterable");
  };
export { T as g };
