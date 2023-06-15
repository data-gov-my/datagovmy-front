import { _ as r } from "./_baseRange.js";
import { _ as f } from "./_isIterateeCall.js";
import { t as u } from "./toFinite.js";
var m = r,
  _ = f,
  n = u;
function l(o) {
  return function (a, e, i) {
    return (
      i && typeof i != "number" && _(a, e, i) && (e = i = void 0),
      (a = n(a)),
      e === void 0 ? ((e = a), (a = 0)) : (e = n(e)),
      (i = i === void 0 ? (a < e ? 1 : -1) : n(i)),
      m(a, e, i, o)
    );
  };
}
var b = l;
export { b as _ };
