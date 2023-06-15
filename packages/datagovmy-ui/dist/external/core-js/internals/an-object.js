import { i as t } from "./is-object.js";
var i = t,
  o = String,
  a = TypeError,
  n = function (r) {
    if (i(r)) return r;
    throw a(o(r) + " is not an object");
  };
export { n as a };
