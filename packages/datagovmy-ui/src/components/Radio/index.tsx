import { FunctionComponent } from "react";
import Label, { LabelProps } from "../Label";
import { OptionType } from "../../../types";

interface RadioProps extends LabelProps {
  className?: string;
  name: string;
  options: OptionType[];
  value: OptionType;
  disabled?: boolean;
  onChange?: (value: OptionType) => void;
}

const Radio: FunctionComponent<RadioProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  className = "flex flex-wrap gap-x-4.5 gap-y-2.5 pt-2",
}) => {
  return (
    <div>
      {label && <Label label={label} />}

      <ul className={className}>
        {options.map((option: OptionType) => (
          <li key={option.value}>
            <label htmlFor={option.value} className="flex items-center gap-2">
              <input
                id={option.value}
                value={option.value}
                type="radio"
                name={name}
                checked={value && option.value === value.value}
                className="border-outline text-primary focus:ring-primary dark:checked:bg-primary border-2 dark:bg-inherit"
                onChange={e => onChange && onChange(option)}
              />
              <span className="block text-sm">{option.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Radio;
