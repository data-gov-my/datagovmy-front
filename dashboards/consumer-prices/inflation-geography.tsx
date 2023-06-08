import Tabs, { Panel } from "@components/Tabs";
import { useData } from "@hooks/useData";
import { CountryAndStates, AKSARA_COLOR } from "@lib/constants";
import { useTranslation } from "@hooks/useTranslation";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useRef } from "react";
import { sortMulti } from "@lib/helpers";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

/**
 * Consumer Prices (CPI) - Inflation Geography Section
 * @overview Status: Live
 */

interface InflationGeographyProps {
  bar: any;
}

const InflationGeography: FunctionComponent<InflationGeographyProps> = ({ bar }) => {
  const { t } = useTranslation();
  const periods = ["yoy", "mom"];
  const { data, setData } = useData({
    active_state: "mys",
    active_index: 0,
    period_state: 0,
    period_category: 0,
  });

  const sortStateData = useCallback((period: string) => {
    let _data: Record<string, any[]> = {
      x: [],
      y: [],
    };
    let mys_overall = 0;

    Object.keys(bar.data[period]).forEach(state => {
      if (state !== "mys") {
        _data.x.push(state);
        _data.y.push(bar.data[period][state].y[0]);
      } else {
        mys_overall = bar.data[period][state].y[0];
      }
    });

    _data = sortMulti(_data, "y", (a: number, b: number) => b - a);
    _data.x.unshift("mys");
    _data.y.unshift(mys_overall);

    return _data;
  }, []);
  const sortCategoryData = useCallback(
    (period: string) => {
      let _data: Record<string, any[]> = {
        x: bar.data[period][data.active_state].x.slice(1),
        y: bar.data[period][data.active_state].y.slice(1),
      };
      const state_overall = bar.data[period][data.active_state].y[0];

      _data = sortMulti(_data, "y", (a: number, b: number) => b - a);
      _data.x.unshift("overall");
      _data.y.unshift(state_overall);

      return _data;
    },
    [data.active_state]
  );

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div>
        <Tabs
          title={t("consumer_prices.section_1.inflation_by_state")}
          onChange={index => setData("period_state", index)}
        >
          {periods.map(period => (
            <Panel name={t(`consumer_prices.section_1.${period}`)}>
              <Bar
                className="h-[400px] w-full lg:h-[550px]"
                layout="horizontal"
                enableGridY={false}
                type="category"
                unitY="%"
                formatX={key => CountryAndStates[key]}
                data={{
                  labels: sortStateData(period).x,
                  datasets: [
                    {
                      label: t("consumer_prices.section_1.inflation_by_state"),
                      data: sortStateData(period).y,
                      backgroundColor(ctx) {
                        return ctx.dataIndex === data.active_index
                          ? "#22C55E80"
                          : AKSARA_COLOR.OUTLINE;
                      },
                      hoverBackgroundColor(ctx) {
                        return ctx.dataIndex === data.active_index ? "#22C55E80" : AKSARA_COLOR.DIM;
                      },
                    },
                  ],
                }}
                onClick={(label, index) => {
                  setData("active_state", label);
                  setData("active_index", index);
                }}
              />
            </Panel>
          ))}
        </Tabs>
      </div>
      <div>
        <Tabs
          title={t("consumer_prices.section_1.inflation_by_category", {
            state: CountryAndStates[data.active_state],
          })}
        >
          {periods.map(period => (
            <Panel name={t(`consumer_prices.section_1.${period}`)}>
              <Bar
                className="h-[400px] w-full lg:h-[550px]"
                layout="horizontal"
                enableGridY={false}
                type="category"
                unitY="%"
                enableStep
                formatX={key => t(`consumer_prices.section_1.short_categories.${key}`)}
                data={{
                  labels: sortCategoryData(period).x,
                  datasets: [
                    {
                      label: t("consumer_prices.section_1.inflation_by_category", {
                        state: CountryAndStates[data.active_state],
                      }),
                      data: sortCategoryData(period).y,
                      backgroundColor(ctx) {
                        return ctx.dataIndex === 0 ? "#22C55E80" : AKSARA_COLOR.OUTLINE;
                      },
                      hoverBackgroundColor(ctx) {
                        return ctx.dataIndex === 0 ? "#22C55E80" : AKSARA_COLOR.DIM;
                      },
                    },
                  ],
                }}
              />
            </Panel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default InflationGeography;
