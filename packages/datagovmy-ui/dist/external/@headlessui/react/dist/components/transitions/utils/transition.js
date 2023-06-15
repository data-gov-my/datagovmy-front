import { once as g } from "../../../utils/once.js";
import { disposables as c } from "../../../utils/disposables.js";
import { match as u } from "../../../utils/match.js";
function m(t, ...e) {
  t && e.length > 0 && t.classList.add(...e);
}
function v(t, ...e) {
  t && e.length > 0 && t.classList.remove(...e);
}
function F(t, e) {
  let o = c();
  if (!t) return o.dispose;
  let { transitionDuration: l, transitionDelay: a } = getComputedStyle(t),
    [d, p] = [l, a].map(i => {
      let [r = 0] = i
        .split(",")
        .filter(Boolean)
        .map(n => (n.includes("ms") ? parseFloat(n) : parseFloat(n) * 1e3))
        .sort((n, f) => f - n);
      return r;
    }),
    s = d + p;
  if (s !== 0) {
    o.group(r => {
      r.setTimeout(() => {
        e(), r.dispose();
      }, s),
        r.addEventListener(t, "transitionrun", n => {
          n.target === n.currentTarget && r.dispose();
        });
    });
    let i = o.addEventListener(t, "transitionend", r => {
      r.target === r.currentTarget && (e(), i());
    });
  } else e();
  return o.add(() => e()), o.dispose;
}
function L(t, e, o, l) {
  let a = o ? "enter" : "leave",
    d = c(),
    p = l !== void 0 ? g(l) : () => {};
  a === "enter" && (t.removeAttribute("hidden"), (t.style.display = ""));
  let s = u(a, { enter: () => e.enter, leave: () => e.leave }),
    i = u(a, { enter: () => e.enterTo, leave: () => e.leaveTo }),
    r = u(a, { enter: () => e.enterFrom, leave: () => e.leaveFrom });
  return (
    v(
      t,
      ...e.enter,
      ...e.enterTo,
      ...e.enterFrom,
      ...e.leave,
      ...e.leaveFrom,
      ...e.leaveTo,
      ...e.entered
    ),
    m(t, ...s, ...r),
    d.nextFrame(() => {
      v(t, ...r), m(t, ...i), F(t, () => (v(t, ...s), m(t, ...e.entered), p()));
    }),
    d.dispose
  );
}
export { L as transition };
