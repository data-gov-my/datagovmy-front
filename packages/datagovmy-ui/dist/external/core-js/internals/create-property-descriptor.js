var a = function (e, r) {
  return {
    enumerable: !(e & 1),
    configurable: !(e & 2),
    writable: !(e & 4),
    value: r,
  };
};
export { a as c };
