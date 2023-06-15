function t(r) {
  var n = -1,
    a = Array(r.size);
  return (
    r.forEach(function (o, e) {
      a[++n] = [e, o];
    }),
    a
  );
}
var i = t;
export { i as _ };
