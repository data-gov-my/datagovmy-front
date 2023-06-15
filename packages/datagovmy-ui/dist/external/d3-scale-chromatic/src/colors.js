function e(l) {
  for (var n = (l.length / 6) | 0, o = new Array(n), r = 0; r < n; )
    o[r] = "#" + l.slice(r * 6, ++r * 6);
  return o;
}
export { e as default };
