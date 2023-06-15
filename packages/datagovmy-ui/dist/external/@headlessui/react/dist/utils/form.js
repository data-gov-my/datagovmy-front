function r(o = {}, i = null, e = []) {
  for (let [s, f] of Object.entries(o)) u(e, n(i, s), f);
  return e;
}
function n(o, i) {
  return o ? o + "[" + i + "]" : i;
}
function u(o, i, e) {
  if (Array.isArray(e)) for (let [s, f] of e.entries()) u(o, n(i, s.toString()), f);
  else
    e instanceof Date
      ? o.push([i, e.toISOString()])
      : typeof e == "boolean"
      ? o.push([i, e ? "1" : "0"])
      : typeof e == "string"
      ? o.push([i, e])
      : typeof e == "number"
      ? o.push([i, `${e}`])
      : e == null
      ? o.push([i, ""])
      : r(e, i, o);
}
export { r as objectToFormEntries };
