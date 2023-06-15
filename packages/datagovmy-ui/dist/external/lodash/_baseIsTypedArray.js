import { _ as e } from "./_baseGetTag.js";
import { i as r } from "./isLength.js";
import { i as o } from "./isObjectLike.js";
var g = e,
  b = r,
  c = o,
  T = "[object Arguments]",
  i = "[object Array]",
  j = "[object Boolean]",
  n = "[object Date]",
  s = "[object Error]",
  y = "[object Function]",
  p = "[object Map]",
  A = "[object Number]",
  f = "[object Object]",
  m = "[object RegExp]",
  u = "[object Set]",
  l = "[object String]",
  d = "[object WeakMap]",
  _ = "[object ArrayBuffer]",
  I = "[object DataView]",
  k = "[object Float32Array]",
  L = "[object Float64Array]",
  U = "[object Int8Array]",
  h = "[object Int16Array]",
  v = "[object Int32Array]",
  w = "[object Uint8Array]",
  x = "[object Uint8ClampedArray]",
  B = "[object Uint16Array]",
  F = "[object Uint32Array]",
  a = {};
a[k] = a[L] = a[U] = a[h] = a[v] = a[w] = a[x] = a[B] = a[F] = !0;
a[T] =
  a[i] =
  a[_] =
  a[j] =
  a[I] =
  a[n] =
  a[s] =
  a[y] =
  a[p] =
  a[A] =
  a[f] =
  a[m] =
  a[u] =
  a[l] =
  a[d] =
    !1;
function M(t) {
  return c(t) && b(t.length) && !!a[g(t)];
}
var E = M;
export { E as _ };
