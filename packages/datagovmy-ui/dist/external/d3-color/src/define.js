function p(e, r, t) {
  (e.prototype = r.prototype = t), (t.constructor = e);
}
function n(e, r) {
  var t = Object.create(e.prototype);
  for (var o in r) t[o] = r[o];
  return t;
}
export { p as default, n as extend };
