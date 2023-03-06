import { FunctionComponent } from "react";
import Label, { LabelProps } from "@components/Label";
import { OptionType } from "@components/types";

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
  className = "space-y-1 pt-2",
}) => {
  return (
    <div>
      <Label label={label} />

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
                className="border-2 border-outline text-black focus:ring-black"
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
