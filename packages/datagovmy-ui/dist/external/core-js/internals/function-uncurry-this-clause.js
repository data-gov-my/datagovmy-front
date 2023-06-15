import { c as a } from "./classof-raw.js";
import { f as n } from "./function-uncurry-this.js";
var o = a,
  s = n,
  u = function (r) {
    if (o(r) === "Function") return s(r);
  };
export { u as f };
