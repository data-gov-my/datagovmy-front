import {
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
  ForwardRefExoticComponent,
  useEffect,
} from "react";
import { minMax, toDate } from "@lib/helpers";
import { useRouter } from "next/router";
import { useWatch } from "@hooks/useWatch";

// interface SliderProps {
//   className?: string;
//   type?: "single" | "range";
//   onChange?: ([min, max]: [number, number]) => void;
//   value?: [number, number]; // default minmax. on-init only
//   range?: [number, number]; // linear minmax. for sliders that don't have `data[]`
//   step?: number;
//   data?: Array<number>;
//   parseAsDate?: boolean;
//   ref?: ForwardedRef<SliderRef>;
//   period?: "year" | "month" | "auto" | "quarter";
//   //   displayFormatter?: (dateString: string) => string;
// }

type RangeProps = {
  type: "range";
  onChange: ([min, max]: [number, number]) => void;
  value: [number, number]; // default minmax. on-init only
};
type SingleProps = {
  type: "single";
  onChange: (value: number) => void;
  value: number; // default minmax. on-init only
};

type SliderProps = (RangeProps | SingleProps) & {
  className?: string;
  //   range?: [number, number]; // linear minmax. for sliders that don't have `data[]`
  step?: number;
  data?: Array<number>;
  parseAsDate?: boolean;
  ref?: ForwardedRef<SliderRef>;
  period?: "year" | "month" | "auto" | "quarter";
};

export interface SliderRef {
  reset: () => void;
}

