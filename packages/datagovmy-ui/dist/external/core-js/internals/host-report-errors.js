var r, o;
function n() {
  return (
    o ||
      ((o = 1),
      (r = function (e, t) {
        try {
          arguments.length == 1 ? console.error(e) : console.error(e, t);
        } catch {}
      })),
    r
  );
}
export { n as __require };
