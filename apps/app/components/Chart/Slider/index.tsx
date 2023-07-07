import { FunctionComponent, ReactNode, useContext, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { useWatch } from "@hooks/useWatch";
import { clx, toDate } from "@lib/helpers";
import { Root, Track, Range, Thumb } from "@radix-ui/react-slider";
import { SliderContext } from "./context";

type BaseProps = {
  className?: string;
  data?: Array<number | string>;
  parseAsDate?: boolean;
  period?: "year" | "month" | "day" | "auto" | "quarter";
};

type RangeProps = BaseProps & {
  type: "range";
  onChange: (minmax: number[]) => void;
  value: number[];
  step?: never;
  enablePlayer?: boolean;
};
type SingleProps = BaseProps & {
  type: "single";
  onChange: (value: number) => void;
  value: number;
  step?: number;
  enablePlayer?: never;
};

type SliderProps = RangeProps | SingleProps;

const Slider: FunctionComponent<SliderProps> = ({
  className = "pt-8",
  type,
  onChange,
  step,
  value,
  data = dummy,
  period = "auto",
  parseAsDate = true,
  enablePlayer = true,
}) => {
  const { i18n } = useTranslation();
  const { play, setPlaying } = useContext(SliderContext);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [minmax, setMinmax] = useState(value);

  const dateFormat = {
    auto: "dd MMM yyyy",
    day: "dd MMM yyyy",
    month: "MMM yyyy",
    quarter: "qQ yyyy",
    year: "yyyy",
  };

  useWatch(() => {
    if (type === "single") return;
    if (timer.current) cancelTimer();
  }, [data]);

  useWatch(() => {
    if (type === "single") return;
    setMinmax(value);
  }, [value]);

  if (type === "single")
    return (
      <div className={clx("group flex w-full items-center gap-x-3", className)}>
        <p className="text-dim text-sm">
          {parseAsDate ? toDate(data[0], "yyyy", i18n.language) : data[0]}
        </p>
        <Root
          className="group relative flex h-5 w-full touch-none select-none items-center"
          value={[minmax as number]}
          max={data.length - 1}
          step={step}
          onValueChange={e => setMinmax(e)}
          onValueCommit={(e: number[] & number) => onChange(e)}
        >
          <Track className="dark:bg-washed-dark bg-outline relative z-0 h-2 grow rounded-full">
            <Range className="max-lg:group-focus-within:bg-primary dark:max-lg:group-focus-within:bg-primary-dark group-hover:bg-primary  dark:group-hover:bg-primary absolute z-0 h-full rounded-xl bg-[#A1A1AA]" />
          </Track>
          <Thumb className="max-lg:group-focus-within:border-primary max-lg:group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary shadow-button block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white group-hover:ring-4 max-lg:group-focus-within:ring-4">
            <SliderTooltip>
              {parseAsDate
                ? toDate(data[minmax as number], dateFormat[period], i18n.language)
                : data[minmax as number]}
            </SliderTooltip>
          </Thumb>
        </Root>
        <p className="text-dim text-sm">
          {parseAsDate
            ? toDate(data[data.length - 1], "yyyy", i18n.language)
            : data[data.length - 1]}
        </p>
      </div>
    );

  const startTimer = () => {
    setPlaying(true);
    let init = value[1] >= data.length - 1 ? value[0] : value[1];
    timer.current = setInterval(() => {
      if (init >= data.length - 1) cancelTimer();
      else onChange([value[0], ++init]);
    }, 150);
  };

  const cancelTimer = () => {
    setPlaying(false);
    timer.current && clearInterval(timer.current);
    timer.current = null;
  };

  const togglePlayPause = () => {
    if (timer.current) cancelTimer();
    else startTimer();
  };

  return (
    <div className={clx("group flex w-full items-center gap-x-3", className)}>
      {enablePlayer && (
        <button
          type="button"
          aria-label="Play"
          title="Play"
          className="w-fit"
          onClick={togglePlayPause}
        >
          {play ? (
            <PauseIcon className="h-4 w-4 text-black dark:text-white" />
          ) : (
            <PlayIcon className="h-4 w-4 text-black dark:text-white" />
          )}
        </button>
      )}
      <p className="text-dim text-sm">
        {parseAsDate ? toDate(data[0], "yyyy", i18n.language) : data[0]}
      </p>
      <Root
        className="group relative flex h-5 w-full touch-none select-none items-center"
        value={minmax as number[]}
        min={0}
        max={data.length - 1}
        onValueChange={e => {
          if (timer.current) cancelTimer();
          setMinmax(e);
        }}
        onValueCommit={e => {
          if (timer.current) cancelTimer();
          onChange(e);
        }}
        minStepsBetweenThumbs={1}
      >
        <Track className="dark:bg-washed-dark bg-outline relative z-0 h-2 grow rounded-full">
          <Range className="max-lg:group-focus-within:bg-primary dark:max-lg:group-focus-within:bg-primary-dark group-hover:bg-primary dark:group-hover:bg-primary absolute z-0 h-full rounded-xl bg-[#A1A1AA]" />
        </Track>
        <Thumb className="max-lg:group-focus-within:border-primary max-lg:group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary shadow-button block h-5 w-5 cursor-col-resize rounded-full border-2 border-[#A1A1AA] bg-white group-hover:ring-4 max-lg:group-focus-within:ring-4">
          <SliderTooltip play={play}>
            {parseAsDate
              ? toDate(data[(minmax as number[])[0]], dateFormat[period], i18n.language)
              : data[(minmax as number[])[0]]}
          </SliderTooltip>
        </Thumb>
        <Thumb className="max-lg:group-focus-within:border-primary max-lg:group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary shadow-button block h-5 w-5 cursor-col-resize rounded-full border-2 border-[#A1A1AA] bg-white group-hover:ring-4 max-lg:group-focus-within:ring-4">
          <SliderTooltip play={play}>
            {parseAsDate
              ? toDate(
                  data[Math.min((minmax as number[])[1], data.length - 1)],
                  dateFormat[period],
                  i18n.language
                )
              : data[(minmax as number[])[1]]}
          </SliderTooltip>
        </Thumb>
      </Root>
      <p className="text-dim text-sm">
        {parseAsDate ? toDate(data[data.length - 1], "yyyy", i18n.language) : data[data.length - 1]}
      </p>
    </div>
  );
};

interface SliderTooltipProps {
  play?: boolean;
  children: ReactNode;
}

const SliderTooltip: FunctionComponent<SliderTooltipProps> = ({ play, children }) => {
  return (
    <div className="relative inline-block overflow-visible">
      <div
        className={clx(
          "absolute -top-14 left-3 z-20 inline-block w-max max-w-[200px] -translate-x-1/2 -translate-y-1 transform rounded-md bg-black px-1.5 py-1 text-sm text-white opacity-0 transition-all delay-300 duration-300 ease-in-out before:absolute before:left-[38%] before:top-[26px] before:h-0 before:w-0 before:border-8 before:border-transparent before:border-t-black group-hover:opacity-100 group-hover:delay-0 dark:bg-white dark:text-black dark:before:border-t-white max-lg:group-focus-within:opacity-100",
          play ? "opacity-100" : "opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const dummy = [1658620800000, 1658707200000, 1659484800000, 1659571200000];

export default Slider;
