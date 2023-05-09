import { OptionType } from "@components/types";
import { WindowContext } from "@hooks/useWindow";
import { statesOptions } from "@lib/options";
import { useTranslation } from "@hooks/useTranslation";
import { useRouter } from "next/router";
import { FunctionComponent, useContext, useMemo } from "react";
import { default as Dropdown } from ".";

interface StateDropdownProps {
  anchor?: string;
  className?: string;
  url?: string;
  currentState?: string;
  onChange?: (selected: OptionType) => void;
  disabled?: boolean;
  include?: OptionType[];
  exclude?: string[];
  hideOnScroll?: boolean;
  width?: string;
  shadow?: string;
  sublabel?: string;
  darkMode?: boolean;
}

const StateDropdown: FunctionComponent<StateDropdownProps> = ({
  anchor,
  className,
  url,
  currentState,
  onChange,
  include,
  exclude,
  width = "w-64",
  sublabel,
  shadow,
  disabled = false,
  hideOnScroll = false,
  darkMode = false,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  //   const { scroll } = useContext(WindowContext);
  const redirect = (selected: OptionType) => {
    if (selected.value === "mys") {
      url && router.push(url, undefined, { scroll: false });
      return;
    }
    url && router.push(`${url}/${selected.value}`, undefined, { scroll: false });
  };

  const show = true;
  const options = include ? statesOptions.concat(include) : statesOptions;

  return (
    <div className={!hideOnScroll ? `block ${width}` : show ? "hidden lg:block" : "hidden"}>
      <Dropdown
        className="flex-row items-center"
        shadow={shadow}
        onChange={selected => (onChange ? onChange(selected) : redirect(selected))}
        disabled={disabled}
        selected={options.find(state => state.value === currentState)}
        options={options.filter(option => !exclude?.includes(option.value))}
        placeholder={t("common:placeholder.state")}
        enableFlag
        anchor={anchor}
        darkMode={darkMode}
        width={width}
        sublabel={sublabel}
      />
    </div>
  );
};

export default StateDropdown;
