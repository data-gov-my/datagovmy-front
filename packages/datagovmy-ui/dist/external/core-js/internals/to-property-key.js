import { t as i } from "./to-primitive.js";
import { i as o } from "./is-symbol.js";
var m = i,
  a = o,
  v = function (t) {
    var r = m(t, "string");
    return a(r) ? r : r + "";
  };
export { v as t };
