function r(o) {
  var e = typeof o;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean"
    ? o !== "__proto__"
    : o === null;
}
var n = r;
export { n as _ };
