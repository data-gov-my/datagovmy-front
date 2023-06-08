import Slider from "@components/Chart/Slider";
import Chips from "@components/Chips";
import Dropdown from "@components/Dropdown";
import Select from "@components/Dropdown/Select";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";
import { SHORT_LANG } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import type { ChartDataset, ChartTypeRegistry } from "chart.js";
import groupBy from "lodash/groupBy";
import { useTranslation } from "@hooks/useTranslation";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Consumer Prices (CPI) - Inflation Trends Section
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const InflationTrends: FunctionComponent = ({}) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];

  const GRANULAR_OPTIONS: Array<OptionType> = [
    { label: t("consumer_prices.keys.broad_categories"), value: "2d" },
    { label: t("consumer_prices.keys.narrow_categories"), value: "4d" },
  ];

  const { data, setData } = useData({
    query_done: false,
    granular_type: GRANULAR_OPTIONS[0],
    inflation_data: {},
    inflation_x: [],
    inflation_ys: [],
    inflation_as_of: undefined,
    inflation_minmax: [0, 0],
  });

  const { coordinate } = useSlice(
    { ...data.inflation_data, x: data.inflation_x },
    data.inflation_minmax
  );

  useWatch(
    async () => {
      if (data.query_done) return;

      if (data.granular_type) {
        const result = await get("/chart", {
          dashboard: "consumer_price_index",
          chart_name: "timeseries_6d",
          lang,
          level: data.granular_type.value,
        });

        if (data.granular_type.value === "4d") setData("query_done", true);

        const { x: _, ...ys } = result.data.data;

        setData("inflation_x", result.data.data.x);
        setData("inflation_minmax", [0, result.data.data.x.length - 1]);
        setData("inflation_data", {
          ...data.inflation_data,
          ...Object.fromEntries(
            Object.entries(ys).map(([key, value]: [string, unknown]) => [
              key,
              (value as { y: number[] }).y,
            ])
          ),
        });
        setData(
          `inflation_options_${data.granular_type.value}`,
          Object.keys(ys).map(item => ({
            label: item.split(" > ").pop(),
            value: item,
          }))
        );
        setData("inflation_as_of", result.data.data_as_of);
      }
    },
    [data.granular_type],
    true
  );

  const activeInflation = useCallback<() => ChartDataset<keyof ChartTypeRegistry, any[]>[]>(() => {
    const INFLATION_COLOR = ["#470000", "#870001", "#F30607", "#FF4E4E", "#FF9091", "#FFC0C0"];
    const DEFLATION_COLOR = [
      "#001422",
      "#004475",
      "#0072C5",
      "#0072C5",
      "#5BC7F8",
      "#8ECBEA",
    ].reverse();

    let inflation_ctr = 0;
    let deflation_ctr = 0;

    return data.inflation_ys
      .sort((a: OptionType, b: OptionType) => {
        const [a_start, a_last] = [
          coordinate[a.value][0],
          coordinate[a.value][coordinate[a.value].length - 1],
        ];
        const [b_start, b_last] = [
          coordinate[b.value][0],
          coordinate[b.value][coordinate[b.value].length - 1],
        ];

        return b_last / b_start - 1 - (a_last / a_start - 1);
      })
      .map((item: OptionType) => {
        const _data = coordinate[item.value].map(
          (value: number) => (value / coordinate[item.value][0] - 1) * 100
        );

        const borderColor =
          _data[_data.length - 1] > 0
            ? INFLATION_COLOR[inflation_ctr++]
            : DEFLATION_COLOR[deflation_ctr++];

        return {
          type: "line",
          label: item.label,
          data: _data,
          borderWidth: 1.5,
          borderColor,
        };
      });
  }, [data.inflation_ys, data.inflation_minmax]);

  const handleAddInflation = (option: OptionType) => {
    if (data.inflation_ys.some((y: OptionType) => option.value === y.value)) {
      setData(
        "inflation_ys",
        data.inflation_ys.filter((y: OptionType) => y.value !== option.value)
      );
      return;
    }

    setData("inflation_ys", data.inflation_ys.concat(option));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
          <Dropdown
            anchor="left"
            sublabel={t("consumer_prices.section_3.select_granularity") + ":"}
            selected={data.granular_type}
            options={GRANULAR_OPTIONS}
            onChange={e => setData("granular_type", e)}
          />

          <Select
            anchor="left"
            sublabel={t("consumer_prices.section_3.select_items") + ":"}
            disabled={data.inflation_ys.length >= 6}
            placeholder={t("consumer_prices.section_3.select_upto6")}
            multiple
            selected={data.inflation_ys}
            options={
              {
                "2d": data.inflation_options_2d,
                "4d": groupBy(data.inflation_options_4d, item => {
                  return item.value.split(" > ")[0];
                }),
              }[data.granular_type.value as "2d" | "4d"]
            }
            onChange={e => handleAddInflation(e)}
          />
        </div>
        <Chips
          data={data.inflation_ys}
          className="justify-start lg:justify-end"
          onClearAll={() => setData("inflation_ys", [])}
          onRemove={e =>
            setData(
              "inflation_ys",
              data.inflation_ys.filter((item: OptionType) => e !== item.value)
            )
          }
        />
      </div>

      <Timeseries
        className="h-[500px] w-full"
        interval="month"
        tooltipFormat="MMM yyyy"
        mode="grouped"
        unitY="%"
        displayNumFormat={value =>
          numFormat(value, "compact", [1, 1], "short", i18n.language, true)
        }
        enableCallout
        data={{
          labels: coordinate.x,
          datasets: activeInflation(),
        }}
      />

      <Slider
        className="pt-7"
        type="range"
        value={data.inflation_minmax}
        data={data.inflation_x}
        period="month"
        onChange={e => setData("inflation_minmax", e)}
      />
    </div>
  );
};

export default InflationTrends;
