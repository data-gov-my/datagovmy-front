export type OptionType<L = string, V = string> = {
  label: L;
  value: V;
};

export const isOptionType = (value: any): value is OptionType => "value" in value;
