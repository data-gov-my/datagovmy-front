import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ChartDataset } from "chart.js";
import { get } from "datagovmy-ui/api";
import {
  Button,
  MultipleComboBox,
  List,
  Section,
  Slider,
  toast,
  Radio,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { clx, numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import debounce from "lodash/debounce";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useMemo } from "react";

/**
 * Car Popularity Dashboard - Compare
 * @overview Status: Live
 */

export type Car = {
  maker: string;
  model?: string;
  colour: string;
};

interface Cars extends Car {
  cars: number[];
  cars_cumul: number[];
}

type Lead = {
  car: string;
  lead: number;
};

interface CarPopularityProps {
  cars: Array<OptionType & Car>;
  data_as_of: string;
  timeseries: any;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const CarPopularityCompare: FunctionComponent<CarPopularityProps> = ({
  cars,
  data_as_of,
  timeseries,
}) => {
  const { t, i18n } = useTranslation("dashboard-car-popularity");
  const { resolvedTheme } = useTheme();

  const COLOURS = [
    AKSARA_COLOR.PRIMARY,
    AKSARA_COLOR.DANGER,
    resolvedTheme === "dark" ? "#94A3B8" : AKSARA_COLOR.DIM,
  ];

  const RADIO_OPTIONS: OptionType[] = ["makers", "models"].map(key => ({
    label: t(key),
    value: key,
  }));

  const DEFAULT_CARS = cars.map((car, i) => ({ ...car, colour: COLOURS[i] }));

  const order: Record<string, number> = {},
    sortOrder = cars.map(({ label }) => label);
  for (let i = 0; i < sortOrder.length; i++) order[sortOrder[i]] = i;

  const { data, setData } = useData({
    type: RADIO_OPTIONS[1].value,
    query: "",
    options: [],
    optionsLoading: false,
    selected_makers: [],
    selected_models: DEFAULT_CARS,
    period: 0,

    // timeseries data
    loading: false,
    x: Object.entries(timeseries).filter(([key, _]) => key === "x"),
    cars: (Object.entries(timeseries).filter(([key, _]) => key !== "x") as [string, Cars][])
      .sort(([a, _a], [b, _b]) => order[a] - order[b])
      .map(([car, cars], i) => [car, { ...cars, colour: COLOURS[i] }]),
    minmax: [0, timeseries.x.length - 1],
  });

  const CAR_OPTIONS = useMemo<Array<OptionType & Omit<Car, "colour">>>(() => {
    return (data.options as Car[]).map(({ maker, model }) => ({
      label: model !== undefined ? `${maker} ${model}` : maker,
      value:
        model !== undefined ? `${maker.toLowerCase()}-${model.toLowerCase()}` : maker.toLowerCase(),
      maker,
      model: model !== undefined ? model : undefined,
    }));
  }, [data.options]);

  const search = useCallback(
    debounce((query: string) => {
      get("explorer?explorer=car_popularity" + query)
        .then(({ data }) => setData("options", data))
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        })
        .finally(() => setData("optionsLoading", false));
    }, 300),
    []
  );

  const selected_type: string = `selected_${data.type === "makers" ? "makers" : "models"}`;
  const selected: Array<OptionType & Car> = data[selected_type];

  const COLOUR_OPTIONS = useMemo<string[]>(() => {
    const selected_colours = selected.map(({ colour }) => colour);
    return COLOURS.filter(col => !selected_colours.includes(col));
  }, [selected]);

  const compare = (makers: string[], models?: string[]) => {
    setData("loading", true);

    get(
      "explorer/?explorer=car_popularity&maker_id=" +
        makers.join("&maker_id=") +
        (models && models.length > 0 && !models.some(e => e === undefined)
          ? `&model_id=${models.join("&model_id=")}`
          : "")
    )
      .then(({ data }) => {
        setData(
          "x",
          Object.entries(data.timeseries).filter(([key, _]) => key === "x")
        );
        const order: Record<string, number> = {},
          sortOrder = selected.map(({ label }) => label);
        for (let i = 0; i < sortOrder.length; i++) order[sortOrder[i]] = i;
        setData(
          "cars",
          (Object.entries(data.timeseries).filter(([key, _]) => key !== "x") as [string, Car][])
            .sort(([a, _a], [b, _b]) => order[a] - order[b])
            .map(([car, cars], i) => [car, { ...cars, colour: selected[i].colour }])
        );
      })
      .catch(e => {
        toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
        console.error(e);
      })
      .finally(() => setData("loading", false));
  };

  const LATEST_TIMESTAMP = timeseries.x[timeseries.x.length - 1];
  const month = new Date(LATEST_TIMESTAMP).getMonth() + 1;

  const CARS = data.cars as [string, Cars][];

  const past_5yrs = useMemo<number>(() => {
    return CARS.length === 1 ? CARS[0][1].cars.slice(-(60 + month)).reduce((a, b) => a + b) : 0;
  }, [CARS]);

  const leader = useCallback<(months: number) => Lead>(
    (months: number) => {
      if (CARS.length < 2) return { car: "", lead: -1 };
      const past_mths: Lead[] = CARS.map(([car, { cars }]) => ({
        car,
        lead: cars.slice(-months).reduce((a, b) => a + b),
      }));

      const sorted = past_mths.sort((a, b) => b.lead - a.lead);

      if (sorted[0].lead === 0) return { car: "-", lead: -1 };
      if (sorted[1].lead === 0) return { car: sorted[0].car, lead: Infinity };

      const diff = (sorted[0].lead / sorted[1].lead) * 100 - 100;
      return { car: sorted[0].car, lead: diff };
    },
    [CARS]
  );

  const { coordinate } = useSlice(
    Object.fromEntries(
      CARS.map(([car, { cars, cars_cumul }]) => [
        car,
        data.period === 0 ? cars : cars_cumul,
      ]).concat(data.x)
    ),
    data.minmax
  );

  const datasets = useMemo<ChartDataset<"line">[]>(() => {
    return CARS.map(([car, { colour }]) => {
      return {
        type: "line",
        data: coordinate[car],
        label: car,
        fill: CARS.length === 1,
        backgroundColor: (colour ?? AKSARA_COLOR.DIM).concat("1A"),
        borderColor: colour ?? AKSARA_COLOR.DIM,
        borderWidth: 1.5,
      };
    });
  }, [CARS, data.minmax, data.period, data.type]);

  return (
    <>
      {/* How popular is your car? Compare it against others!*/}
      <Section
        title={<h4 className="mx-auto text-center">{t("section_title")}</h4>}
        className="mx-auto py-8 lg:py-12 xl:w-4/5"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="border-outline dark:border-washed-dark bg-background dark:bg-background-dark shadow-button flex h-fit flex-col gap-6 rounded-xl border p-6 lg:col-span-1">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">{t("compare_cars")}</label>
              <Radio
                name="type"
                className="inline-flex gap-3"
                options={RADIO_OPTIONS}
                value={data.type ? RADIO_OPTIONS.find(e => e.value === data.type) : undefined}
                onChange={e => {
                  setData("type", e.value);
                }}
              />
              <MultipleComboBox<Omit<Car, "colour">>
                className="rounded-md"
                width="w-full"
                placeholder={t(
                  selected.length < 3
                    ? data.type === "makers"
                      ? "search_maker"
                      : "search_model"
                    : "max_reached"
                )}
                disabled={selected.length >= 3}
                options={CAR_OPTIONS}
                inputValue={data.query}
                setInputValue={query => setData("query", query)}
                selectedItems={selected}
                setSelectedItems={selected => setData(selected_type, selected)}
                onSearch={query => {
                  setData("query", query);
                  if (query.length === 0) return;
                  setData("optionsLoading", true);
                  search(`&${data.type === "makers" ? "maker" : "model"}=${query}`);
                }}
                onChange={selected => {
                  const last = selected.slice(-1)[0];
                  if (selected.length <= 3)
                    setData(selected_type, [
                      ...selected.slice(0, -1),
                      { ...last, colour: COLOUR_OPTIONS[0] },
                    ]);
                }}
                loading={data.optionsLoading}
              />

              {selected.length > 0 && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    {selected.map((selected_car, i) => (
                      <Button
                        variant="reset"
                        onClick={() =>
                          setData(
                            selected_type,
                            selected.filter(({ label }) => label !== selected_car.label)
                          )
                        }
                        className="shadow-button border-outline dark:border-washed-dark hover:border-outlineHover hover:dark:border-outlineHover-dark group inline-flex w-fit items-center gap-2 rounded-full border bg-white px-2.5 py-1 dark:bg-black"
                      >
                        <svg
                          className="h-1 w-4 shrink-0"
                          viewBox="0 0 8 2"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="0" width="8" height="2" rx="1" fill={selected_car.colour} />
                        </svg>
                        <span className="line-clamp-1 text-start text-sm">
                          {selected_car.label}
                        </span>
                        <XMarkIcon className="text-dim size-4.5 -mx-1 shrink-0 group-hover:text-black dark:group-hover:text-white" />
                      </Button>
                    ))}
                  </div>
                  {selected.length > 1 && (
                    <Button
                      variant="ghost"
                      className="group w-fit"
                      onClick={() => {
                        setData(selected_type, []);
                      }}
                    >
                      <XMarkIcon className="text-dim size-5 group-hover:text-black dark:group-hover:text-white" />
                      {t("common:common.clear_all")}
                    </Button>
                  )}
                </>
              )}
            </div>
            <Button
              variant="primary"
              className="w-fit"
              onClick={() =>
                compare(
                  selected.map(e => e.maker),
                  selected.map(e => e.model!)
                )
              }
            >
              {t("compare_now")}
            </Button>

            <p className="text-dim text-xs">{t("disclaimer")}</p>
          </div>

          {/* Registrations with JPJ since 2000 */}
          <SliderProvider>
            {play => (
              <div className="relative lg:col-span-2">
                <Timeseries
                  title={t("timeseries_title")}
                  className={clx(
                    "h-[300px] w-full",
                    CARS.length === 0 && "absolute top-14 opacity-30"
                  )}
                  enableAnimation={!play}
                  menu={
                    <span className="text-dim text-right text-sm">
                      {t("common:common.data_of", {
                        date: toDate(data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  }
                  isLoading={data.loading}
                  precision={0}
                  interval="month"
                  mode="grouped"
                  enableCallout={CARS.length > 0}
                  data={{
                    labels: coordinate.x,
                    datasets,
                  }}
                  displayNumFormat={(value, type) => numFormat(value, type, value > 1e6 ? 1 : 0)}
                  tooltipCallback={({ dataset, parsed }) =>
                    `${dataset.label}: ${numFormat(parsed.y, "standard")}`
                  }
                  subheader={
                    CARS.length < 1 ? (
                      <></>
                    ) : (
                      <div className="flex w-full flex-col gap-x-6 gap-y-3 md:flex-row md:flex-nowrap md:items-start md:justify-between">
                        {CARS.length === 1 ? (
                          <div className="flex flex-wrap gap-x-6 gap-y-3 lg:gap-x-8">
                            {[
                              {
                                title: t("common:common.latest", {
                                  date: toDate(LATEST_TIMESTAMP, "MMM yyyy"),
                                }),
                                value: "+" + numFormat(CARS[0][1].cars.at(-1)!, "standard"),
                              },
                              {
                                title: t("since", {
                                  year: new Date(LATEST_TIMESTAMP).getFullYear() - 5,
                                }),
                                value: numFormat(past_5yrs, "standard"),
                              },
                              {
                                title: t("since_2000"),
                                value: numFormat(CARS[0][1].cars_cumul.at(-1)!, "standard"),
                              },
                            ].map(({ title, value }) => (
                              <div key={title}>
                                <p className="text-dim text-sm">{title}</p>
                                <span className="text-lg font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-x-6 gap-y-3 md:flex-row lg:gap-x-8 lg:gap-y-6">
                            {[leader(12 + month), leader(60 + month)].map(({ car, lead }, i) => (
                              <div key={i}>
                                <p className="text-dim text-sm">
                                  {t("leader_since", {
                                    year:
                                      new Date(LATEST_TIMESTAMP).getFullYear() - (i === 0 ? 1 : 5),
                                  })}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-1.5">
                                  <span className="text-lg font-medium">{car}</span>
                                  {lead === -1 ? (
                                    <></>
                                  ) : (
                                    <span className="bg-washed dark:bg-washed-dark text-outlineHover-dark dark:text-outlineHover rounded-xl px-2 py-0.5 text-sm font-medium">
                                      {(lead === Infinity ? "∞" : numFormat(lead, "standard")) +
                                        t("%_lead")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex w-full gap-3 md:w-fit md:justify-end">
                          <List
                            className="mr-3.5 flex-nowrap"
                            current={data.period}
                            onChange={period => {
                              setData("period", period);
                            }}
                            options={[t("monthly"), t("cumulative")]}
                          />
                        </div>
                      </div>
                    )
                  }
                />
                {data.cars.length === 0 && (
                  <div className="z-10 flex h-[312px] w-full flex-col items-center justify-center">
                    <div className="border-outline dark:border-washed-dark bg-outline dark:bg-washed-dark flex flex-row items-center gap-2 rounded-md border px-3 py-1.5">
                      <MagnifyingGlassIcon className="size-5" />
                      {t("search_prompt")}
                    </div>
                  </div>
                )}
                <Slider
                  type="range"
                  period="month"
                  value={data.minmax}
                  data={timeseries.x}
                  onChange={e => setData("minmax", e)}
                />
              </div>
            )}
          </SliderProvider>
        </div>
      </Section>
    </>
  );
};

export default CarPopularityCompare;
