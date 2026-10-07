import { Dropdown, Section } from "datagovmy-ui/components";
import { clx, numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent, useMemo } from "react";
import Flag from "./flag";
import { TopCountries } from "./types";

export interface TopNationalitiesProps {
  data_as_of: string;
  top_countries: Record<string, TopCountries>;
}

const TopNationalities: FunctionComponent<TopNationalitiesProps> = ({
  data_as_of,
  top_countries,
}) => {
  const { t, i18n } = useTranslation(["dashboard-immigration", "countries", "common"]);

  const PERIOD_OPTIONS = useMemo<OptionType[]>(() => {
    const latestYear = data_as_of.slice(0, 4);
    const latestMonth = toDate(data_as_of, "MMM", i18n.language);
    return Object.keys(top_countries)
      .sort((a, b) => (a === "12m" ? -1 : b === "12m" ? 1 : b.localeCompare(a)))
      .map(key => ({
        value: key,
        label:
          key === "12m"
            ? t("section_1.period_12m")
            : key === latestYear && !data_as_of.startsWith(`${latestYear}-12`)
              ? t("section_1.period_ytd", { year: key, month: latestMonth })
              : key,
      }));
  }, [top_countries, data_as_of, i18n.language]);

  const { data, setData } = useData({ period: PERIOD_OPTIONS[0] });
  const period = top_countries[data.period.value];

  return (
    <Section>
      <div className="space-y-6">
        <div className="flex w-full flex-col items-center gap-3">
          <h4 className="text-center">{t("section_1.title")}</h4>
          <Dropdown
            width="w-fit"
            anchor="left-1/2 -translate-x-1/2"
            selected={data.period}
            options={PERIOD_OPTIONS}
            onChange={e => setData("period", e)}
          />
        </div>

        <table className="mx-auto w-full max-w-2xl">
          <thead className="dark:border-washed-dark border-b-2">
            <tr>
              <th className="px-1 py-2 text-center text-sm font-medium">#</th>
              <th className="px-1 py-2 text-start text-sm font-medium">
                {t("section_1.column_nationality")}
              </th>
              <th className="px-1 py-2 text-end text-sm font-medium">
                {t("section_1.column_arrivals")}
              </th>
              <th className="px-1 py-2 text-end text-sm font-medium">
                {t("section_1.column_share")}
              </th>
              <th className="px-1 py-2 text-end text-sm font-medium">
                {t("section_1.column_male")}
              </th>
            </tr>
          </thead>
          <tbody>
            {period.rows.map((row, i) => (
              <tr
                key={row.country}
                className={clx(
                  "dark:border-washed-dark border-b",
                  i < 3 && "bg-background dark:bg-background-dark"
                )}
              >
                <td
                  className={clx(
                    "px-1 py-2 text-center text-sm font-medium",
                    i < 3 && "text-purple"
                  )}
                >
                  {i + 1}
                </td>
                <td className="px-1 py-2 text-start text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Flag country={row.country} />
                    {t(`countries:${row.country}`)}
                  </div>
                </td>
                <td className="px-1 py-2 text-end text-sm font-medium tabular-nums">
                  {numFormat(row.arrivals, "standard")}
                </td>
                <td className="px-1 py-2 text-end text-sm font-medium tabular-nums">
                  {period.total
                    ? `${numFormat((row.arrivals / period.total) * 100, "standard", 1)}%`
                    : "-"}
                </td>
                <td className="px-1 py-2 text-end text-sm font-medium tabular-nums">
                  {row.male_share === null ? "-" : `${numFormat(row.male_share, "standard", 0)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
};

export default TopNationalities;
