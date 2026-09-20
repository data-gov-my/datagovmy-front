import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { routes } from "@lib/routes";
import { Periods } from "datagovmy-ui/charts/timeseries";
import {
  AgencyBadge,
  Button,
  Card,
  Container,
  Dropdown,
  Hero,
  Label,
  List,
  Modal,
  Section,
  Slider,
  Spinner,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useEffect, useMemo, useRef } from "react";
import { serviceSlug, slugLookup, stationSlug } from "./slug";
import { PairResult, PairSeries, useExplorerQuery } from "./useExplorerQuery";

/**
 * KTMB Explorer
 * @overview Status: Live
 *
 * The landing is static: the default pair's full series ships in the metadata
 * JSON, so the first chart paints with no client-side data fetching at all.
 * Everything after that is answered by DuckDB-WASM reading byte ranges from a
 * parquet on S3, which is what lets the page offer all history back to
 * 2020-10-15 instead of the rolling 8-week window the dashboard file carries --
 * and what removes the server render that used to sit behind every change.
 *
 * KTMB runs five services over the same page. A station name is unique only
 * within a service (there is a KL Sentral on both ETS and Komuter), so the
 * service is a real part of the selection and of the URL, not a label.
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

type ExplorerMeta = {
  data_as_of: string;
  data_last_updated: string;
  data_next_update: string;
  first_day: string;
  last_day: string;
  all_stations: string;
  services: string[];
  service_days: Record<string, { first_day: string; last_day: string }>;
  /** service -> its station labels */
  stations: Record<string, string[]>;
  /** service -> origin index -> reachable destination indices, into `stations[service]` */
  reachable: Record<string, Record<string, number[]>>;
  default: { service: string; origin: string; destination: string } & PairResult;
};

interface KTMBExplorerProps {
  explorer: ExplorerMeta;
}

/** A series is worth charting only if something actually travelled. */
const hasTrips = (series?: PairSeries) =>
  Boolean(series && series.daily.passengers.some(p => p > 0));

/**
 * How much of the series to show.
 *
 * The daily windows are whole numbers of weeks -- 4, 26 and 52 -- rather than
 * calendar months. Ridership swings hard between weekdays and weekends, so a
 * window holding, say, five Mondays but four Sundays tilts the shape and any
 * average drawn from it. A multiple of seven contains each weekday the same
 * number of times, which makes two windows honestly comparable.
 *
 * All of history is offered twice over, because the two answer different
 * questions: daily is every one of up to ~2,170 points, which shows the weekly
 * rhythm and one-off days but reads as noise at this width; monthly is ~70
 * points and shows the trend.
 *
 * Ordered widest-first, so the row reads left to right from all of history down
 * to the last four weeks, the zoom getting finer as the eye travels.
 */
const RANGES: Array<{
  id: string;
  /** i18n key under the dashboard-ktmb-explorer namespace */
  key: string;
  /** which aggregation of the pair to plot */
  freq: "daily" | "monthly";
  /** points to show, counting back from the latest; null means all of them */
  days: number | null;
}> = [
  { id: "all_monthly", key: "range_all_monthly", freq: "monthly", days: null },
  { id: "all", key: "range_all_daily", freq: "daily", days: null },
  { id: "1y", key: "range_1y", freq: "daily", days: 364 },
  { id: "6m", key: "range_6m", freq: "daily", days: 182 },
  { id: "1m", key: "range_1m", freq: "daily", days: 28 },
];

/**
 * All of history, daily.
 *
 * Affordable as a default because the default pair's whole series ships in the
 * static props -- the landing paints every one of ~1,100 points without a single
 * request, and DuckDB is only needed once someone picks a different pair. It
 * opens on the fullest view of the data there is; the monthly trend is one
 * click away for anyone who wants the shape instead of the detail.
 */
const DEFAULT_RANGE = "all";
const rangeById = (id: string) =>
  RANGES.find(r => r.id === id) ?? RANGES.find(r => r.id === DEFAULT_RANGE)!;

/**
 * Fixed width for the station dropdowns.
 *
 * Left to `w-fit` they resize to whatever is selected, so the row shifts under
 * the cursor on every pick. Sized to the 95th-percentile label rather than the
 * longest ("Bandar Tasek Selatan" and friends): fitting the outlier would make
 * every dropdown permanently wider than it needs to be, and the handful that
 * overflow truncate.
 */
