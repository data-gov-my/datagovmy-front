function n() {
  return {
    before({ doc: e, d: o }) {
      o.style(e.documentElement, "overflow", "hidden");
    },
  };
}
export { n as preventScroll };
