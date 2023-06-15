import { e as t } from "./eq.js";
var o = t;
function s(n, r) {
  for (var e = n.length; e--; ) if (o(n[e][0], r)) return e;
  return -1;
}
var f = s;
export { f as _ };
