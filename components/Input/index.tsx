import Label, { LabelProps } from "@components/Label";
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
          "absolute left-2 h-full text-dim",
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
        type={type as HTMLInputTypeAttribute}
        min={min}
        max={max}
        className={[
          "rounded-md border-outline outline-none placeholder:text-dim focus:border-outlineHover focus:outline-none focus:ring-0 focus:ring-dim dark:border-washed-dark dark:bg-black dark:focus:border-outlineHover-dark",
          icon ? "pl-10" : "",
          className,
        ].join(" ")}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={e => {
          if (onChange) onChange(e.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      {validation && <p className="text-xs text-danger">{validation}</p>}
    </div>
  );
};

export default Input;
