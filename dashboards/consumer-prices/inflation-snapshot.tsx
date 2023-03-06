import Slider from "@components/Chart/Slider";
import Chips from "@components/Chips";
import Dropdown from "@components/Dropdown";
import Select from "@components/Dropdown/Select";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";
import { SHORT_LANG } from "@lib/constants";
import type { ChartDataset } from "chart.js";
import { useTranslation } from "@hooks/useTranslation";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Consumer Prices (CPI) - Inflation Snapshot Section
 * @overview Status: Live
 */

const Scatter = dynamic(() => import("@components/Chart/Scatter"), { ssr: false });

const InflationSnapshot: FunctionComponent = ({}) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];
  const HIGHLIGHT_COLOR = ["#DC2626", "#2563EB", "#FBBF24"];

  const AXES_OPTIONS: Array<OptionType> = Array(5)
    .fill(0)
    .map((_, index: number) => ({
      label: t(`consumer_prices.keys.y${index + 1}`),
      value: `y${index + 1}`,
    }));

  const GRANULAR_OPTIONS: Array<OptionType> = [
    { label: t("consumer_prices.keys.broad_categories"), value: "2d" },
    { label: t("consumer_prices.keys.narrow_categories"), value: "4d" },
  ];

  const { data, setData } = useData({
    query_done: false,
    granular_type: GRANULAR_OPTIONS[0],
    x_axis: AXES_OPTIONS[2], // YoY growth 5yrs-avg
    y_axis: AXES_OPTIONS[1], // YoY growth latest
    snapshot_data: {},
    snapshot_index: 0,
    snapshot_x: undefined,
    snapshot_ys: [],
    snapshot_as_of: undefined,
    snapshot_minmax: [0, Infinity],
  });

  useWatch(
    async () => {
      if (data.query_done) return;

      if (data.granular_type) {
        const result = await get("/chart", {
          dashboard: "consumer_price_index",
          chart_name: "snapshot_4d",
          lang,
          level: data.granular_type.value,
        });

        if (data.granular_type.value === "4d") setData("query_done", true);

        const { x: _, ...ys } = result.data.data;

        setData("snapshot_x", result.data.data.x);
        setData("snapshot_index", result.data.data.x.length - 1);
        setData("snapshot_data", { ...data.snapshot_data, ...ys });
        setData(
          `snapshot_options_${data.granular_type.value}`,
          Object.keys(ys).map(item => ({
            label: item.split(" > ").pop(),
            value: item,
          }))
        );
        setData("snapshot_as_of", result.data.data_as_of);
      }
    },
    [data.granular_type],
    true
  );

  const activeSnapshot = useCallback<() => ChartDataset<"scatter", any[]>[]>(() => {
    if (!data.granular_type) return [];

    return (data[`snapshot_options_${data.granular_type.value}`] ?? []).map(
      ({ label, value }: OptionType) => {
        const highlight_index = data.snapshot_ys
          .map((item: OptionType) => item.value)
          .indexOf(value.split(" > ")[0]);
        return {
          label: label,
          data: [
            {
              x: data.snapshot_data[value][data.x_axis.value][data.snapshot_index],
              y: data.snapshot_data[value][data.y_axis.value][data.snapshot_index],
            },
          ],
          backgroundColor: HIGHLIGHT_COLOR[highlight_index] ?? "#D9D9D9",
          radius: 6,
          hoverRadius: 8,
          order: highlight_index !== -1 ? highlight_index : 5,
        };
      }
    );
  }, [
    data.snapshot_data,
    data.snapshot_ys,
    data.x_axis,
    data.y_axis,
    data.granular_type,
    data.snapshot_index,
  ]);

  const handleAddSnapshot = (option: OptionType) => {
    if (data.snapshot_ys.some((y: OptionType) => option.value === y.value)) {
      setData(
        "snapshot_ys",
        data.snapshot_ys.filter((y: OptionType) => y.value !== option.value)
      );
      return;
    }

    setData("snapshot_ys", data.snapshot_ys.concat(option));
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
        <Dropdown
          anchor="left"
          sublabel={t("consumer_prices.section_4.select_axis", { axis: "X" }) + ":"}
          selected={data.x_axis}
          options={AXES_OPTIONS}
          onChange={e => setData("x_axis", e)}
        />
        <Dropdown
          anchor="right-0 lg:left-0"
          sublabel={t("consumer_prices.section_4.select_axis", { axis: "Y" }) + ":"}
          selected={data.y_axis}
          options={AXES_OPTIONS}
          onChange={e => setData("y_axis", e)}
        />
      </div>
      <div className="flex flex-col justify-between gap-2 lg:flex-wrap">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:gap-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
            <Dropdown
              anchor="left"
              sublabel={t("consumer_prices.section_4.select_granularity") + ":"}
              selected={data.granular_type}
              options={GRANULAR_OPTIONS}
              onChange={e => setData("granular_type", e)}
            />

            <Select
              anchor="left"
              sublabel={t("consumer_prices.section_4.select_highlight") + ":"}
              disabled={data.snapshot_ys.length >= 3}
              placeholder={t("consumer_prices.section_4.select_upto3")}
              selected={data.snapshot_ys}
              multiple
              options={data.snapshot_options_2d}
              onChange={e => handleAddSnapshot(e)}
            />
          </div>
          <Chips
            data={data.snapshot_ys}
            className="justify-start lg:justify-end"
            onClearAll={() => setData("snapshot_ys", [])}
            colors={HIGHLIGHT_COLOR}
            onRemove={e =>
              setData(
                "snapshot_ys",
                data.snapshot_ys.filter((item: OptionType) => e !== item.value)
              )
            }
          />
        </div>
      </div>
      <Scatter
        className="mx-auto aspect-square w-full lg:w-3/4 xl:w-1/2"
        data={{ datasets: activeSnapshot() }}
        unitY="%"
        titleX={data.x_axis.label}
        titleY={data.y_axis.label}
      />
      <Slider
        className="pt-7"
        type="single"
        value={data.snapshot_index}
        data={data.snapshot_x}
        period="month"
        parseAsDate
        onChange={e => setData("snapshot_index", e)}
      />
    </div>
  );
};

export default InflationSnapshot;
