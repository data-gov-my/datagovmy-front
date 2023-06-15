var r, n;
function a() {
  return (
    n ||
      ((n = 1),
      (r = function (e) {
        return !!(e && e.__CANCEL__);
      })),
    r
  );
}
export { a as __require };
