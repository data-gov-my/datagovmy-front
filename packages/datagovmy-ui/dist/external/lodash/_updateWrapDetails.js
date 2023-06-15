import { _ as R } from "./_arrayEach.js";
import { _ as t } from "./_arrayIncludes.js";
var G = R,
  L = t,
  P = 1,
  i = 2,
  p = 8,
  u = 16,
  F = 32,
  W = 64,
  e = 128,
  n = 256,
  I = 512,
  c = [
    ["ary", e],
    ["bind", P],
    ["bindKey", i],
    ["curry", p],
    ["curryRight", u],
    ["flip", I],
    ["partial", F],
    ["partialRight", W],
    ["rearg", n],
  ];
function o(r, A) {
  return (
    G(c, function (a) {
      var _ = "_." + a[0];
      A & a[1] && !L(r, _) && r.push(_);
    }),
    r.sort()
  );
}
var l = o;
export { l as _ };
