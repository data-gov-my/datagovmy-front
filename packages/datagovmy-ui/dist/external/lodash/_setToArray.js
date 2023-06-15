function o(r) {
  var e = -1,
    a = Array(r.size);
  return (
    r.forEach(function (n) {
      a[++e] = n;
    }),
    a
  );
}
var t = o;
export { t as _ };
