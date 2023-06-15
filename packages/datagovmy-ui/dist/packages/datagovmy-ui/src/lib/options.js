import { MALAYSIA as e, STATES as l } from "./constants.js";
import { sortMsiaFirst as o } from "../../../../helpers.js";
const n = [
    { label: "English", value: "en-GB" },
    { label: "Malay", value: "ms-MY" },
  ],
  m = [e].concat(o(l, "key")).map(a => ({
    label: a.name,
    value: a.key,
  }));
export { n as languages, m as statesOptions };
