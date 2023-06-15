import { a as b } from "./a-callable.js";
import { t as g } from "./to-object.js";
import { i as j } from "./indexed-object.js";
import { l as x } from "./length-of-array-like.js";
var o, v;
function w() {
  if (v) return o;
  v = 1;
  var d = b,
    c = g,
    h = j,
    y = x,
    p = TypeError,
    u = function (e) {
      return function (s, l, O, a) {
        d(l);
        var i = c(s),
          t = h(i),
          n = y(i),
          r = e ? n - 1 : 0,
          f = e ? -1 : 1;
        if (O < 2)
          for (;;) {
            if (r in t) {
              (a = t[r]), (r += f);
              break;
            }
            if (((r += f), e ? r < 0 : n <= r))
              throw p("Reduce of empty array with no initial value");
          }
        for (; e ? r >= 0 : n > r; r += f) r in t && (a = l(a, t[r], r, i));
        return a;
      };
    };
  return (
    (o = {
      // `Array.prototype.reduce` method
      // https://tc39.es/ecma262/#sec-array.prototype.reduce
      left: u(!1),
      // `Array.prototype.reduceRight` method
      // https://tc39.es/ecma262/#sec-array.prototype.reduceright
      right: u(!0),
    }),
    o
  );
}
export { w as __require };