const STATION_DROPDOWN_WIDTH = "w-full sm:w-56";
const SERVICE_DROPDOWN_WIDTH = "w-full sm:w-44";

const KTMBExplorer: FunctionComponent<KTMBExplorerProps> = ({ explorer }) => {
  const { t, i18n } = useTranslation(["dashboard-ktmb-explorer", "common"]);
  const { push, query, isReady } = useRouter();
  const { ready, queryPair } = useExplorerQuery();

  const { data, setData } = useData({
    loading: false,
    // Sized to the frequency DEFAULT_RANGE actually plots; an effect re-windows
    // it on first paint, but starting on the wrong series flashes a wrong slider.
    minmax: [0, explorer.default.A_to_B.daily.x.length - 1],
    range: DEFAULT_RANGE,
    service: explorer.default.service,
    origin: explorer.default.origin,
    destination: explorer.default.destination,
    // The mobile filter modal edits a draft, committed only on "Apply", so
    // browsing the dropdowns there neither queries nor touches the URL.
    draft_service: explorer.default.service,
    draft_origin: explorer.default.origin,
    draft_destination: explorer.default.destination,
    // Starts as the pair that shipped statically. Replaced wholesale by a
    // DuckDB result once someone picks something else.
    pair: {
      A_to_B: explorer.default.A_to_B,
      B_to_A: explorer.default.B_to_A,
      A_to_B_callout: explorer.default.A_to_B_callout,
      B_to_A_callout: explorer.default.B_to_A_callout,
    } as PairResult,
  });

  // The range toggle picks both the aggregation and how much of it is shown.
  const range = rangeById(data.range);
  const frequency = range.freq;

  /** Only the shortest window is about individual days. */
  const showDayOfMonth = frequency === "daily" && range.days !== null && range.days <= 31;

  /**
   * The axis ticks on months for every window but the shortest.
   *
   * This is a tick unit, not an aggregation -- the daily series still plots
   * every day. Putting ticks on month boundaries is what lets January be a tick
   * at all, and `enableMajorTick` then stops auto-skip from dropping it, which
   * is the only reliable way to get a year label onto a long span.
   */
  const PERIOD: Exclude<Periods, false | "millisecond" | "second" | "minute" | "week"> =
    showDayOfMonth ? "day" : "month";

  /** The slider follows the data, not the axis. */
  const SLIDER_PERIOD = frequency === "monthly" ? "month" : "day";

  /** Tooltips always name the actual point, whatever the ticks do. */
  const TOOLTIP_FORMAT = frequency === "monthly" ? "MMM yyyy" : "dd MMM yyyy";

  const A_to_B: PairSeries = data.pair.A_to_B;
  const B_to_A: PairSeries = data.pair.B_to_A;

  /**
   * Is the newest month still in progress?
   *
   * The data ends on whatever service day KTMB last published, so the final
   * monthly bucket is usually a part-month -- 19 days of September, say -- which
   * plots as a cliff that never happened. The callout wants that number, because
   * "This Month" means month-to-date, so it is dropped from the chart rather
   * than from the series.
   */
  const partialMonth = useMemo(() => {
    const [y, m, d] = explorer.last_day.split("-").map(Number);
    if (!y || !m || !d) return false;
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return d < daysInMonth;
  }, [explorer.last_day]);

  /** The series actually plotted, once the part-month is taken off. */
  const plotted = useCallback(
    (pair: PairSeries) => {
      if (frequency !== "monthly") return pair.daily;
      if (!partialMonth) return pair.monthly;
      return {
        x: pair.monthly.x.slice(0, -1),
        passengers: pair.monthly.passengers.slice(0, -1),
      };
    },
    [frequency, partialMonth]
  );

  const A_to_B_plot = plotted(A_to_B);
  const B_to_A_plot = plotted(B_to_A);

  /**
   * The window the range toggle asks for, as slider indices.
   *
   * Ranges are anchored to the end of the series -- "6 months" means the six
   * months up to the latest service day, not the first six on record -- so the
   * window is the last N points. A series shorter than the range shows whole.
   */
  const rangeWindow = useCallback((series: { x: number[] }, id: string): [number, number] => {
    const { days } = rangeById(id);
    const length = series.x.length;
    const last = Math.max(length - 1, 0);
    if (days === null || days >= length) return [0, last];
    return [length - days, last];
  }, []);

  // Re-window whenever the range or the pair changes. A new pair can be a
  // different length -- Komuter starts in 2023 where ETS starts in 2020 -- so
  // the indices cannot simply carry over.
  useEffect(() => {
    setData("minmax", rangeWindow(A_to_B_plot, data.range));
  }, [A_to_B, data.range, frequency]);

  const { coordinate: A_to_B_coords } = useSlice(A_to_B_plot, data.minmax);
  const { coordinate: B_to_A_coords } = useSlice(
    hasTrips(B_to_A) ? B_to_A_plot : A_to_B_plot,
    data.minmax
  );
  const LATEST_MONTH = A_to_B.monthly.x[A_to_B.monthly.x.length - 1];

  /** Stations and slug lookups are per service; see slug.ts. */
  const stationsFor = useCallback(
    (service: string) => explorer.stations[service] ?? [],
    [explorer.stations]
  );

  const bySlug = useMemo(
    () => slugLookup(stationsFor(data.service), explorer.all_stations),
    [data.service, stationsFor, explorer.all_stations]
  );
  const toSlug = useCallback(
    (station: string) => stationSlug(station, explorer.all_stations),
    [explorer.all_stations]
  );

  /** Does the window on screen cross a new year? */
  const spansYears = useMemo(() => {
    const xs = A_to_B_coords.x;
    if (!xs?.length) return false;
    return DateTime.fromMillis(xs[0]).year !== DateTime.fromMillis(xs[xs.length - 1]).year;
  }, [A_to_B_coords]);

  /**
   * Label each tick with the smallest thing that still distinguishes it.
   *
   * Chart.js writes the whole date on every tick, so a multi-year span repeats
   * the same year a dozen times and a six-month one repeats nothing useful at
   * all. A unit earns its place here only when it changes: the month always,
   * the day only in the 1-month window, and the year only where a new one
   * starts -- stacked underneath, so the handover is visible without crowding
   * the row. A window inside one year carries no year at all.
   *
   * The year test is on the tick's own date rather than its neighbour's,
   * because this callback is handed every candidate tick (182 of them for a
   * six-month window, one per day), not the handful that survive auto-skip --
   * so "different from the previous entry" would compare two adjacent days and
   * never fire.
   */
  const tickX = useCallback(
    function (this: any, value: any, index: number, ticks: Array<{ value: number }>) {
      const ts = ticks?.[index]?.value;
      if (typeof ts !== "number") return value;

      const at = DateTime.fromMillis(ts).setLocale(i18n.language);
      const label = showDayOfMonth ? at.toFormat("d LLL") : at.toFormat("LLL");
      if (!spansYears) return label;

      const startsAYear = at.month === 1 && at.day === 1;
      return startsAYear || index === 0 ? [label, at.toFormat("yyyy")] : label;
    },
    [spansYears, showDayOfMonth, i18n.language]
  );

  const isAllStations = (station: string) =>
    station === explorer.all_stations ? t("all_stations") : station;

  const SERVICE_OPTIONS = useMemo<Array<OptionType>>(
    () => explorer.services.map(s => ({ label: t(s), value: s })),
    [explorer.services, i18n.language]
  );

  /**
   * Station options, with the All Stations aggregate pinned to the top.
   *
   * The labels are sorted alphabetically and carry no code prefix, so
   * "All Stations" would otherwise sit wherever the letters put it -- after
   * "Abdullah Hukum", before "Alor Setar". It is the one entry that is not a
   * place, so it leads the list rather than hiding inside it.
   */
  const stationOptions = useCallback(
    (service: string, names: string[]): Array<OptionType> => {
      const all = names.filter(s => s === explorer.all_stations);
      const rest = names.filter(s => s !== explorer.all_stations);
      return [...all, ...rest].map(s => ({ label: isAllStations(s), value: s }));
    },
    [explorer.all_stations, i18n.language]
  );

  /**
   * Destinations are restricted to those actually reachable from the chosen
   * origin. Most origin/destination combinations within a service have never
   * carried a passenger, so an unfiltered list would mostly offer empty charts.
   */
  const reachableFrom = useCallback(
    (service: string, origin: string): string[] => {
      const names = stationsFor(service);
      const index = names.indexOf(origin);
      if (index < 0) return [];
      return (explorer.reachable[service]?.[String(index)] ?? []).map(i => names[i]);
    },
    [stationsFor, explorer.reachable]
  );

  const ORIGIN_OPTIONS = useMemo(
    () => stationOptions(data.service, stationsFor(data.service)),
    [data.service, stationsFor, stationOptions]
  );
  const DESTINATION_OPTIONS = useMemo(
    () => stationOptions(data.service, reachableFrom(data.service, data.origin)),
    [data.service, data.origin, reachableFrom, stationOptions]
  );
  const DRAFT_ORIGIN_OPTIONS = useMemo(
    () => stationOptions(data.draft_service, stationsFor(data.draft_service)),
    [data.draft_service, stationsFor, stationOptions]
  );
  const DRAFT_DESTINATION_OPTIONS = useMemo(
    () => stationOptions(data.draft_service, reachableFrom(data.draft_service, data.draft_origin)),
    [data.draft_service, data.draft_origin, reachableFrom, stationOptions]
  );

  /**
   * The destination to pair with a newly picked origin: the current one if it
   * is still reachable, otherwise All Stations, which every origin but All
   * Stations itself can reach, otherwise the first reachable station. Never
   * empty, so a pick always lands on a pair that can be charted and linked.
   *
   * Shuttle Tebrau has no All Stations aggregate -- with two stations it would
   * duplicate a real pair -- so the last fallback is the one that matters there.
   */
  const destinationFor = (service: string, origin: string, current: string): string => {
    const reachable = reachableFrom(service, origin);
    if (reachable.includes(current)) return current;
    if (reachable.includes(explorer.all_stations)) return explorer.all_stations;
    return reachable[0];
  };

  /**
   * A whole selection for a service, keeping what still makes sense.
   *
   * Switching service used to clear both stations and leave the page waiting
   * for two more picks. Station names do recur across services, so a name that
   * exists on the new service is kept; anything else falls back to All Stations,
   * which means the switch always lands on a chart.
   */
  const selectionFor = (service: string, origin: string, destination: string) => {
    const names = stationsFor(service);
    const nextOrigin = names.includes(origin)
      ? origin
      : names.includes(explorer.all_stations)
        ? explorer.all_stations
        : names[0];
    return {
      origin: nextOrigin,
      destination: destinationFor(service, nextOrigin, destination),
    };
  };

  const loadPair = useCallback(
    async (service: string, origin: string, destination: string) => {
      setData("loading", true);
      try {
        setData("pair", await queryPair(service, origin, destination));
      } catch (e) {
        // Leave whatever is on screen rather than blanking the chart; the URL
        // still reflects the request, so a reload retries it.
        console.error("KTMB explorer query failed", e);
      } finally {
        setData("loading", false);
      }
    },
    [queryPair]
  );

  /**
   * Load whatever pair is currently selected.
   *
   * This covers three entries: a shared link that opens on a pair other than
   * the default, a dropdown selection, and a back/forward step. `requested`
   * keeps it to one fetch per pair.
   *
   * The default pair is special-cased rather than skipped. Its series already
   * arrived in static props, so returning to it -- by going back, or by picking
   * it again -- restores from memory instead of querying, and crucially does
   * not leave the previous pair's chart on screen.
   */
  const requested = useRef<string | null>(null);
  useEffect(() => {
    if (!data.service || !data.origin || !data.destination) return;

    const key = `${data.service}|${data.origin}|${data.destination}`;
    if (requested.current === key) return;

    const isDefault =
      data.service === explorer.default.service &&
      data.origin === explorer.default.origin &&
      data.destination === explorer.default.destination;

    if (isDefault) {
      requested.current = key;
      setData("pair", {
        A_to_B: explorer.default.A_to_B,
        B_to_A: explorer.default.B_to_A,
        A_to_B_callout: explorer.default.A_to_B_callout,
        B_to_A_callout: explorer.default.B_to_A_callout,
      });
      return;
    }

    // Everything else needs DuckDB, so wait for it rather than marking the pair
    // as requested and never coming back to it.
    if (!ready) return;
    requested.current = key;
    loadPair(data.service, data.origin, data.destination);
  }, [ready, data.service, data.origin, data.destination]);

  /**
   * Keep the URL in step without a navigation. Shallow routing means Next does
   * not re-run `getStaticProps`, so the chart updates from the DuckDB result
   * while the address bar stays shareable.
   */
  const syncUrl = (service: string, origin: string, destination: string) => {
    push(
      {
        pathname: routes.KTMB_EXPLORER,
        query: {
          service: serviceSlug(service),
          origin: toSlug(origin),
          destination: toSlug(destination),
        },
      },
      undefined,
      { shallow: true, scroll: false, locale: i18n.language }
    );
  };

  /**
   * Follow the address bar, forwards and back.
   *
   * `push` with `shallow` adds a history entry without re-running
   * `getStaticProps`, so going back changes the URL and nothing else unless the
   * component watches it. The query is also how a shared link arrives, and it
   * is only readable once the router is ready: this page is statically
   * generated, so on the very first render there is no query to read yet.
   *
   * Naming one end is enough. A link that gives only an origin means "from here
   * to anywhere", and the reverse for a destination, so the other end falls back
   * to the All Stations aggregate rather than to nothing.
   */
  useEffect(() => {
    if (!isReady) return;

    const asked = (value: typeof query.service) => (typeof value === "string" ? value : undefined);

    const serviceSlugged = asked(query.service);
    const service =
      explorer.services.find(s => serviceSlug(s) === serviceSlugged || s === serviceSlugged) ??
      explorer.default.service;

    // Slugs resolve against the service being asked for, not the one on screen.
    const names = stationsFor(service);
    const lookup = slugLookup(names, explorer.all_stations);
    const from = typeof query.origin === "string" ? lookup.get(query.origin) : undefined;
    const to = typeof query.destination === "string" ? lookup.get(query.destination) : undefined;

    // Nothing named at all means the bare landing -- on first load, or on going
    // back to it after picking a pair -- which always shows the default pair.
    const bare = !serviceSlugged && !from && !to;
    const origin = bare
      ? explorer.default.origin
      : from ?? (to ? explorer.all_stations : explorer.default.origin);
    const destination = bare
      ? explorer.default.destination
      : to ?? (from ? explorer.all_stations : explorer.default.destination);

    const next = bare ? { origin, destination } : selectionFor(service, origin, destination);

    if (
      service === data.service &&
      next.origin === data.origin &&
      next.destination === data.destination
    )
      return;

    setData("service", service);
    setData("origin", next.origin);
    setData("destination", next.destination);
  }, [isReady, query.service, query.origin, query.destination]);

  // Selection only moves state and the URL; the effect above owns fetching, so
  // there is exactly one place that decides when a query runs.
  const selectPair = (service: string, origin: string, destination: string) => {
    if (!service || !origin || !destination) return;
    setData("service", service);
    setData("origin", origin);
    setData("destination", destination);
    syncUrl(service, origin, destination);
  };

  /** A new service is a new pair: keep both ends if they survive the switch. */
  const selectService = (service: string) => {
    const next = selectionFor(service, data.origin, data.destination);
    selectPair(service, next.origin, next.destination);
  };

  /** A new origin is a new pair: keep the destination if it survives. */
  const selectOrigin = (origin: string) =>
    selectPair(data.service, origin, destinationFor(data.service, origin, data.destination));

  /** The modal's equivalents, which only move the draft. */
  const selectDraftService = (service: string) => {
    const next = selectionFor(service, data.draft_origin, data.draft_destination);
    setData("draft_service", service);
    setData("draft_origin", next.origin);
    setData("draft_destination", next.destination);
  };

  const selectDraftOrigin = (origin: string) => {
    setData("draft_origin", origin);
    setData(
      "draft_destination",
      destinationFor(data.draft_service, origin, data.draft_destination)
    );
  };

  const chartDataset = (coords: { x: number[]; passengers: number[] }) => ({
    labels: coords.x,
    datasets: [
      {
        type: (coords.x.length === 1 ? "bar" : "line") as "bar" | "line",
        data: coords.passengers,
        label: t(`common:time.${frequency}`),
        fill: true,
        backgroundColor: AKSARA_COLOR.PRIMARY_H,
        borderColor: AKSARA_COLOR.PRIMARY,
        borderWidth: 1.5,
        barThickness: 12,
      },
    ],
  });

  const chartStats = (callout: { daily: number; monthly: number }) => [
    {
      title: t("common:time.daily"),
      value: `+${numFormat(callout.daily, "standard")}`,
    },
    {
      title: t("this_month", {
        date: toDate(LATEST_MONTH, "MMM yyyy", i18n.language),
      }),
      value: `${numFormat(callout.monthly, "standard")}`,
    },
  ];

  /**
   * The range toggles.
   *
   * `List` is the site's pill control -- the same one the vehicle-registrations
   * dashboard uses for its monthly/yearly switch -- so the selected state and
   * hover match every other dashboard rather than being styled by hand here.
   *
   * These sit on the controls row rather than in the Section header: five
   * labels as wordy as "All Time (Monthly)" wrapped onto a second line there.
   * `flex-nowrap` with a scroll fallback keeps them on one line at any width.
   */
  const rangeToggles = (
    <List
      className="hide-scrollbar flex-nowrap overflow-x-auto"
      current={Math.max(
        RANGES.findIndex(r => r.id === data.range),
        0
      )}
      onChange={index => setData("range", RANGES[index].id)}
      options={RANGES.map(r => t(r.key))}
    />
  );

  /** The mobile modal's dropdowns, which edit the draft selection. */
  const filters = () => (
    <>
      <div className="space-y-2 py-3">
        <Label label={t("service")} className="text-sm" />
        <Dropdown
          anchor="bottom"
          width="w-full"
          options={SERVICE_OPTIONS}
          selected={SERVICE_OPTIONS.find(e => e.value === data.draft_service)}
          onChange={selected => selectDraftService(selected.value)}
        />
      </div>
      <div className="space-y-2 py-3">
        <Label label={t("origin")} className="text-sm" />
        <Dropdown
          anchor="bottom-10"
          width="w-full"
          options={DRAFT_ORIGIN_OPTIONS}
          selected={DRAFT_ORIGIN_OPTIONS.find(e => e.value === data.draft_origin)}
          onChange={selected => selectDraftOrigin(selected.value)}
          enableSearch={DRAFT_ORIGIN_OPTIONS.length > 15}
        />
      </div>
      <div className="space-y-2 py-3">
        <Label label={t("destination")} className="text-sm" />
        <Dropdown
          anchor="right-0 bottom-10"
          width="w-full"
          options={DRAFT_DESTINATION_OPTIONS}
          selected={DRAFT_DESTINATION_OPTIONS.find(e => e.value === data.draft_destination)}
          disabled={!data.draft_origin}
          onChange={selected => setData("draft_destination", selected.value)}
          enableSearch={DRAFT_DESTINATION_OPTIONS.length > 15}
        />
      </div>
    </>
  );

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.transportation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="ktmb" />}
        last_updated={explorer.data_last_updated}
        next_update={explorer.data_next_update}
      />

      <Container>
        <Section title={t("title")} date={explorer.data_as_of} description={t("disclaimer")}>
          <SliderProvider>
            {play => (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 lg:pb-6">
                  <div className="flex sm:hidden">
                    <Modal
                      trigger={open => (
                        <Button
                          onClick={() => {
                            // Open on the selection on screen, not whatever was
                            // left in the draft by a modal closed unapplied.
                            setData("draft_service", data.service);
                            setData("draft_origin", data.origin);
                            setData("draft_destination", data.destination);
                            open();
                          }}
                          className="btn-default shadow-floating"
                        >
                          <span>{t("filters")}</span>
                          <span className="bg-primary dark:bg-primary-dark w-4.5 h-5 rounded-md text-center text-white">
                            3
                          </span>
                          <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
                        </Button>
                      )}
                      title={<Label label={t("filters") + ":"} className="text-sm font-bold" />}
                    >
                      {close => (
                        <div className="flex h-max flex-col bg-white dark:bg-black">
                          <div className="dark:divide-washed-dark divide-y px-3 pb-3">
                            {filters()}
                          </div>
                          <div className="dark:border-washed-dark flex w-full flex-col gap-2 border-t bg-white p-3 dark:bg-black">
                            <Button
                              variant="primary"
                              className="justify-center"
                              onClick={() => {
                                selectPair(
                                  data.draft_service,
                                  data.draft_origin,
                                  data.draft_destination
                                );
                                close();
                              }}
                            >
                              {t("apply_filter")}
                            </Button>
                            <Button variant="base" className="justify-center" onClick={close}>
                              <XMarkIcon className="h-4.5 w-4.5" />
                              {t("common:common.close")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Modal>
                  </div>
                  <div className="hidden gap-2 sm:flex sm:flex-wrap lg:gap-3">
                    <Dropdown
                      placeholder={t("service")}
                      anchor="left"
                      width={SERVICE_DROPDOWN_WIDTH}
                      options={SERVICE_OPTIONS}
                      selected={SERVICE_OPTIONS.find(e => e.value === data.service)}
                      onChange={selected => selectService(selected.value)}
                    />
                    <Dropdown
                      placeholder={t("select_origin")}
                      anchor="left"
                      width={STATION_DROPDOWN_WIDTH}
                      options={ORIGIN_OPTIONS}
                      selected={ORIGIN_OPTIONS.find(e => e.value === data.origin)}
                      onChange={selected => selectOrigin(selected.value)}
                      enableSearch={ORIGIN_OPTIONS.length > 15}
                    />
                    <Dropdown
                      placeholder={t("select_destination")}
                      anchor="left"
                      width={STATION_DROPDOWN_WIDTH}
                      options={DESTINATION_OPTIONS}
                      selected={DESTINATION_OPTIONS.find(e => e.value === data.destination)}
                      disabled={!data.origin}
                      onChange={selected => selectPair(data.service, data.origin, selected.value)}
                      enableSearch={DESTINATION_OPTIONS.length > 15}
                    />
                  </div>
                  {rangeToggles}
                </div>

                {data.loading ? (
                  <div className="flex h-[540px] items-center justify-center">
                    <Spinner loading={data.loading} />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                      <Timeseries
                        className="h-[420px] w-full"
                        title={t("ridership", {
                          from: isAllStations(data.origin),
                          to: isAllStations(data.destination),
                        })}
                        enableAnimation={!play}
                        interval={PERIOD}
                        enableMajorTick
                        tooltipFormat={TOOLTIP_FORMAT}
                        tickXCallback={tickX}
                        data={chartDataset(A_to_B_coords)}
                        stats={chartStats(data.pair.A_to_B_callout)}
                      />
                      {hasTrips(B_to_A) ? (
                        <Timeseries
                          className="h-[420px] w-full"
                          title={t("ridership", {
                            from: isAllStations(data.destination),
                            to: isAllStations(data.origin),
                          })}
                          enableAnimation={!play}
                          interval={PERIOD}
                          enableMajorTick
                          tooltipFormat={TOOLTIP_FORMAT}
                          tickXCallback={tickX}
                          data={chartDataset(B_to_A_coords)}
                          stats={chartStats(data.pair.B_to_A_callout)}
                        />
                      ) : (
                        <div className="relative flex h-[500px] w-full flex-col lg:h-full">
                          <h5>
                            {t("ridership", {
                              from: isAllStations(data.destination),
                              to: isAllStations(data.origin),
                            })}
                          </h5>
                          <Timeseries
                            className="absolute bottom-0 h-[420px] w-full opacity-30"
                            enableCrosshair={false}
                            enableTooltip={false}
                            gridOffsetX={true}
                            data={{
                              labels: B_to_A_coords.x,
                              datasets: [
                                {
                                  type: B_to_A_coords.x.length === 1 ? "bar" : "line",
                                  // Deliberately empty. This chart is only a
                                  // faded backdrop for the "no trips" card, so
                                  // it must not plot the forward series that
                                  // `B_to_A_coords` falls back to -- that would
                                  // show a shape behind a message saying there
                                  // is nothing to show.
                                  data: [],
                                  fill: true,
                                  borderWidth: 1,
                                  barThickness: 12,
                                },
                              ],
                            }}
                          />
                          <div className="z-10 flex h-full w-full flex-col items-center justify-center">
                            <Card className="bg-outline dark:bg-washed-dark flex flex-row items-center gap-2 rounded-md px-3 py-1.5">
                              <FaceFrownIcon className="h-6 w-6" />
                              {t("no_trips")}
                            </Card>
                          </div>
                        </div>
                      )}
                    </div>
                    <Slider
                      type="range"
                      period={SLIDER_PERIOD}
                      value={data.minmax}
                      data={A_to_B_plot.x}
                      onChange={e => setData("minmax", e)}
                    />
                  </>
                )}
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default KTMBExplorer;
