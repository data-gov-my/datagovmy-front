import Label, { LabelProps } from "@components/Label";
import { FunctionComponent, HTMLInputTypeAttribute, ReactElement, useEffect, useRef } from "react";

interface InputProps extends LabelProps {
  className?: string;
  type?: Omit<HTMLInputTypeAttribute, "radio" | "checkbox">;
  placeholder?: string;
  icon?: ReactElement;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  autoFocus?: boolean;
}

const Input: FunctionComponent<InputProps> = ({
  name,
  label,
  className = "px-4",
  type = "text",
  value,
  placeholder,
  icon,
  required = false,
  autoFocus = false,
  onChange,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && autoFocus) ref.current.focus();
  }, []);

  return (
    <div className="relative flex w-full flex-col gap-2">
      {label && <Label name={name} label={label} />}
      <div
        className={`absolute left-2 h-full text-dim ${
          !label ? "translate-y-[25%]" : "translate-y-[65%]"
        }`}
      >
        {icon && icon}
      </div>

      <input
        id={name}
        ref={ref}
        autoFocus={autoFocus}
        type={type as string}
        className={`w-full rounded-md border-outline text-sm outline-none focus:outline-none focus:ring-0 md:text-base ${className}`}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={e => onChange && onChange(e.target.value)}
      />
    </div>
  );
};

export default Input;
