import { g as t } from "./global.js";
import { e as g } from "./engine-user-agent.js";
var n = t,
  o = g,
  s = n.process,
  a = n.Deno,
  i = (s && s.versions) || (a && a.version),
  v = i && i.v8,
  r,
  e;
v && ((r = v.split(".")), (e = r[0] > 0 && r[0] < 4 ? 1 : +(r[0] + r[1])));
!e &&
  o &&
  ((r = o.match(/Edge\/(\d+)/)),
  (!r || r[1] >= 74) && ((r = o.match(/Chrome\/(\d+)/)), r && (e = +r[1])));
var p = e;
export { p as e };
