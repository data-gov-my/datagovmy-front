import { _ as p } from "./_assignValue.js";
import { _ as v } from "./_castPath.js";
import { _ as x } from "./_isIndex.js";
import { i as g } from "./isObject.js";
import { _ as u } from "./_toKey.js";
var l = p,
  I = v,
  K = x,
  d = g,
  O = u;
function P(i, t, m, f) {
  if (!d(i)) return i;
  t = I(t, i);
  for (var n = -1, o = t.length, e = o - 1, s = i; s != null && ++n < o; ) {
    var r = O(t[n]),
      _ = m;
    if (r === "__proto__" || r === "constructor" || r === "prototype") return i;
    if (n != e) {
      var a = s[r];
      (_ = f ? f(a, r, s) : void 0), _ === void 0 && (_ = d(a) ? a : K(t[n + 1]) ? [] : {});
    }
    l(s, r, _), (s = s[r]);
  }
  return i;
}
var B = P;
export { B as _ };
