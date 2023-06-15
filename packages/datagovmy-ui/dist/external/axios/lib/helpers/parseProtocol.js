var r, o;
function c() {
  return (
    o ||
      ((o = 1),
      (r = function (t) {
        var e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(t);
        return (e && e[1]) || "";
      })),
    r
  );
}
export { c as __require };
