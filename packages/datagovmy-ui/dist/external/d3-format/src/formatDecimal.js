function a(e) {
  return Math.abs((e = Math.round(e))) >= 1e21
    ? e.toLocaleString("en").replace(/,/g, "")
    : e.toString(10);
}
function r(e, i) {
  if ((n = (e = i ? e.toExponential(i - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var n,
    t = e.slice(0, n);
  return [t.length > 1 ? t[0] + t.slice(2) : t, +e.slice(n + 1)];
}
export { a as default, r as formatDecimalParts };
