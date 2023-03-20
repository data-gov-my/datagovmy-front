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
  isValidation?: boolean;
  validationText?: string;
}

const Input: FunctionComponent<InputProps> = ({
  name,
  label,
  className = "px-4 w-full rounded-md border-outline text-sm placeholder:text-dim dark:bg-inherit dark:text-white md:text-base",
  type = "text",
  value,
  placeholder,
  icon,
  required = false,
  autoFocus = false,
  isValidation = false,
  validationText = "",
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
        type={type as HTMLInputTypeAttribute}
        className={[
          "outline-none focus:outline-none focus:ring-0 dark:bg-inherit dark:text-white",
          icon ? "pl-10" : "",
          className,
          isValidation ? "border-2 border-danger dark:border-danger" : "",
        ].join(" ")}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={e => onChange && onChange(e.target.value)}
      />
      {isValidation ? <p className="text-xs text-danger">{validationText}</p> : <></>}
    </div>
  );
};

export default Input;
