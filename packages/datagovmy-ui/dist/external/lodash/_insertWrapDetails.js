var p = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function t(e, r) {
  var n = r.length;
  if (!n) return e;
  var a = n - 1;
  return (
    (r[a] = (n > 1 ? "& " : "") + r[a]),
    (r = r.join(n > 2 ? ", " : " ")),
    e.replace(
      p,
      `{
/* [wrapped with ` +
        r +
        `] */
`
    )
  );
}
var h = t;
export { h as _ };
