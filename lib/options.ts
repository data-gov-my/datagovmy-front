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

// For Covid Vaccinatino page
export const filterDoseOptions = [
  { label: "1st Dose", value: "dose1" },
  { label: "2nd Dose", value: "dose2" },
  { label: "1st Booster", value: "booster1" },
  { label: "2nd Booster", value: "booster2" },
];

export const filterAgeOptions = [
  { label: "Total Population", value: "total" },
  { label: "Children (5-11)", value: "child" },
  { label: "Adolescents (12-17)", value: "adolescent" },
  { label: "Adults (18+)", value: "adult" },
  { label: "Elderly (60+)", value: "elderly" },
];
