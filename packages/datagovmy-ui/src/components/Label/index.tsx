import { FunctionComponent } from "react";

export interface LabelProps {
  name?: string;
  label?: string;
  className?: string;
  required?: boolean;
}

const Label: FunctionComponent<LabelProps> = ({
  name,
  label,
  required,
  className = "text-sm font-medium text-black dark:text-white block",
}) => {
  return (
    <label htmlFor={name} className={className}>
      {label}
      {required && <span className="text-danger"> *</span>}
    </label>
  );
};

export default Label;
