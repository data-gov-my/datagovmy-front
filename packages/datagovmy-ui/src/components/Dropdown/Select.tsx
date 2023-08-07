import type { OptionType } from "../../../types";
import { default as Label, LabelProps } from "../Label";
import { Fragment, FunctionComponent, ReactNode } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { clx } from "../../lib/helpers";

type CommonProps = {
  className?: string;
  disabled?: boolean;
  options?: OptionType[] | Record<string, OptionType[]> | never[];
  label?: string;
  sublabel?: ReactNode;
  anchor?: "left" | "right" | string;
};

type ConditionalProps =
  | {
      multiple?: true;
      selected?: any[];
      title?: string;
      placeholder?: string;
      onChange: (selected: any) => void;
    }
  | {
      multiple?: false;
      selected?: any;
      title?: never;
      placeholder?: string;
      onChange: (selected: any) => void;
    };

type SelectProps = CommonProps & ConditionalProps & LabelProps;

const Select: FunctionComponent<SelectProps> = ({
  className = "relative lg:w-fit flex gap-1.5 rounded-md border py-1.5 pl-3 pr-8 text-left shadow-button",
  disabled = false,
  multiple = false,
  options = dummy,
  selected,
  onChange,
  title,
  anchor = "right",
  placeholder,
  label,
  sublabel,
}) => {
  const handleChange = (options: any) => {
    onChange(options);
  };

  const recurOptions = (
    options: Record<string, OptionType[]> | OptionType[],
    key?: string
  ): any => {
    if (isOptions(options)) {
      return (
        <div
          className="dark:border-outlineHover-dark relative w-full bg-white dark:bg-black"
          key={key}
        >
          {key && <h5 className="bg-washed sticky top-0 z-10 px-4 py-1.5 text-sm">{key}</h5>}
          <div>
            {options.map(option => (
              <Listbox.Option
                key={option.value}
                className={[
                  "hover:bg-washed dark:hover:bg-washed-dark relative flex cursor-default select-none items-center gap-2 py-2 pr-4 transition-all",
                  multiple ? "pl-10" : "pl-8",
                  selected.some((item: OptionType) => item.value == option.value)
                    ? "bg-washed dark:bg-washed-dark"
                    : "bg-inherit",
                ].join(" ")}
                onClick={() => (multiple ? handleChange(option) : null)}
                value={option}
              >
                <span
                  className={[
                    "block truncate",
                    option === selected ? "font-medium" : "font-normal",
                  ].join(" ")}
                >
                  {option.label}
                </span>
                {multiple && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <input
                      type="checkbox"
                      readOnly
                      checked={
                        selected &&
                        (selected as OptionType[]).some(item => item.value === option.value)
                      }
                      className="border-outline text-dim h-4 w-4 rounded focus:ring-0"
                    />
                  </span>
                )}
              </Listbox.Option>
            ))}
          </div>
        </div>
      );
    }

    return Object.entries(options).map(([key, values]) => recurOptions(values, key));
  };

  const isOptions = (
    options: Record<string, OptionType[]> | OptionType[]
  ): options is OptionType[] => {
    return Array.isArray(options);
  };

  return (
    <div className="space-y-2">
      {label && <Label label={label} />}
      <Listbox
        value={selected}
        onChange={(option: OptionType & OptionType[]) => !multiple && handleChange(option)}
        multiple={multiple}
        disabled={disabled}
      >
        {({ open }) => (
          <>
            <div className={clx("relative text-sm", disabled ? "cursor-not-allowed" : "")}>
              <Listbox.Button
                className={clx(
                  "dark:border-washed-dark shadow-button relative flex w-full flex-col items-start gap-1.5 rounded-md border py-1.5 pl-3 pr-8 text-left dark:bg-black lg:w-fit lg:flex-row lg:items-center",
                  className,
                  disabled
                    ? "bg-outline text-dim pointer-events-none"
                    : "hover:border-outlineHover focus:outline-none focus-visible:ring-0"
                )}
              >
                <>
                  {sublabel && <span className="text-dim truncate">{sublabel}</span>}

                  <span className={`block truncate ${label ? "" : ""}`}>
                    {multiple
                      ? title ?? placeholder
                      : (selected as OptionType)?.label || placeholder || "Select"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                    <ChevronDownIcon className="text-dim h-5 w-5" aria-hidden="true" />
                  </span>
                </>
              </Listbox.Button>
              <Transition
                show={open && !disabled}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={clx(
                    "shadow-floating absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none lg:w-auto",
                    anchor === "right" ? "right-0" : anchor === "left" ? "left-0" : anchor
                  )}
                  static={!disabled}
                >
                  {recurOptions(options)}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default Select;

const dummy: Record<string, OptionType[]> = {
  "Healthcare > Dental Services": [
    {
      label: "Scaling",
      value: "dental_services",
    },
    {
      label: "Brushing",
      value: "private_clinic",
    },
    {
      label: "Extraction",
      value: "dermatological_center",
    },
  ],
  "Healthcare > Optometry": [
    {
      label: "Optical lenses",
      value: "dental_services",
    },
    {
      label: "Laser eye surgery",
      value: "private_clinic",
    },
    //     {
    //       label: "Dermatology Center",
    //       value: "dermatological_center",
    //     },
    //   ],
    //   Tourism: [
    //     {
    //       label: "Dental Services",
    //       value: "dental_services",
    //     },
    //     {
    //       label: "Private Clinic",
    //       value: "private_clinic",
    //     },
    //     {
    //       label: "Dermatology Center",
    //       value: "dermatological_center",
    //     },
    //   ],
    //   Pharmaceutical: [
    //     {
    //       label: "Dental Services",
    //       value: "dental_services",
    //     },
    //     {
    //       label: "Private Clinic",
    //       value: "private_clinic",
    //     },
    //     {
    //       label: "Dermatology Center",
    //       value: "dermatological_center",
    //     },
    //   ],
    //   Healthcare4: [
    //     {
    //       label: "Dental Services",
    //       value: "dental_services",
    //     },
    //     {
    //       label: "Private Clinic",
    //       value: "private_clinic",
    //     },
    //     {
    //       label: "Dermatology Center",
    //       value: "dermatological_center",
    //     },
  ],
};
