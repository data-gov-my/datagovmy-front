import f from "./none.js";
function m(r) {
  var n = r.map(a);
  return f(r).sort(function (t, u) {
    return n[t] - n[u];
  });
}
function a(r) {
  for (var n = 0, t = -1, u = r.length, o; ++t < u; ) (o = +r[t][1]) && (n += o);
  return n;
}
export { m as default, a as sum };
