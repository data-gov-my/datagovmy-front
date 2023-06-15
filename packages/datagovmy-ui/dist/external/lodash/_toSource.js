var o = Function.prototype,
  n = o.toString;
function c(r) {
  if (r != null) {
    try {
      return n.call(r);
    } catch {}
    try {
      return r + "";
    } catch {}
  }
  return "";
}
var e = c;
export { e as _ };
