import { formatDecimalParts as a } from "./formatDecimal.js";
function e(t) {
  return (t = a(Math.abs(t))), t ? t[1] : NaN;
}
export { e as default };
