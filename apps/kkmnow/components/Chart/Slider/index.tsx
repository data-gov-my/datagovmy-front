import { FunctionComponent, useState } from "react";
import { toDate } from "@lib/helpers";

interface SliderProps {
  className?: string;
  type?: "default" | "range";
  onChange?: ({ min, max }: { min: number; max: number }) => void;
  defaultValue?: [number, number]; // default minmax. on-init only
  range?: [number, number]; // linear minmax. for sliders that don't have `data[]`
  step?: number;
  data?: Array<any>;
  parseAsDate?: boolean;
}

const Slider: FunctionComponent<SliderProps> = ({
  className = "w-full",
  type = "default",
  onChange,
  defaultValue,
  range = [2008, 2022],
  step = 1,
  data = dummy,
  parseAsDate = true,
}) => {
  const [min, setMin] = useState(defaultValue ? defaultValue[0] : data ? 0 : range[0]);
  const [max, setMax] = useState(
    defaultValue ? defaultValue[1] : data ? data.length - 1 : range[1]
  );

  const onRange = (event: any, thumb?: "left" | "right") => {
    const value = Number(event.target.value);

    if (thumb === "left") {
      if (value < Number(max)) setMin(event.target.value);
    } else if (thumb === "right") {
      if (value > Number(min)) setMax(event.target.value);
    }
  };

  const position = (() => {
    // TODO: refactor this later
    if (data) {
      const maxIndex = data.length - 1;
      if (type === "range")
        return {
          active: {
            left: `${(Number(min) / maxIndex) * 100}%`,
            right: `${((maxIndex - Number(max)) / maxIndex) * 100}%`,
          },
          thumb: {
            left: `${(Number(min) / maxIndex) * 99}%`,
            right: `${((maxIndex - Number(max)) / maxIndex) * 99}%`,
          },
        };
      if (type === "default")
        return {
          active: {
            left: "0%",
            right: `${100 - (Number(min) / maxIndex) * 100}%`,
          },
          thumb: {
            left: `${(Number(min) / maxIndex) * 99}%`,
          },
        };
    } else if (range) {
      const delta = range[1] - range[0];

      if (type === "range")
        return {
          active: {
            left: `${((Number(min) - range[0]) / delta) * 100}%`,
            right: `${((range[1] - Number(max)) / delta) * 100}%`,
          },
          thumb: {
            left: `${((Number(min) - range[0]) / delta) * 99}%`,
            right: `${((range[1] - Number(max)) / delta) * 99}%`,
          },
        };
      if (type === "default")
        return {
          active: {
            left: "0%",
            right: `${100 - ((Number(min) - range[0]) / delta) * 100}%`,
          },
          thumb: {
            left: `${((Number(min) - range[0]) / delta) * 99}%`,
          },
        };
    }
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
                          {parseAsDate ? toDate(data[min]) : data[min]}
                        </span>
                        <span className="text-sm text-black">
                          {parseAsDate ? toDate(data[max]) : data[max]}
                        </span>
                      </>
                    )}
                  </div>

                  <input
                    className="pointer-events-none absolute -top-1 left-0 z-20 m-0 w-full"
                    type="range"
                    min={data ? 0 : range[0]}
                    max={data ? data.length - 1 : range[1]}
                    value={min}
                    step={data ? 1 : step}
                    onChange={event => onRange(event, "left")}
                    onMouseUp={() => onChange && onChange({ min: Number(min), max: Number(max) })}
                    onTouchEnd={() => onChange && onChange({ min: Number(min), max: Number(max) })}
                  />

                  <input
                    className="pointer-events-none absolute -top-1 z-20 m-0 w-full"
                    type="range"
                    min={data ? 0 : range[0]}
                    max={data ? data.length - 1 : range[1]}
                    value={max}
                    step={data ? 1 : step}
                    onChange={event => onRange(event, "right")}
                    onMouseUp={() => onChange && onChange({ min: Number(min), max: Number(max) })}
                    onTouchEnd={() => onChange && onChange({ min: Number(min), max: Number(max) })}
                  />
                </div>
              </div>
            </>
          ),
          default: (
            <div className="relative">
              <div className="h-2 w-full">
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
                  className="pointer-events-none absolute -top-8"
                  style={{ left: position?.thumb.left }}
                >
                  <span className="text-sm">{data ? data[min] : min}</span>
                </div>
              </div>
              <input
                className="pointer-events-none absolute -top-1 z-20 m-0 w-full"
                type="range"
                value={min}
                min={data ? 0 : range[0]}
                max={data ? data.length - 1 : range[1]}
                onChange={onRange}
                onMouseUp={onRange}
                step={data ? 1 : step}
              />
            </div>
          ),
        }[type]
      }
    </div>
  );
};

const dummy = [1658620800000, 1658707200000, 1659484800000, 1659571200000];

export default Slider;
