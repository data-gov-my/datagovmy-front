import { __require as i } from "../helpers/regeneratorRuntime.js";
var r, t;
function o() {
  if (t) return r;
  t = 1;
  var e = i()();
  r = e;
  try {
    regeneratorRuntime = e;
  } catch {
    typeof globalThis == "object"
      ? (globalThis.regeneratorRuntime = e)
      : Function("r", "regeneratorRuntime = r")(e);
  }
  return r;
}
export { o as __require };
