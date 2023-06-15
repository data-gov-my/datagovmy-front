import { _ as b } from "./_DataView.js";
import { _ as T } from "./_Map.js";
import { _ as j } from "./_Promise.js";
import { _ as M } from "./_Set.js";
import { _ as v } from "./_WeakMap.js";
import { _ as C } from "./_baseGetTag.js";
import { _ as k } from "./_toSource.js";
var a = b,
  t = T,
  o = j,
  i = M,
  s = v,
  S = C,
  e = k,
  g = "[object Map]",
  V = "[object Object]",
  _ = "[object Promise]",
  f = "[object Set]",
  w = "[object WeakMap]",
  u = "[object DataView]",
  d = e(a),
  D = e(t),
  P = e(o),
  W = e(i),
  G = e(s),
  r = S;
((a && r(new a(new ArrayBuffer(1))) != u) ||
  (t && r(new t()) != g) ||
  (o && r(o.resolve()) != _) ||
  (i && r(new i()) != f) ||
  (s && r(new s()) != w)) &&
  (r = function (n) {
    var m = S(n),
      c = m == V ? n.constructor : void 0,
      p = c ? e(c) : "";
    if (p)
      switch (p) {
        case d:
          return u;
        case D:
          return g;
        case P:
          return _;
        case W:
          return f;
        case G:
          return w;
      }
    return m;
  });
var $ = r;
export { $ as _ };
