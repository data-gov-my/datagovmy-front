import Label, { LabelProps } from "@components/Label";
import { clx } from "@lib/helpers";
import { FunctionComponent, HTMLInputTypeAttribute, ReactElement, useEffect, useRef } from "react";

interface InputProps extends LabelProps {
  className?: string;
  type?: Omit<HTMLInputTypeAttribute, "radio" | "checkbox">;
  placeholder?: string;
  icon?: ReactElement;
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (value: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  required?: boolean;
  autoFocus?: boolean;
  spellCheck?: boolean;
  validation?: string;
  disabled?: boolean;
}

const Input: FunctionComponent<InputProps> = ({
  name,
  label,
  className = "px-4 w-full text-sm md:text-base",
  type = "text",
  value,
  placeholder,
  min,
  max,
  icon,
  required = false,
  autoFocus = false,
  spellCheck = false,
  validation = "",
  onChange,
  onKeyDown,
  disabled = false,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && autoFocus) ref.current.focus();
  }, []);

  return (
    <div className="relative flex w-full flex-col gap-2">
      {label && <Label name={name} label={label} />}
      <div
        className={[
          "text-dim absolute left-2 h-full",
          !label ? "translate-y-[25%]" : "translate-y-[65%]",
        ].join(" ")}
      >
        {icon && icon}
      </div>

      <input
        id={name}
        ref={ref}
        autoFocus={autoFocus}
        disabled={disabled}
        spellCheck={spellCheck}
        type={type as HTMLInputTypeAttribute}
        min={min}
        max={max}
        className={clx(
          "placeholder:text-dim focus:ring-dim rounded-md outline-none focus:outline-none dark:bg-black",
          "focus:ring-primary dark:focus:ring-primary-dark",
          icon ? "pl-10" : "",
          validation ? "border-danger border-2" : "border-outline dark:border-washed-dark",
          className
        )}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={e => {
          if (onChange) onChange(e.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      {validation && <p className="text-danger text-xs">{validation}</p>}
    </div>
  );
};

export default Input;
