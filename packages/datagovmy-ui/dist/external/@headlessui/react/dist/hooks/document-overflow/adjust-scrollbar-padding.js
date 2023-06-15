function o() {
  let n;
  return {
    before({ doc: e }) {
      var d;
      let t = e.documentElement;
      n = ((d = e.defaultView) != null ? d : window).innerWidth - t.clientWidth;
    },
    after({ doc: e, d }) {
      let t = e.documentElement,
        l = t.clientWidth - t.offsetWidth,
        i = n - l;
      d.style(t, "paddingRight", `${i}px`);
    },
  };
}
export { o as adjustScrollbarPadding };
