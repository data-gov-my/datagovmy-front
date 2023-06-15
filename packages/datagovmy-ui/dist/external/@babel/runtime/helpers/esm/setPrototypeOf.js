function e(o, r) {
  return (
    (e = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, f) {
          return (t.__proto__ = f), t;
        }),
    e(o, r)
  );
}
export { e as default };
