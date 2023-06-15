import { u as p } from "../utils.js";
var a = p,
  u = function (r, e) {
    a.forEach(r, function (t, o) {
      o !== e && o.toUpperCase() === e.toUpperCase() && ((r[e] = t), delete r[o]);
    });
  };
export { u as n };
