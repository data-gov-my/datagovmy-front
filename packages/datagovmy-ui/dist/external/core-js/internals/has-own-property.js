import { f as a } from "./function-uncurry-this.js";
import { t as n } from "./to-object.js";
var o = a,
  s = n,
  e = o({}.hasOwnProperty),
  i =
    Object.hasOwn ||
    function (r, t) {
      return e(s(r), t);
    };
export { i as h };
