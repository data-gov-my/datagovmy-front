import { OptionType } from "@components/types";
import { useWindowScroll } from "@hooks/useWindowWidth";
import { statesOptions } from "@lib/options";
import { useTranslation } from "@hooks/useTranslation";
import { useRouter } from "next/router";
import { FunctionComponent, useMemo } from "react";
import { default as Dropdown } from ".";

interface StateDropdownProps {
  className?: string;
  url?: string;
  currentState?: string;
  onChange?: (selected: OptionType) => void;
  disabled?: boolean;
  include?: OptionType[];
  exclude?: string[];
  hideOnScroll?: boolean;
  width?: string;
  sublabel?: string;
  darkMode?: boolean;
}

const StateDropdown: FunctionComponent<StateDropdownProps> = ({
  className,
  url,
  currentState,
  onChange,
  include,
  exclude,
  width = "w-64",
  sublabel,
  disabled = false,
  hideOnScroll = false,
  darkMode = false,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const scroll = useWindowScroll();
  const redirect = (selected: OptionType) => {
    if (selected.value === "mys") {
      url && router.push(url, undefined, { scroll: false });
      return;
    }
    url && router.push(`${url}/${selected.value}`, undefined, { scroll: false });
  };

  const show = useMemo(() => scroll.scrollY > 300, [scroll.scrollY]);
  const options = include ? statesOptions.concat(include) : statesOptions;

  return (
    <div className={!hideOnScroll ? `block ${width}` : show ? "hidden lg:block" : "hidden"}>
      <Dropdown
        className="flex-row items-center"
        onChange={selected => (onChange ? onChange(selected) : redirect(selected))}
        disabled={disabled}
        selected={options.find(state => state.value === currentState)}
        options={options.filter(option => !exclude?.includes(option.value))}
        placeholder={t("placeholder.state")}
        enableFlag
        darkMode={darkMode}
        width={width}
        sublabel={sublabel}
      />
    </div>
  );
};

export default StateDropdown;
