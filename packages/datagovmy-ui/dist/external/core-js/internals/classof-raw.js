import { f as n } from "./function-uncurry-this.js";
var r = n,
  t = r({}.toString),
  a = r("".slice),
  o = function (i) {
    return a(t(i), 8, -1);
  };
export { o as c };
