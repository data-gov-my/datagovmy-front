var r, t;
function a() {
  if (t) return r;
  t = 1;
  var n = TypeError;
  return (
    (r = function (e, u) {
      if (e < u) throw n("Not enough arguments");
      return e;
    }),
    r
  );
}
export { a as __require };
