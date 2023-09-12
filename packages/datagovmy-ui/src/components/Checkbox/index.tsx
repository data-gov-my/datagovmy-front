import Label, { LabelProps } from "../Label";
import { OptionType } from "../../../types";
import { FunctionComponent } from "react";
import { clx } from "../../lib/helpers";

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
  className = "flex flex-wrap gap-x-4.5 gap-y-2.5 pt-2",
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
      <ul className={clx(className)}>
        {options.map((option: OptionType, index) => (
          <li key={index}>
            <label htmlFor={option.value} className="flex items-center gap-2">
              <input
                id={option.value}
                value={option.value}
                type="checkbox"
                name={name}
                checked={value.some(item => item.value === option.value)}
                className="border-outline accent-primary dark:accent-primary-dark rounded border-2 focus:ring-0 focus:ring-transparent"
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
