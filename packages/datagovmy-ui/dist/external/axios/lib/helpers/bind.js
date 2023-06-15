var g = function (a, t) {
  return function () {
    for (var n = new Array(arguments.length), r = 0; r < n.length; r++) n[r] = arguments[r];
    return a.apply(t, n);
  };
};
export { g as b };
