import { c as o } from "./classof.js";
var t = o,
  a = String,
  i = function (r) {
    if (t(r) === "Symbol") throw TypeError("Cannot convert a Symbol value to a string");
    return a(r);
  };
export { i as t };
