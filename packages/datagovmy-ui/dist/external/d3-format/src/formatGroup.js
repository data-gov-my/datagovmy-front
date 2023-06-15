function i(t, h) {
  return function (f, r) {
    for (
      var n = f.length, s = [], u = 0, e = t[0], a = 0;
      n > 0 &&
      e > 0 &&
      (a + e + 1 > r && (e = Math.max(1, r - a)),
      s.push(f.substring((n -= e), n + e)),
      !((a += e + 1) > r));

    )
      e = t[(u = (u + 1) % t.length)];
    return s.reverse().join(h);
  };
}
export { i as default };
