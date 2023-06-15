import f from "./none.js";
function u(r) {
  var n = r.map(o);
  return f(r).sort(function (t, a) {
    return n[t] - n[a];
  });
}
function o(r) {
  for (var n = -1, t = 0, a = r.length, i, e = -1 / 0; ++n < a; )
    (i = +r[n][1]) > e && ((e = i), (t = n));
  return t;
}
export { u as default };
