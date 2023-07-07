import { CSSProperties, ReactNode } from "react";
import { Combobox } from "@headlessui/react";
import { clx } from "@lib/helpers";
import ImageWithFallback from "@components/ImageWithFallback";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { OptionType } from "@components/types";

export type ComboOptionProp<T extends unknown> = OptionType & T;

export type ComboOptionProps<T> = {
  option: ComboOptionProp<T>;
  format?: (option: ComboOptionProp<T>) => ReactNode;
  enableFlag?: boolean;
  imageSource?: string;
  fallback?: ReactNode;
  style?: CSSProperties;
};

const ComboOption = <T extends unknown>({
  option,
  format,
  enableFlag,
  imageSource,
  fallback,
  style,
}: ComboOptionProps<T>) => {
  return (
    <Combobox.Option
      style={style}
      className={({ active }) =>
        clx(
          "relative flex w-full cursor-pointer select-none flex-row gap-2 px-4 py-2",
          active && "bg-washed dark:bg-washed-dark"
        )
      }
      value={option}
    >
      {({ selected }) => (
        <div className="flex w-full items-center gap-2">
          {format ? (
            <p className={clx("flex gap-x-1 truncate", selected ? "font-medium" : "font-normal")}>
              {format(option)}
            </p>
          ) : (
            <div className="flex w-full flex-row gap-2">
              {enableFlag && (
                <div className="flex h-auto max-h-8 w-8 shrink-0 justify-center self-center">
                  <ImageWithFallback
                    className="border-outline dark:border-outlineHover-dark rounded border"
                    src={`${imageSource}${option.value}.png`}
                    fallback={fallback}
                    width={32}
                    height={18}
                    alt={option.value as string}
                    style={{
                      width: "auto",
                      maxWidth: "32px",
                      height: "auto",
                      maxHeight: "32px",
                    }}
                  />
                </div>
              )}
              <p
                className={clx("block grow self-center", selected ? "font-medium" : "font-normal")}
              >
                {option.label}
              </p>
            </div>
          )}
          {selected && (
            <span className="absolute inset-y-0 right-3 flex items-center">
              <CheckCircleIcon className="text-primary dark:text-primary-dark h-4 w-4" />
            </span>
          )}
        </div>
      )}
    </Combobox.Option>
  );
};

export default ComboOption;
