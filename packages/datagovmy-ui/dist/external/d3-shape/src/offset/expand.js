import u from "./none.js";
function h(o, l) {
  if ((a = o.length) > 0) {
    for (var f, a, r = 0, n = o[0].length, t; r < n; ++r) {
      for (t = f = 0; f < a; ++f) t += o[f][r][1] || 0;
      if (t) for (f = 0; f < a; ++f) o[f][r][1] /= t;
    }
    u(o, l);
  }
}
export { h as default };
