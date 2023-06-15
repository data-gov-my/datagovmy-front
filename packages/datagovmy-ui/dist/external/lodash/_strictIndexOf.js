function f(e, n, r) {
  for (var t = r - 1, i = e.length; ++t < i; ) if (e[t] === n) return t;
  return -1;
}
var x = f;
export { x as _ };
