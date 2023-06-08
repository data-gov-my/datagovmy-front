import { FunctionComponent } from "react";

export interface LabelProps {
  name?: string;
  label?: string;
  className?: string;
}

const Label: FunctionComponent<LabelProps> = ({
  name,
  label,
  className = "text-sm font-medium text-black block pt-4",
}) => {
  return (
    <label htmlFor={name} className={className}>
      {label}
    </label>
  );
};

export default Label;
