var e, F;
function a() {
  if (F) return e;
  F = 1;
  var o = TypeError,
    t = 9007199254740991;
  return (
    (e = function (r) {
      if (r > t) throw o("Maximum allowed index exceeded");
      return r;
    }),
    e
  );
}
export { a as __require };
