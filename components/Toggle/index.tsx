import { ChangeEvent, FunctionComponent, useState } from "react";

interface ToggleProps {
  enabled: boolean;
  onStateChanged: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const Toggle: FunctionComponent<ToggleProps> = ({
  enabled,
  label = "",
  onStateChanged,
  disabled = false,
}) => {
  const [toggled, setToggled] = useState(enabled);

  return (
    <div className="flex flex-row items-center gap-1.5">
      <input
        disabled={disabled}
        type="checkbox"
        className=""
        checked={toggled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setToggled(prevToggled => !prevToggled);
          onStateChanged(e.target.checked);
        }}
      />
      <label className="text-sm text-black dark:text-white" htmlFor={label}>
        {label}
      </label>
    </div>
  );
};

export default Toggle;
