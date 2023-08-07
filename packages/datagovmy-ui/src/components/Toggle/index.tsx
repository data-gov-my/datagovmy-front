import { ChangeEvent, FunctionComponent, useState } from "react";

interface ToggleProps {
  enabled: boolean;
  label?: string;
  onStateChanged: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle: FunctionComponent<ToggleProps> = ({
  enabled,
  label,
  onStateChanged,
  disabled = false,
}) => {
  const [toggled, setToggled] = useState(enabled);

  return (
    <div className="flex flex-row items-center gap-1.5">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={toggled}
          disabled={disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setToggled(prevToggled => !prevToggled);
            onStateChanged(e.target.checked);
          }}
        />
        <span className="bg-outline peer-checked:bg-primary peer h-4 w-[26px] rounded-full after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-2.5 peer-focus:ring-blue-500 dark:bg-zinc-800 dark:after:bg-slate-100" />
      </label>
      <span className="text-sm text-black dark:text-white">{label}</span>
    </div>
  );
};

export default Toggle;
