var r = 9007199254740991;
function t(n) {
  return typeof n == "number" && n > -1 && n % 1 == 0 && n <= r;
}
var i = t;
export { i };
