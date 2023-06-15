import { e as n } from "./engine-user-agent.js";
var e, r;
function t() {
  if (r) return e;
  r = 1;
  var i = n;
  return (e = /(?:ipad|iphone|ipod).*applewebkit/i.test(i)), e;
}
export { t as __require };
