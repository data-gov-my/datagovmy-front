var u = 800,
  i = 16,
  o = Date.now;
function s(a) {
  var r = 0,
    t = 0;
  return function () {
    var n = o(),
      e = i - (n - t);
    if (((t = n), e > 0)) {
      if (++r >= u) return arguments[0];
    } else r = 0;
    return a.apply(void 0, arguments);
  };
}
var v = s;
export { v as _ };
