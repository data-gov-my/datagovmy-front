function n(l) {
  let e = { called: !1 };
  return (...c) => {
    if (!e.called) return (e.called = !0), l(...c);
  };
}
export { n as once };
