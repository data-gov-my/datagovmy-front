import { f as c } from "./function-uncurry-this-accessor.js";
import { a as n } from "./an-object.js";
import { a as f } from "./a-possible-prototype.js";
var i = c,
  _ = n,
  p = f,
  v =
    Object.setPrototypeOf ||
    ("__proto__" in {}
      ? (function () {
          var o = !1,
            s = {},
            t;
          try {
            (t = i(Object.prototype, "__proto__", "set")), t(s, []), (o = s instanceof Array);
          } catch {}
          return function (r, e) {
            return _(r), p(e), o ? t(r, e) : (r.__proto__ = e), r;
          };
        })()
      : void 0);
export { v as o };
