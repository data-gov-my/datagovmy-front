var r, e;
function t() {
  return (
    e ||
      ((e = 1),
      (r = function (n) {
        return function (u) {
          return n.apply(null, u);
        };
      })),
    r
  );
}
export { t as __require };
