import { f as i } from "./function-uncurry-this-clause.js";
import { a as o } from "./a-callable.js";
import { f as u } from "./function-bind-native.js";
var a = i,
  e = o,
  t = u,
  f = a(a.bind),
  m = function (r, n) {
    return (
      e(r),
      n === void 0
        ? r
        : t
        ? f(r, n)
        : function () {
            return r.apply(n, arguments);
          }
    );
  };
export { m as f };
