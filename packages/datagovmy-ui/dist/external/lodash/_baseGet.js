import { _ as t } from "./_castPath.js";
import { _ as s } from "./_toKey.js";
var i = t,
  _ = s;
function l(e, r) {
  r = i(r, e);
  for (var a = 0, n = r.length; e != null && a < n; ) e = e[_(r[a++])];
  return a && a == n ? e : void 0;
}
var o = l;
export { o as _ };
