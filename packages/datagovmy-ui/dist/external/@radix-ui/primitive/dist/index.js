function o(e, f, { checkForDefaultPrevented: t = !0 } = {}) {
  return function (c) {
    if ((e == null || e(c), t === !1 || !c.defaultPrevented)) return f == null ? void 0 : f(c);
  };
}
export { o as composeEventHandlers };
