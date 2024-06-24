import { routes } from "@lib/routes";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  List,
  Section,
  Slider,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, TimeseriesOption, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";

/**
 * Vehicle Registration Dashboard
 * @overview Status: Live
 */

const VEHICLES = ["car", "motorcycle", "lorry", "van", "bus", "other"];
const FUEL = ["petrol", "greendiesel", "diesel", "hybrid", "electric", "other"];

type Vehicle = (typeof VEHICLES)[number];
type Fuel = (typeof FUEL)[number];

interface VehicleRegistrationsProps {
  last_updated: string;
  next_update: string;
  dropdown: string[];
  params: { vehicle_type: string };
  vehicle_timeseries: WithData<Record<string, Record<Vehicle | "x", number[]>>>;
  vehicle_timeseries_callout: WithData<Record<Vehicle | "x", Record<"latest" | "alltime", number>>>;
  fuel_timeseries: WithData<Record<string, Record<Fuel | "x", number[]>>>;
  fuel_timeseries_callout: WithData<Record<Fuel | "x", Record<"latest" | "alltime", number>>>;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const VehicleRegistrations: FunctionComponent<VehicleRegistrationsProps> = ({
  last_updated,
  next_update,
  dropdown,
  params,
  vehicle_timeseries,
  vehicle_timeseries_callout,
  fuel_timeseries,
  fuel_timeseries_callout,
}) => {
  const { t, i18n } = useTranslation("dashboard-vehicle-registrations");
  const { push } = useRouter();

  const config: { [key: string]: TimeseriesOption } = {
    0: {
      period: "month",
      periodly: "monthly",
    },
    1: {
      period: "year",
      periodly: "yearly",
    },
  };

  const VEHICLE_OPTIONS: OptionType[] = dropdown.map(key => ({
    label: t(key),
    value: key,
  }));

  const { data, setData } = useData({
    vehicle_type: params.vehicle_type,
    fuel_index: 0,
    fuel_minmax: [0, fuel_timeseries.data.monthly.x.length - 1],
    fuel_period: "month",
    fuel_periodly: "monthly",

    index: 0,
    minmax: [0, vehicle_timeseries.data.monthly.x.length - 1],
    period: "month",
    periodly: "monthly",
  });

  const LATEST_TIMESTAMP =
    vehicle_timeseries.data[data.periodly].x[vehicle_timeseries.data[data.periodly].x.length - 1];

  const { coordinate } = useSlice(vehicle_timeseries.data[data.periodly], data.minmax);
  const { coordinate: fuel_coords } = useSlice(
    fuel_timeseries.data[data.fuel_periodly],
    data.fuel_minmax
  );

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.transportation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        next_update={next_update}
        agencyBadge={<AgencyBadge agency="jpj" />}
      />
      <Container>
        {/* Registrations by Fuel Type */}
        <Section
          title={t("registration_by_fuel")}
          description={
            <div className="flex flex-col justify-center gap-3">
              <p>{t("registrations_not_licenses")}</p>
              <Dropdown
                anchor="left"
                width="w-full sm:w-fit"
                options={VEHICLE_OPTIONS}
                selected={
                  data.vehicle_type
                    ? VEHICLE_OPTIONS.find(e => e.value === data.vehicle_type)
                    : undefined
                }
                onChange={selected => {
                  setData("vehicle_type", selected.value);
                  push(
                    `${routes.VEHICLE_REGISTRATIONS}/${
                      selected.value === "all" ? "" : selected.value
                    }`,
                    {
                      scroll: false,
                    }
                  );
                }}
              />
            </div>
          }
          date={fuel_timeseries.data_as_of}
          menu={
            <List
              current={data.fuel_index}
              onChange={index => {
                setData("fuel_index", index);
                setData("fuel_minmax", [
                  0,
                  fuel_timeseries.data[config[index].periodly].x.length - 1,
                ]);
                setData("fuel_period", config[index].period);
                setData("fuel_periodly", config[index].periodly);
              }}
              options={[t("common:time.monthly"), t("common:time.yearly")]}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
                  {FUEL.map(fuel => (
                    <Timeseries
                      key={fuel}
                      title={t(`fuel.${fuel}`)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval={data.fuel_period}
                      data={{
                        labels: fuel_coords.x,
                        datasets: [
                          {
                            type: "line",
                            data: fuel_coords[fuel],
                            label: t(`common:time.${data.fuel_periodly}`),
                            fill: true,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            borderWidth: 1.5,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: `+${numFormat(
                            fuel_timeseries_callout.data[fuel].latest,
                            "standard"
                          )}`,
                        },
                        {
                          title: t("since"),
                          value: numFormat(fuel_timeseries_callout.data[fuel].alltime, "standard"),
                        },
                      ]}
                    />
                  ))}
                </div>
                <Slider
                  type="range"
                  period={data.fuel_period}
                  value={data.fuel_minmax}
                  data={fuel_timeseries.data[data.fuel_periodly].x}
                  onChange={e => setData("fuel_minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        {/* Registrations by Vehicle Type */}
        <Section
          title={t("registration_by_vehicle")}
          description={t("registrations_not_licenses")}
          date={vehicle_timeseries.data_as_of}
          menu={
            <List
              current={data.index}
              onChange={index => {
                setData("index", index);
                setData("minmax", [
                  0,
                  vehicle_timeseries.data[config[index].periodly].x.length - 1,
                ]);
                setData("period", config[index].period);
                setData("periodly", config[index].periodly);
              }}
              options={[t("common:time.monthly"), t("common:time.yearly")]}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
                  {VEHICLES.map(vehicle => (
                    <Timeseries
                      key={vehicle}
                      title={t(vehicle)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval={data.period}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[vehicle],
                            label: t(`common:time.${data.periodly}`),
                            fill: true,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            borderWidth: 1.5,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: `+${numFormat(
                            vehicle_timeseries_callout.data[vehicle].latest,
                            "standard"
                          )}`,
                        },
                        {
                          title: t("since"),
                          value: numFormat(
                            vehicle_timeseries_callout.data[vehicle].alltime,
                            "standard"
                          ),
                        },
                      ]}
                    />
                  ))}
                </div>
                <Slider
                  type="range"
                  period={data.period}
                  value={data.minmax}
                  data={vehicle_timeseries.data[data.periodly].x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default VehicleRegistrations;
