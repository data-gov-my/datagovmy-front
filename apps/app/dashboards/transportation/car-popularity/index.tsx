import { AgencyBadge, Container, Dropdown, Hero, Section } from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import { FunctionComponent } from "react";
import CarPopularityCompare, { Car } from "./compare";

/**
 * Car Popularity Dashboard
 * @overview Status: Live
 */

type TopCars = {
  maker: string;
  vehicles: number[];
};

interface CarPopularityProps {
  last_updated: string;
  next_update: string;
  cars: Array<OptionType & Car>;
  tableData: Record<"top_makers" | "top_models", WithData<Record<string, TopCars[]>>>;
  timeseries: any;
}

const CarPopularity: FunctionComponent<CarPopularityProps> = ({
  last_updated,
  next_update,
  cars,
  tableData,
  timeseries,
}) => {
  const { t } = useTranslation("dashboard-car-popularity");

  const YEAR_OPTIONS: OptionType[] = Object.keys(tableData.top_makers.data).map(val => {
    return { label: new Date(val).getFullYear().toString(), value: val };
  });

  const { data, setData } = useData({
    selectedYear: YEAR_OPTIONS.at(-1),
    topMakers: tableData.top_makers.data[YEAR_OPTIONS.at(-1)?.value || -1],
    topModels: tableData.top_models.data[YEAR_OPTIONS.at(-1)?.value || -1],
  });

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
        {/* Most popular car models and manufacturers in {year} */}
        <Section>
          <div className="space-y-6">
            <div className="flex w-full flex-col place-content-center place-items-center gap-3 sm:flex-row">
              <h4 className="text-center">{t("table_title")}</h4>
              <Dropdown
                width="w-fit"
                selected={data.selectedYear}
                onChange={e => {
                  setData("selectedYear", e);
                  setData("topMakers", tableData.top_makers.data[e.value]);
                  setData("topModels", tableData.top_models.data[e.value]);
                }}
                options={YEAR_OPTIONS.reverse()}
                anchor="left"
              />
            </div>

            <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12">
              <table className="lg:col-span-4 lg:col-start-3">
                <thead className="dark:border-washed-dark border-b-2">
                  <tr>
                    <th className="px-1 py-2 text-center text-sm font-medium">#</th>
                    <th className="px-1 py-2 text-start text-sm font-medium">
                      {t("column_model")}
                    </th>
                    <th className="px-1 py-2 text-end text-sm font-medium">
                      {t("column_vehicles")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topModels.map(
                    (item: { maker: string; model: string; vehicles: number }, i: number) => (
                      <tr
                        key={i}
                        className={clx(
                          "dark:border-washed-dark border-b",
                          i < 3 ? " bg-background dark:bg-background-dark" : ""
                        )}
                      >
                        <td
                          className={clx(
                            "px-1 py-2 text-center text-sm font-medium",
                            i < 3 ? " text-primary dark:text-primary-dark" : ""
                          )}
                        >
                          {i + 1}
                        </td>
                        <td className="w-1/2 px-1 py-2 text-start text-sm font-medium capitalize">
                          {`${item.maker} ${item.model}`}
                        </td>
                        <td className="px-1 py-2 text-end text-sm font-medium">
                          {item.vehicles.toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <table className="lg:col-span-4 lg:col-start-7">
                <thead className="dark:border-washed-dark border-b-2">
                  <tr>
                    <th className="px-1 py-2 text-center text-sm font-medium">#</th>
                    <th className="px-1 py-2 text-start text-sm font-medium">
                      {t("column_maker")}
                    </th>
                    <th className="px-1 py-2 text-end text-sm font-medium">
                      {t("column_vehicles")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topMakers.map((item: { maker: string; vehicles: number }, i: number) => (
                    <tr
                      key={i}
                      className={clx(
                        "dark:border-washed-dark border-b",
                        i < 3 ? " bg-background dark:bg-background-dark" : ""
                      )}
                    >
                      <td
                        className={clx(
                          "px-1 py-2 text-center text-sm font-medium",
                          i < 3 ? " text-primary dark:text-primary-dark" : ""
                        )}
                      >
                        {i + 1}
                      </td>
                      <td className="w-1/2 px-1 py-2 text-start text-sm font-medium capitalize">
                        {item.maker}
                      </td>
                      <td className="px-1 py-2 text-end text-sm font-medium">
                        {item.vehicles.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <CarPopularityCompare
          cars={cars}
          data_as_of={tableData.top_makers.data_as_of}
          timeseries={timeseries}
        />
      </Container>
    </>
  );
};

export default CarPopularity;
