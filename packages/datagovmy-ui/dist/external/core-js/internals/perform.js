var r, e;
function o() {
  return (
    e ||
      ((e = 1),
      (r = function (u) {
        try {
          return { error: !1, value: u() };
        } catch (t) {
          return { error: !0, value: t };
        }
      })),
    r
  );
}
export { o as __require };