const Slider: ForwardRefExoticComponent<SliderProps> = forwardRef(
  (
    {
      className = "w-full",
      type,
      onChange,
      value,
      step = 1,
      data = dummy,
      parseAsDate = true,
      period = "auto",
      //   displayFormatter = (dateString: string) => dateString,
    },
    ref
  ) => {
    const lang = useRouter().locale;
    const [min, setMin] = useState<number>(type === "range" ? value[0] : value);
    const [max, setMax] = useState<number>(type === "range" ? value[1] : value);

    useImperativeHandle(ref, () => {
      return {
        reset: () => {
          setMin(0);
          setMax(data.length - 1);
          // onChange && onChange([min,max]);
        },
      };
    });

    useWatch(() => {
      if (type === "range") {
        setMin(value[0]);
        setMax(value[1]);
      } else {
        setMin(value);
      }
    }, [value]);

    const dateFormat = {
      auto: "dd MMM yyyy",
      month: "MMM yyyy",
      quarter: "qQ yyyy",
      year: "yyyy",
    };

    const onRange = (event: any, thumb?: "left" | "right") => {
      const _value = Number(event.target.value);

      if (thumb && thumb === "right") {
        setMax(_value);
        return;
      }

      setMin(_value);
    };

    const position = (() => {
      // TODO: refactor this later
      if (data) {
        const maxIndex = data.length - 1;
        if (type === "range")
          return {
            active: {
              left: `${(minMax(min, maxIndex) / maxIndex) * 100}%`,
              right: `${((maxIndex - minMax(max, maxIndex)) / maxIndex) * 100}%`,
            },
            thumb: {
              left: `${(minMax(min, maxIndex) / maxIndex) * 99}%`,
              right: `${((maxIndex - minMax(max, maxIndex)) / maxIndex) * 99}%`,
            },
          };
        if (type === "single")
          return {
            active: {
              left: "0%",
              right: `${100 - (Number(min) / maxIndex) * 100}%`,
            },
            thumb: {
              left: `${(Number(min) / maxIndex) * 99}%`,
            },
          };
      }
      //   else if (range) {
      //     const delta = range[1] - range[0];

      //     if (type === "range")
      //       return {
      //         active: {
      //           left: `${((Number(min) - range[0]) / delta) * 100}%`,
      //           right: `${((range[1] - Number(max)) / delta) * 100}%`,
      //         },
      //         thumb: {
      //           left: `${((Number(min) - range[0]) / delta) * 99}%`,
      //           right: `${((range[1] - Number(max)) / delta) * 99}%`,
      //         },
      //       };
      //     if (type === "single")
      //       return {
      //         active: {
      //           left: "0%",
      //           right: `${100 - ((Number(min) - range[0]) / delta) * 100}%`,
      //         },
      //         thumb: {
      //           left: `${((Number(min) - range[0]) / delta) * 99}%`,
      //         },
      //       };
      //   }
    })();

    return (
      <div className={className}>
        {
          {
            range: (
              <>
                <div className="relative w-full py-4">
                  <div className="relative h-2 w-full">
                    <div className="absolute top-0 left-0 h-2 w-full rounded-xl bg-[#E2E8F0]"></div>
                    {/* Active Range */}
                    <div
                      className="absolute top-0 left-0 right-0 h-2 rounded-xl bg-outlineHover"
                      style={{
                        left: position?.active.left,
                        right: position?.active.right,
                      }}
                    />

                    {/* Thumb Left */}
                    <span
                      className=" absolute left-0 -top-1 h-4 w-4 cursor-pointer rounded-full border bg-white shadow-xl"
                      style={{ left: position?.thumb.left }}
                    />

                    {/* Thumb Right */}
                    <span
                      className="absolute  -top-1 -ml-2 h-4 w-4 cursor-pointer rounded-full border bg-white shadow-xl"
                      style={{ right: position?.thumb.right }}
                    />

                    {/* Tip Left & Right */}
                    <div className="pointer-events-none absolute -top-8 flex w-full justify-between">
                      {data && (
                        <>
                          <span className="text-sm text-black">
                            {parseAsDate && min >= 0
                              ? toDate(data[min], dateFormat[period], lang)
                              : data[min]}
                          </span>
                          <span className="text-sm text-black">
                            {parseAsDate && max <= data.length - 1
                              ? toDate(data[max], dateFormat[period], lang)
                              : data[max]}
                          </span>
                        </>
                      )}
                    </div>

                    <input
                      className="pointer-events-none absolute -top-1 left-0 z-20 m-0 w-full"
                      type="range"
                      min={0}
                      max={data.length - 1}
                      value={min}
                      step={data ? 1 : step}
                      onChange={event => onRange(event, "left")}
                      onMouseUp={() => type === "range" && onChange([min, max])}
                      onTouchEnd={() => type === "range" && onChange([min, max])}
                    />

                    <input
                      className="pointer-events-none absolute -top-1 z-20 m-0 w-full"
                      type="range"
                      min={0}
                      max={data.length - 1}
                      value={max}
                      step={data ? 1 : step}
                      onChange={event => onRange(event, "right")}
                      onMouseUp={() => type === "range" && onChange([min, max])}
                      onTouchEnd={() => type === "range" && onChange([min, max])}
                    />
                  </div>
                </div>
              </>
            ),
            single: (
              <div className="relative mx-auto w-[90%] lg:w-[95%]">
                <div className="mx-auto h-2 w-full">
                  <div className="absolute top-0 left-0 h-2 w-full rounded-xl bg-[#E2E8F0]"></div>
                  {/* Active Range */}
                  <div
                    className="absolute top-0 left-0 right-0 h-2 rounded-xl bg-outlineHover"
                    style={{
                      left: position?.active.left,
                      right: position?.active.right,
                    }}
                  ></div>

                  {/* Thumb Left */}
                  <span
                    className=" absolute left-0 -top-1 h-4 w-4 cursor-pointer rounded-full border bg-white shadow-xl"
                    style={{ left: position?.thumb.left }}
                  ></span>

                  {/* Tip Left */}
                  <div
                    className="pointer-events-none absolute -top-8 w-fit whitespace-nowrap"
                    style={{ left: position?.thumb.left }}
                  >
                    <span className="-ml-8 text-sm">
                      {parseAsDate ? toDate(data[min], dateFormat[period], lang) : data[min]}
                    </span>
                  </div>
                </div>
                <input
                  className="pointer-events-none absolute -top-1 z-20 m-0 w-full"
                  type="range"
                  value={min}
                  min={0}
                  max={data.length - 1}
                  onChange={onRange}
                  onMouseUp={() => type === "single" && onChange(min)}
                  onTouchEnd={() => type === "single" && onChange(min)}
                  step={1}
                />
              </div>
            ),
          }[type as "single" | "range"]
        }
      </div>
    );
  }
);

const dummy = [1658620800000, 1658707200000, 1659484800000, 1659571200000];

export default Slider;
