import { u as f } from "../utils.js";
import { d as n } from "../defaults/index.js";
var u = f,
  i = n,
  v = function (r, t, a) {
    var o = this || i;
    return (
      u.forEach(a, function (s) {
        r = s.call(o, r, t);
      }),
      r
    );
  };
export { v as t };
