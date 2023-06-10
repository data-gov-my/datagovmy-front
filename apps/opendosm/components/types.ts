import { ReactElement } from "react";

export type OptionType<L = ReactElement | ReactElement[] | string, V = string> = {
  label: L;
  value: V;
};
