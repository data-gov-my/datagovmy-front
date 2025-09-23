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

export const frequencies = (t: (key: string) => string): OptionType[] => [
  { label: t("catalogue:filter_options.daily"), value: "DAILY" },
  { label: t("catalogue:filter_options.weekly"), value: "WEEKLY" },
  { label: t("catalogue:filter_options.monthly"), value: "MONTHLY" },
  { label: t("catalogue:filter_options.quarterly"), value: "QUARTERLY" },
  { label: t("catalogue:filter_options.yearly"), value: "YEARLY" },
  { label: t("catalogue:filter_options.one_off"), value: "ONE_OFF" },
];
export const geographies = (t: (key: string) => string): OptionType[] => [
  { label: t("catalogue:filter_options.national"), value: "NATIONAL" },
  { label: t("catalogue:filter_options.state"), value: "STATE" },
  { label: t("catalogue:filter_options.district"), value: "DISTRICT" },
  { label: t("catalogue:filter_options.parlimen"), value: "PARLIMEN" },
  { label: t("catalogue:filter_options.dun"), value: "DUN" },
];
export const demographies = (t: (key: string) => string): OptionType[] => [
  { label: t("catalogue:filter_options.sex"), value: "SEX" },
  { label: t("catalogue:filter_options.ethnicity"), value: "ETHNICITY" },
  { label: t("catalogue:filter_options.age"), value: "AGE" },
  { label: t("catalogue:filter_options.religion"), value: "RELIGION" },
  { label: t("catalogue:filter_options.nationality"), value: "NATIONALITY" },
  { label: t("catalogue:filter_options.disability"), value: "DISABILITY" },
  { label: t("catalogue:filter_options.marital"), value: "MARITAL" },
];
export const resourceType = (t: (key: string) => string): OptionType[] => [
  { label: t("publications:download_mobile_excel"), value: "excel" },
  { label: t("publications:download_mobile_pdf"), value: "pdf" },
];
