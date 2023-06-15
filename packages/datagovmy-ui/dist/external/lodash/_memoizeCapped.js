import { m as i } from "./memoize.js";
var o = i,
  c = 500;
function t(a) {
  var e = o(a, function (m) {
      return r.size === c && r.clear(), m;
    }),
    r = e.cache;
  return e;
}
var p = t;
export { p as _ };
