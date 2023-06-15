import { f as c } from "./function-uncurry-this.js";
import { a as o } from "./a-callable.js";
var n = c,
  e = o,
  f = function (r, a, t) {
    try {
      return n(e(Object.getOwnPropertyDescriptor(r, a)[t]));
    } catch {}
  };
export { f };
