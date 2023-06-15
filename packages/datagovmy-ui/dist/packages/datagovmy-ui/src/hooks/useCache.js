import { useRef as c } from "react";
const n = (e = {}) => ({
  cache: c(new Map(Object.entries(e))).current,
});
export { n as useCache };
