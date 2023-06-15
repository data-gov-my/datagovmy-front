import { disposables as n } from "../../utils/disposables.js";
import { createStore as c } from "../../utils/store.js";
import { adjustScrollbarPadding as d } from "./adjust-scrollbar-padding.js";
import { handleIOSLocking as i } from "./handle-ios-locking.js";
import { preventScroll as f } from "./prevent-scroll.js";
function m(e) {
  let o = {};
  for (let t of e) Object.assign(o, t(o));
  return o;
}
let s = c(() => /* @__PURE__ */ new Map(), {
  PUSH(e, o) {
    var t;
    let r =
      (t = this.get(e)) != null ? t : { doc: e, count: 0, d: n(), meta: /* @__PURE__ */ new Set() };
    return r.count++, r.meta.add(o), this.set(e, r), this;
  },
  POP(e, o) {
    let t = this.get(e);
    return t && (t.count--, t.meta.delete(o)), this;
  },
  SCROLL_PREVENT({ doc: e, d: o, meta: t }) {
    let r = { doc: e, d: o, meta: m(t) },
      a = [i(), d(), f()];
    a.forEach(({ before: l }) => (l == null ? void 0 : l(r))),
      a.forEach(({ after: l }) => (l == null ? void 0 : l(r)));
  },
  SCROLL_ALLOW({ d: e }) {
    e.dispose();
  },
  TEARDOWN({ doc: e }) {
    this.delete(e);
  },
});
s.subscribe(() => {
  let e = s.getSnapshot(),
    o = /* @__PURE__ */ new Map();
  for (let [t] of e) o.set(t, t.documentElement.style.overflow);
  for (let t of e.values()) {
    let r = o.get(t.doc) === "hidden",
      a = t.count !== 0;
    ((a && !r) || (!a && r)) && s.dispatch(t.count > 0 ? "SCROLL_PREVENT" : "SCROLL_ALLOW", t),
      t.count === 0 && s.dispatch("TEARDOWN", t);
  }
});
export { s as overflows };
