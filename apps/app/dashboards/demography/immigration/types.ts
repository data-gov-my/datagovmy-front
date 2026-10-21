/**
 * Shape of https://storage.data.gov.my/dashboards/immigration.json, written by cron_arrivals.py in
 * dataproc-jim. Countries are keyed by ISO2 (matching the "countries" i18n namespace), plus "ALL".
 */

export const CONTINENTS = [
  "asia",
  "europe",
  "oceania",
  "north_america",
  "south_america",
  "africa",
] as const;
export type Continent = (typeof CONTINENTS)[number];

/** Top 15 nationalities for one period; total is all arrivals in that period */
export type TopCountries = {
  total: number;
  /** male_share is male / (male + female): sex is not recorded for some arrivals from 2026-03 */
  rows: Array<{ country: string; arrivals: number; male_share: number | null }>;
};

export interface ImmigrationData {
  data_last_updated: string;
  data_next_update: string;
  data_as_of: string;
  x: string[];
  timeseries: Record<string, Record<"total" | "male" | "female", number[]>>;
  continents: Record<Continent, number[]>;
  key_sources: {
    start: string;
    end: string;
    countries: string[];
  };
}

/** x is in epoch milliseconds, as the timeseries chart expects */
export type Series = Record<"x" | "total" | "male" | "female", number[]>;

export const toYearly = (monthly: Series): Series => {
  const yearly: Series = { x: [], total: [], male: [], female: [] };
  monthly.x.forEach((ms, i) => {
    const year = Date.UTC(new Date(ms).getUTCFullYear(), 0, 1);
    if (yearly.x.at(-1) !== year) {
      yearly.x.push(year);
      (["total", "male", "female"] as const).forEach(k => yearly[k].push(0));
    }
    (["total", "male", "female"] as const).forEach(
      k => (yearly[k][yearly[k].length - 1] += monthly[k][i])
    );
  });
  return yearly;
};

/**
 * Top 15 nationalities for the past 12 months ("12m") and each calendar year, ranked by total
 * arrivals. Computed from the per-country series; shares are of the "ALL" total.
 */
export const topCountries = (data: ImmigrationData): Record<string, TopCountries> => {
  const periods: Record<string, number[]> = { "12m": data.x.map((_, i) => i).slice(-12) };
  data.x.forEach((date, i) => (periods[date.slice(0, 4)] ??= []).push(i));

  const sum = (values: number[], idx: number[]) => idx.reduce((acc, i) => acc + values[i], 0);
  const countries = Object.keys(data.timeseries).filter(c => c !== "ALL");

  return Object.fromEntries(
    Object.entries(periods).map(([period, idx]) => [
      period,
      {
        total: sum(data.timeseries.ALL.total, idx),
        rows: countries
          .map(country => ({ country, arrivals: sum(data.timeseries[country].total, idx) }))
          .sort((a, b) => b.arrivals - a.arrivals)
          .slice(0, 15)
          .map(row => {
            const male = sum(data.timeseries[row.country].male, idx);
            const female = sum(data.timeseries[row.country].female, idx);
            return { ...row, male_share: male + female ? (male / (male + female)) * 100 : null };
          }),
      },
    ])
  );
};

/** Percentage change between the latest value and the one `lag` steps earlier */
export const growth = (values: number[], lag: number): number | null => {
  const prev = values.at(-1 - lag);
  const last = values.at(-1);
  if (prev === undefined || last === undefined || prev === 0) return null;
  return ((last - prev) / prev) * 100;
};
