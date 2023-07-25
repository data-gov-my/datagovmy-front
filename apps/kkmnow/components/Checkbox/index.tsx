import { ChangeEventHandler, FunctionComponent, ReactElement } from "react";

interface CheckboxProps {
  name?: string;
  value: boolean;
  required?: boolean;
  disabled?: boolean;
  children: string | ReactElement;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Checkbox: FunctionComponent<CheckboxProps> = ({
  name,
  required,
  value,
  disabled = false,
  children,
  onChange,
}) => {
  return (
    <div className="checkbox text-sm">
      <label htmlFor={name}>
        <div className="relative flex items-center gap-4">
          <input
            id={name}
            className="h-4 w-4 rounded border border-outline text-black shadow-sm focus:ring-black"
            type="checkbox"
            name={name}
            defaultChecked={value}
            disabled={disabled}
            onChange={onChange}
            required={required}
          />
          {children}
        </div>
      </label>
    </div>
  );
};

export default Checkbox;
