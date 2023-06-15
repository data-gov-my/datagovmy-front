function s(n, c) {
  let t = n(),
    r = /* @__PURE__ */ new Set();
  return {
    getSnapshot() {
      return t;
    },
    subscribe(e) {
      return r.add(e), () => r.delete(e);
    },
    dispatch(e, ...l) {
      let a = c[e].call(t, ...l);
      a && ((t = a), r.forEach(o => o()));
    },
  };
}
export { s as createStore };
