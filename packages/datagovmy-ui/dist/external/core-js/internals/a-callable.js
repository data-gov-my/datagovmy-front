import { i as a } from "./is-callable.js";
import { t as o } from "./try-to-string.js";
var i = a,
  t = o,
  l = TypeError,
  e = function (r) {
    if (i(r)) return r;
    throw l(t(r) + " is not a function");
  };
export { e as a };
