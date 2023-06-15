import * as u from "react";
const s = u.createContext(null);
function c() {
  return {
    groups: /* @__PURE__ */ new Map(),
    get(n, e) {
      var r;
      let t = this.groups.get(n);
      t || ((t = /* @__PURE__ */ new Map()), this.groups.set(n, t));
      let l = (r = t.get(e)) != null ? r : 0;
      t.set(e, l + 1);
      let o = Array.from(t.keys()).indexOf(e);
      function a() {
        let i = t.get(e);
        i > 1 ? t.set(e, i - 1) : t.delete(e);
      }
      return [o, a];
    },
  };
}
function _({ children: n }) {
  let e = u.useRef(c());
  return u.createElement(s.Provider, { value: e }, n);
}
function p(n) {
  let e = u.useContext(s);
  if (!e) throw new Error("You must wrap your component in a <StableCollection>");
  let r = f(),
    [t, l] = e.current.get(n, r);
  return u.useEffect(() => l, []), t;
}
function f() {
  var n, e, r;
  let t =
    (r =
      (e =
        (n = u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) == null
          ? void 0
          : n.ReactCurrentOwner) == null
        ? void 0
        : e.current) != null
      ? r
      : null;
  if (!t) return Symbol();
  let l = [],
    o = t;
  for (; o; ) l.push(o.index), (o = o.return);
  return "$." + l.join(".");
}
export { _ as StableCollection, p as useStableCollectionIndex };
