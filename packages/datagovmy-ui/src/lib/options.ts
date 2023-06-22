import { MALAYSIA, STATES } from "./constants";
import { sortMsiaFirst } from "./helpers";

export const languages = [
  { label: "English", value: "en-GB" },
  { label: "Malay", value: "ms-MY" },
];

/**
 * States defs for StateDropdown.
 */
export const statesOptions = [MALAYSIA].concat(sortMsiaFirst(STATES, "key")).map(state => ({
  label: state.name,
  value: state.key,
}));
