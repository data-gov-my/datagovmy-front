import { __module as e } from "../../_virtual/index4.js";
import { __require as o } from "./cjs/react-is.production.min.js";
import { __require as t } from "./cjs/react-is.development.js";
var r;
function p() {
  return r
    ? e.exports
    : ((r = 1),
      process.env.NODE_ENV === "production" ? (e.exports = o()) : (e.exports = t()),
      e.exports);
}
export { p as __require };
