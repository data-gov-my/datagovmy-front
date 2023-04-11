import { useState, FunctionComponent, ReactNode } from "react";
import { toDate } from "@lib/helpers";
import { Root, Track, Range, Thumb } from "@radix-ui/react-slider";
import { useTranslation } from "@hooks/useTranslation";
import { useWatch } from "@hooks/useWatch";

type BaseProps = {
  className?: string;
  data?: Array<number | string>;
  parseAsDate?: boolean;
  period?: "year" | "month" | "day" | "auto" | "quarter";
};

type RangeProps = BaseProps & {
  type: "range";
  onChange: ([min, max]: number[] & number) => void;
  value: [number, number];
  step?: never;
};
type SingleProps = BaseProps & {
  type: "single";
  onChange: (value: number) => void;
  value: number;
  step?: number;
};

type SliderProps = RangeProps | SingleProps;

const Slider: FunctionComponent<SliderProps> = ({
  type,
  onChange,
  step,
  value,
  data = dummy,
  period = "auto",
  parseAsDate = true,
}) => {
  const { i18n } = useTranslation();
  const [minmax, setMinmax] = useState<number[]>(type === "range" ? [value[0], value[1]] : [value]);

  const dateFormat = {
    auto: "dd MMM yyyy",
    day: "dd MMM yyyy",
    month: "MMM yyyy",
    quarter: "qQ yyyy",
    year: "yyyy",
  };

  useWatch(() => {
    if (type === "range") setMinmax([0, data.length - 1]);
  }, [data]);

  return {
    range: (
      <>
        <Root
          className="group relative flex h-5 w-auto touch-none select-none items-center pt-10"
          value={minmax}
          min={0}
          max={data.length - 1}
          onValueChange={e => setMinmax(e)}
          onValueCommit={(e: number[] & number) => onChange(e)}
          minStepsBetweenThumbs={1}
        >
          <p className="w-fit text-sm text-dim">
            {parseAsDate ? toDate(data[0], "yyyy", i18n.language) : data[0]}
          </p>
          <div className="group relative flex h-5 grow touch-none select-none items-center">
            <Track className="relative z-0 mx-3 h-2 grow rounded-full bg-[#E2E8F0] dark:bg-washed-dark">
              <Range className="absolute z-0 h-full rounded-xl bg-[#A1A1AA] group-focus-within:bg-primary group-hover:bg-primary dark:group-focus-within:bg-primary dark:group-hover:bg-primary" />
            </Track>
            <Thumb className="ml-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary group-hover:border-primary group-hover:ring-4 group-hover:ring-primary">
              <SliderTooltip>
                {parseAsDate
                  ? toDate(data[minmax[0]], dateFormat[period], i18n.language)
                  : data[minmax[0]]}
              </SliderTooltip>
            </Thumb>
            <Thumb className="mr-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary group-hover:border-primary group-hover:ring-4 group-hover:ring-primary">
              <SliderTooltip>
                {parseAsDate
                  ? toDate(data[minmax[1]], dateFormat[period], i18n.language)
                  : data[minmax[1]]}
              </SliderTooltip>
            </Thumb>
          </div>
          <p className="w-fit text-sm text-dim">
            {parseAsDate
              ? toDate(data[data.length - 1], "yyyy", i18n.language)
              : data[data.length - 1]}
          </p>
        </Root>
      </>
    ),
    single: (
      <Root
        className="group relative flex h-5 w-auto touch-none select-none items-center pt-10"
        defaultValue={[value as number]}
        max={data.length - 1}
        step={step}
        onValueChange={e => setMinmax(e)}
        onValueCommit={(e: number[] & number) => onChange(e)}
      >
        <p className="w-fit pr-2 text-sm text-dim">
          {parseAsDate ? toDate(data[0], "yyyy", i18n.language) : data[0]}
        </p>
        <div className="group relative flex h-5 grow touch-none select-none items-center">
          <Track className="relative z-0 h-2 grow rounded-full bg-[#E2E8F0] px-3 dark:bg-washed-dark">
            <Range className="absolute z-0 h-full rounded-xl bg-[#A1A1AA] group-focus-within:bg-primary group-hover:bg-primary dark:group-focus-within:bg-primary dark:group-hover:bg-primary" />
          </Track>
          <Thumb className="mx-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary group-hover:border-primary group-hover:ring-4 group-hover:ring-primary">
            <SliderTooltip>
              {parseAsDate
                ? toDate(data[minmax[0]], dateFormat[period], i18n.language)
                : data[minmax[0]]}
            </SliderTooltip>
          </Thumb>
        </div>
        <p className="w-fit pl-2 text-sm text-dim">
          {parseAsDate
            ? toDate(data[data.length - 1], "yyyy", i18n.language)
            : data[data.length - 1]}
        </p>
      </Root>
    ),
  }[type];
};

interface SliderTooltipProps {
  children: ReactNode;
}

const SliderTooltip: FunctionComponent<SliderTooltipProps> = ({ children }) => {
  return (
    <div className="relative inline-block w-fit overflow-visible">
      <div className="invisible absolute -top-14 left-2 z-20 inline-block w-max max-w-[200px] -translate-x-1/2 transform rounded bg-black py-1 px-1.5 text-sm font-normal text-white transition-all before:absolute before:left-[38%] before:top-[26px] before:h-0 before:w-0 before:border-8 before:border-transparent before:border-t-black group-focus-within:visible group-hover:visible dark:bg-white dark:text-black dark:before:border-t-white">
        {children}
      </div>
    </div>
  );
};

const dummy = [1658620800000, 1658707200000, 1659484800000, 1659571200000];

export default Slider;
