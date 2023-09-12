import { clx } from "../../lib/helpers";
import ImageWithFallback from "../ImageWithFallback";
import { OptionType } from "../../../types";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ForwardedRef, forwardRef, ReactNode } from "react";
import { useId } from "@floating-ui/react";

export type ComboOptionProp<T extends unknown> = OptionType & T;

export type ComboOptionProps<T> = {
  option: ComboOptionProp<T>;
  format?: (option: ComboOptionProp<T>) => ReactNode;
  onClick?: () => void;
  image?: (value: string) => ReactNode;
  isSelected: boolean;
  active: boolean;
  index: number;
  total: number;
};

function ComboOptionInner<T>(
  {
    option,
    format,
    image,
    onClick,
    isSelected,
    active,
    index,
    total,
    ...rest
  }: ComboOptionProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const id = useId();

  return (
    <div
      id={id}
      ref={ref}
      role="option"
      aria-selected={active}
      onClick={onClick}
      {...rest}
      // As the list is virtualized, this lets the assistive tech know
      // how many options there are total without looking at the DOM.
      aria-setsize={total}
      aria-posinset={index + 1}
      className={clx(
        "relative flex w-full cursor-pointer select-none flex-row gap-2 px-4 py-2",
        active && "bg-washed dark:bg-washed-dark"
      )}
    >
      <>
        {format ? (
          <p className={clx("flex gap-x-1 truncate", isSelected ? "font-medium" : "font-normal")}>
            {format(option)}
          </p>
        ) : (
          <>
            {image && image(option.value)}
            <p
              className={clx("block grow self-center", isSelected ? "font-medium" : "font-normal")}
            >
              {option.label}
            </p>
          </>
        )}
        {isSelected && (
          <span className="absolute inset-y-0 right-3 flex items-center">
            <CheckCircleIcon className="text-primary dark:text-primary-dark h-4 w-4" />
          </span>
        )}
      </>
    </div>
  );
}

// Solution variant #2: Wrapping to make forwardRef work with generics
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
const ComboOption = forwardRef(ComboOptionInner) as <T>(
  props: ComboOptionProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof ComboOptionInner>;

export default ComboOption;
