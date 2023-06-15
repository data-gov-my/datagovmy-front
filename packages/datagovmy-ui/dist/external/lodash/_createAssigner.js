import { _ as l } from "./_baseRest.js";
import { _ } from "./_isIterateeCall.js";
var g = l,
  m = _;
function u(r) {
  return g(function (i, n) {
    var a = -1,
      e = n.length,
      t = e > 1 ? n[e - 1] : void 0,
      f = e > 2 ? n[2] : void 0;
    for (
      t = r.length > 3 && typeof t == "function" ? (e--, t) : void 0,
        f && m(n[0], n[1], f) && ((t = e < 3 ? void 0 : t), (e = 1)),
        i = Object(i);
      ++a < e;

    ) {
      var d = n[a];
      d && r(i, d, a, t);
    }
    return i;
  });
}
var v = u;
export { v as _ };
