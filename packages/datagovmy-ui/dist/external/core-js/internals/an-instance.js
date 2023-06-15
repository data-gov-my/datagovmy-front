import { o as t } from "./object-is-prototype-of.js";
var a = t,
  e = TypeError,
  c = function (r, o) {
    if (a(o, r)) return r;
    throw e("Incorrect invocation");
  };
export { c as a };
