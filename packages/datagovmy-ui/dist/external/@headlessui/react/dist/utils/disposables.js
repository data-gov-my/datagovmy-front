import { microTask as a } from "./micro-task.js";
function o() {
  let s = [],
    r = {
      addEventListener(e, t, n, i) {
        return e.addEventListener(t, n, i), r.add(() => e.removeEventListener(t, n, i));
      },
      requestAnimationFrame(...e) {
        let t = requestAnimationFrame(...e);
        return r.add(() => cancelAnimationFrame(t));
      },
      nextFrame(...e) {
        return r.requestAnimationFrame(() => r.requestAnimationFrame(...e));
      },
      setTimeout(...e) {
        let t = setTimeout(...e);
        return r.add(() => clearTimeout(t));
      },
      microTask(...e) {
        let t = { current: !0 };
        return (
          a(() => {
            t.current && e[0]();
          }),
          r.add(() => {
            t.current = !1;
          })
        );
      },
      style(e, t, n) {
        let i = e.style.getPropertyValue(t);
        return (
          Object.assign(e.style, { [t]: n }),
          this.add(() => {
            Object.assign(e.style, { [t]: i });
          })
        );
      },
      group(e) {
        let t = o();
        return e(t), this.add(() => t.dispose());
      },
      add(e) {
        return (
          s.push(e),
          () => {
            let t = s.indexOf(e);
            if (t >= 0) for (let n of s.splice(t, 1)) n();
          }
        );
      },
      dispose() {
        for (let e of s.splice(0)) e();
      },
    };
  return r;
}
export { o as disposables };
