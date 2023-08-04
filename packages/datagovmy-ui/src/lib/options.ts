import { OptionType } from "../../types";
import { MALAYSIA, STATES } from "./constants";
import { sortMsiaFirst } from "./helpers";

export const languages: OptionType[] = [
  { label: "English", value: "en-GB" },
  { label: "Malay", value: "ms-MY" },
];

/**
 * States defs for StateDropdown.
 */
export const statesOptions: OptionType[] = [MALAYSIA]
  .concat(sortMsiaFirst(STATES, "key"))
  .map(state => ({
    label: state.name,
    value: state.key,
  }));
