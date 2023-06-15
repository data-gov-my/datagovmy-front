import { e as n } from "./engine-user-agent.js";
var e, r;
function t() {
  if (r) return e;
  r = 1;
  var i = n;
  return (e = /web0s(?!.*chrome)/i.test(i)), e;
}
export { t as __require };
