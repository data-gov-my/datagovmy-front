import { e as i } from "./engine-user-agent.js";
var e, n;
function o() {
  if (n) return e;
  n = 1;
  var r = i;
  return (e = /ipad|iphone|ipod/i.test(r) && typeof Pebble < "u"), e;
}
export { o as __require };
