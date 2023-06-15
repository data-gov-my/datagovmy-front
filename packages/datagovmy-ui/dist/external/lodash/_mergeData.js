import { _ as G } from "./_composeArgs.js";
import { _ as P } from "./_composeArgsRight.js";
import { _ as D } from "./_replaceHolders.js";
var F = G,
  W = P,
  g = D,
  e = "__lodash_placeholder__",
  v = 1,
  p = 2,
  B = 4,
  o = 8,
  f = 128,
  l = 256,
  C = Math.min;
function E(_, m) {
  var n = _[1],
    i = m[1],
    r = n | i,
    L = r < (v | p | f),
    h =
      (i == f && n == o) ||
      (i == f && n == l && _[7].length <= m[8]) ||
      (i == (f | l) && m[7].length <= m[8] && n == o);
  if (!(L || h)) return _;
  i & v && ((_[2] = m[2]), (r |= n & v ? 0 : B));
  var A = m[3];
  if (A) {
    var R = _[3];
    (_[3] = R ? F(R, A, m[4]) : A), (_[4] = R ? g(_[3], e) : m[4]);
  }
  return (
    (A = m[5]),
    A && ((R = _[5]), (_[5] = R ? W(R, A, m[6]) : A), (_[6] = R ? g(_[5], e) : m[6])),
    (A = m[7]),
    A && (_[7] = A),
    i & f && (_[8] = _[8] == null ? m[8] : C(_[8], m[8])),
    _[9] == null && (_[9] = m[9]),
    (_[0] = m[0]),
    (_[1] = r),
    _
  );
}
var N = E;
export { N as _ };
