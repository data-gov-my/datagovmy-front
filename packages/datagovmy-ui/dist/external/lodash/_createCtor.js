import { _ as t } from "./_baseCreate.js";
import { i as s } from "./isObject.js";
var c = t,
  u = s;
function i(r) {
  return function () {
    var e = arguments;
    switch (e.length) {
      case 0:
        return new r();
      case 1:
        return new r(e[0]);
      case 2:
        return new r(e[0], e[1]);
      case 3:
        return new r(e[0], e[1], e[2]);
      case 4:
        return new r(e[0], e[1], e[2], e[3]);
      case 5:
        return new r(e[0], e[1], e[2], e[3], e[4]);
      case 6:
        return new r(e[0], e[1], e[2], e[3], e[4], e[5]);
      case 7:
        return new r(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);
    }
    var n = c(r.prototype),
      a = r.apply(n, e);
    return u(a) ? a : n;
  };
}
var m = i;
export { m as _ };
