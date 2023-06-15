import { initRange as s } from "./init.js";
const c = Symbol("implicit");
function f() {
  var r = /* @__PURE__ */ new Map(),
    i = [],
    u = [],
    o = c;
  function n(t) {
    var a = t + "",
      e = r.get(a);
    if (!e) {
      if (o !== c) return o;
      r.set(a, (e = i.push(t)));
    }
    return u[(e - 1) % u.length];
  }
  return (
    (n.domain = function (t) {
      if (!arguments.length) return i.slice();
      (i = []), (r = /* @__PURE__ */ new Map());
      for (const a of t) {
        const e = a + "";
        r.has(e) || r.set(e, i.push(a));
      }
      return n;
    }),
    (n.range = function (t) {
      return arguments.length ? ((u = Array.from(t)), n) : u.slice();
    }),
    (n.unknown = function (t) {
      return arguments.length ? ((o = t), n) : o;
    }),
    (n.copy = function () {
      return f(i, u).unknown(o);
    }),
    s.apply(n, arguments),
    n
  );
}
export { f as default, c as implicit };
