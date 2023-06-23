import { FunctionComponent } from "react";
import Label, { LabelProps } from "@components/Label";
import { OptionType } from "@components/types";

interface CheckboxProps extends LabelProps {
  className?: string;
  name: string;
  options: OptionType[];
  value: OptionType[];
  disabled?: boolean;
  onChange?: (value: OptionType[]) => void;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  className = "space-y-1 pt-2",
}) => {
  const isSelected = (option: OptionType): boolean => {
    return option && value.some((item: OptionType) => item.value === option.value);
  };

  const handleDeselect = (option: OptionType): any => {
    return (value as OptionType[]).filter((item: OptionType) => item.value !== option.value);
  };
  const handleChange = (option: OptionType) => {
    if (!onChange) return;
    const added = option;
    if (!isSelected(added)) {
      value ? onChange([...value, option]) : onChange([option]);
    } else {
      onChange(handleDeselect(added));
    }
  };
  return (
    <div>
      <Label label={label} />
      <ul className={className}>
        {options.map((option: OptionType, index) => (
          <li key={index}>
            <label htmlFor={option.value} className="flex items-center gap-2">
              <input
                id={option.value}
                value={option.value}
                type="checkbox"
                name={name}
                checked={value.some(item => item.value === option.value)}
                className="rounded border-2 border-outline text-black focus:ring-0 focus:ring-transparent"
                onChange={() => onChange && handleChange(option)}
              />
              <span className="block text-sm">{option.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checkbox;
