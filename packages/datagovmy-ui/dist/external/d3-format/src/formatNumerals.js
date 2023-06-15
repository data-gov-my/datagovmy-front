function e(r) {
  return function (n) {
    return n.replace(/[0-9]/g, function (t) {
      return r[+t];
    });
  };
}
export { e as default };
