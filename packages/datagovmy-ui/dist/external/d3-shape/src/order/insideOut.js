import s from "./appearance.js";
import { sum as c } from "./ascending.js";
function l(r) {
  var u = r.length,
    t,
    o,
    p = r.map(c),
    f = s(r),
    m = 0,
    a = 0,
    e = [],
    n = [];
  for (t = 0; t < u; ++t) (o = f[t]), m < a ? ((m += p[o]), e.push(o)) : ((a += p[o]), n.push(o));
  return n.reverse().concat(e);
}
export { l as default };
