import { FunctionComponent, ReactNode, useContext, useRef, useState } from "react";
import { clx, toDate } from "@lib/helpers";
import { Root, Track, Range, Thumb } from "@radix-ui/react-slider";
import { useTranslation } from "@hooks/useTranslation";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useWatch } from "@hooks/useWatch";
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
  className = "pt-10",
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
    onChange([0, data.length - 1]);
  }, [data]);

  useWatch(() => {
    if (type === "single") return;
    setMinmax(value);
  }, [value]);

  if (type === "single")
    return (
      <Root
        className="group relative flex h-5 w-auto touch-none select-none items-center pt-10"
        defaultValue={[value]}
        max={data.length - 1}
        step={step}
        onValueCommit={(e: number[] & number) => onChange(e)}
      >
        <p className="text-dim w-fit pr-2 text-sm">
          {parseAsDate ? toDate(data[0], "yyyy", i18n.language) : data[0]}
        </p>
        <div className="group relative flex h-5 grow touch-none select-none items-center">
          <Track className="dark:bg-washed-dark relative z-0 h-2 grow rounded-full bg-[#E2E8F0] px-3">
            <Range className="group-focus-within:bg-primary group-hover:bg-primary dark:group-focus-within:bg-primary dark:group-hover:bg-primary absolute z-0 h-full rounded-xl bg-[#A1A1AA]" />
          </Track>
          <Thumb className="group-focus-within:border-primary group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary mx-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:ring-4 group-hover:ring-4">
            <SliderTooltip>
              {parseAsDate ? toDate(data[value], dateFormat[period], i18n.language) : data[value]}
            </SliderTooltip>
          </Thumb>
        </div>
        <p className="text-dim w-fit pl-2 text-sm">
          {parseAsDate
            ? toDate(data[data.length - 1], "yyyy", i18n.language)
            : data[data.length - 1]}
        </p>
      </Root>
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
    <div className={clx("flex w-full items-center", className)}>
      {enablePlayer && (
        <button
          type="button"
          aria-label="Play"
          title="Play"
          className="w-fit px-2"
          onClick={togglePlayPause}
        >
          {play ? (
            <PauseIcon className="h-4 w-4 text-black dark:text-white" />
          ) : (
            <PlayIcon className="h-4 w-4 text-black dark:text-white" />
          )}
        </button>
      )}

      <Root
        className="group relative flex h-5 w-full touch-none select-none items-center "
        value={minmax as number[]}
        min={0}
        max={data.length - 1}
        onValueChange={e => {
          if (timer.current) cancelTimer();
          onChange(e);
          setMinmax(e);
        }}
        onValueCommit={e => {
          if (timer.current) cancelTimer();
          onChange(e);
        }}
        minStepsBetweenThumbs={1}
      >
        <p className="text-dim w-fit text-sm">
          {parseAsDate ? toDate(data[0], "yyyy", i18n.language) : data[0]}
        </p>
        <div className="group relative flex h-5 grow touch-none select-none items-center">
          <Track className="dark:bg-washed-dark relative z-0 mx-3 h-2 grow rounded-full bg-[#E2E8F0]">
            <Range className="group-focus-within:bg-primary group-hover:bg-primary dark:group-focus-within:bg-primary dark:group-hover:bg-primary absolute z-0 h-full rounded-xl bg-[#A1A1AA]" />
          </Track>
          <Thumb className="group-focus-within:border-primary group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary ml-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:ring-4 group-hover:ring-4">
            <SliderTooltip play={play}>
              {parseAsDate
                ? toDate(data[value[0]], dateFormat[period], i18n.language)
                : data[value[0]]}
            </SliderTooltip>
          </Thumb>
          <Thumb className="group-focus-within:border-primary group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary mr-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:ring-4 group-hover:ring-4">
            <SliderTooltip play={play}>
              {parseAsDate
                ? toDate(data[value[1]], dateFormat[period], i18n.language)
                : data[value[1]]}
            </SliderTooltip>
          </Thumb>
        </div>
        <p className="text-dim w-fit text-sm">
          {parseAsDate
            ? toDate(data[data.length - 1], "yyyy", i18n.language)
            : data[data.length - 1]}
        </p>
      </Root>
    </div>
  );
};

interface SliderTooltipProps {
  play?: boolean;
  children: ReactNode;
}

const SliderTooltip: FunctionComponent<SliderTooltipProps> = ({ play, children }) => {
  return (
    <div className="relative inline-block w-fit overflow-visible">
      <div
        className={clx(
          "absolute -top-14 left-3 z-20 inline-block w-max max-w-[200px] -translate-x-1/2 transform rounded bg-black px-1.5 py-1 text-sm font-normal text-white transition-all before:absolute before:left-[38%] before:top-[26px] before:h-0 before:w-0 before:border-8 before:border-transparent before:border-t-black group-focus-within:visible group-hover:visible dark:bg-white dark:text-black dark:before:border-t-white",
          !play && "invisible"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const dummy = [1658620800000, 1658707200000, 1659484800000, 1659571200000];

export default Slider;
