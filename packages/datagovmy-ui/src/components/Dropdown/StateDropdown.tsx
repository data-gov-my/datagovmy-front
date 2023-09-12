import { OptionType } from "../../../types";
import { WindowContext } from "../../contexts/window";
import { statesOptions } from "../../lib/options";
import { useTranslation } from "../../hooks/useTranslation";
import { useRouter } from "next/router";
import { FunctionComponent, useContext, useMemo } from "react";
import { default as Dropdown } from ".";
import { clx } from "../../lib/helpers";

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
  disabled = false,
  hideOnScroll = false,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { scroll } = useContext(WindowContext);
  const redirect = (selected: OptionType) => {
    if (selected.value === "mys") {
      url && router.push(url, undefined, { scroll: false });
      return;
    }
    url && router.push(`${url}/${selected.value}`, undefined, { scroll: false });
  };

  const show = useMemo(() => scroll.y > 300, [scroll.y]);
  const options = include ? statesOptions.concat(include) : statesOptions;

  return (
    <div className={clx(!hideOnScroll ? `block ${width}` : show ? "hidden lg:block" : "hidden")}>
      <Dropdown
        className={clx("flex-row items-center", className)}
        onChange={selected => (onChange ? onChange(selected) : redirect(selected))}
        disabled={disabled}
        selected={options.find(state => state.value === currentState)}
        options={options.filter(option => !exclude?.includes(option.value))}
        placeholder={t("common:placeholder.state")}
        enableFlag
        anchor={anchor}
        width={width}
        sublabel={sublabel}
      />
    </div>
  );
};

export default StateDropdown;
