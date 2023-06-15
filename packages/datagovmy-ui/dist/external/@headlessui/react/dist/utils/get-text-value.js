let a =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
function o(t) {
  var l, u;
  let n = (l = t.innerText) != null ? l : "",
    i = t.cloneNode(!0);
  if (!(i instanceof HTMLElement)) return n;
  let r = !1;
  for (let f of i.querySelectorAll('[hidden],[aria-hidden],[role="img"]')) f.remove(), (r = !0);
  let e = r ? ((u = i.innerText) != null ? u : "") : n;
  return a.test(e) && (e = e.replace(a, "")), e;
}
function F(t) {
  let l = t.getAttribute("aria-label");
  if (typeof l == "string") return l.trim();
  let u = t.getAttribute("aria-labelledby");
  if (u) {
    let n = u
      .split(" ")
      .map(i => {
        let r = document.getElementById(i);
        if (r) {
          let e = r.getAttribute("aria-label");
          return typeof e == "string" ? e.trim() : o(r).trim();
        }
        return null;
      })
      .filter(Boolean);
    if (n.length > 0) return n.join(", ");
  }
  return o(t).trim();
}
export { F as getTextValue };
