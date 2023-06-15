import { __require as m } from "./to-absolute-index.js";
import { l as n } from "./length-of-array-like.js";
import { c as u } from "./create-property.js";
var l = m(),
  p = n,
  s = u,
  y = Array,
  A = Math.max,
  g = function (o, f, i) {
    for (
      var a = p(o), r = l(f, a), v = l(i === void 0 ? a : i, a), e = y(A(v - r, 0)), t = 0;
      r < v;
      r++, t++
    )
      s(e, t, o[r]);
    return (e.length = t), e;
  };
export { g as a };
