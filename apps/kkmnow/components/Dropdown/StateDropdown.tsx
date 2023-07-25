import { OptionType } from "@components/types";
import { useWindowScroll } from "@hooks/useWindowWidth";
import { statesOptions } from "@lib/options";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useMemo } from "react";
import Dropdown from ".";

interface StateDropdownProps {
  className?: string;
  url?: string;
  currentState?: string;
  onChange?: (selected: OptionType) => void;
  disabled?: boolean;
  exclude?: string[];
  hideOnScroll?: boolean;
  width?: string;
  label?: string;
}

const StateDropdown: FunctionComponent<StateDropdownProps> = ({
  className,
  url,
  currentState,
  onChange,
  exclude,
  width = "w-64",
  label,
  disabled = false,
  hideOnScroll = false,
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

  return (
    <div className={!hideOnScroll ? `block ${width}` : show ? "hidden lg:block" : "hidden"}>
      <Dropdown
        onChange={selected => (onChange ? onChange(selected) : redirect(selected))}
        disabled={disabled}
        selected={statesOptions.find(state => state.value === currentState)}
        options={statesOptions.filter(option => !exclude?.includes(option.value))}
        placeholder={t("placeholder.state")}
        enableFlag
        width={width}
        label={label}
      />
    </div>
  );
};

export default StateDropdown;
