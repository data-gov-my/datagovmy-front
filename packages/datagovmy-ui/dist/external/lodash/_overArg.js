function o(r, n) {
  return function (e) {
    return r(n(e));
  };
}
var t = o;
export { t as _ };
